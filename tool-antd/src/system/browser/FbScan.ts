import { Row } from '@fast-csv/format'
import { promise, queueAsPromised } from 'fastq'
import _, { isUndefined } from 'lodash'
import { MessagePort } from 'node:worker_threads'
import { Member, MemberScan } from '../db/entity'
import { FbAuth, FbFanPage, FbGroup, FbPost, FbProfile, formatFbNumber } from '../fb'
import { SCAN_PER_ACC } from '../helper'
import CsvFile from '../helper/CsvFile'
import { logger } from '../utils'
import { closeChromeFacebook } from './connect'
import Position from './task-manager/Position'
type ExportTask = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  file: CsvFile
}
export default class FbScan {
  portMessage: MessagePort
  // positionPool: PositionPool<ScanTask>
  positionPool: Position<ScanTask>

  constructor(portMessage: MessagePort, positionPool: Position<ScanTask>) {
    this.portMessage = portMessage
    this.positionPool = positionPool
  }
  exportCsv(task: ExportTask): void {
    const asyncExportWorker = async (task: ExportTask): Promise<void> => {
      await task.file.append(task.data as Row[]).catch((error) => console.error('csvFile: ', error))
    }
    const q: queueAsPromised<ExportTask> = promise(asyncExportWorker, 1)
    q.push(task)
  }
  async changeAccount(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    await closeChromeFacebook(chrome, task.account!)
  }

  async scanGroupMember(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    await FbGroup.needGotoGroup(chrome.page, task.uidNeedScan)
    let current = 0
    let has_next_page = true
    let cursor = task.cursor

    if (!(await FbAuth.isLoggedIn(task.account!, chrome.page))) {
      await closeChromeFacebook(chrome, task.account!).finally(() => {
        task.account = this.positionPool.getIdleAccount(task.account)!
        this.positionPool.tranferTask(task)
      })
      return
    }
    if (!cursor) {
      const resultRoot = await FbGroup.getMember(chrome.page, task.uidNeedScan)
      if (resultRoot) {
        has_next_page = resultRoot.has_next_page
        cursor = resultRoot.cursor
        await Member.save(
          _.compact(
            resultRoot.list.map((member: FbGroupMember) => {
              if (member.id) {
                ++task.scaned
                current++
                return Member.create({
                  ...member,
                  main_id: task.uidNeedScan
                })
              }
              return
            })
          )
        )
        await MemberScan.update(
          { uid_group: task.uidNeedScan },
          {
            number_scan: task.scaned,
            member_count: resultRoot.member_count
          }
        ).finally(() => this.portMessage.postMessage('update-member-count'))
      }
    }

    do {
      try {
        const result = await FbGroup.getMemberPaginate(chrome.page, task.uidNeedScan, cursor)
        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          await Member.save(
            _.compact(
              result.list.map((member: FbGroupMember) => {
                if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                  return
                }
                if (member.id) {
                  ++task.scaned
                  current++
                  return Member.create({
                    ...member,
                    main_id: task.uidNeedScan
                  })
                }
                return
              })
            )
          )
          await MemberScan.update(
            { uid_group: task.uidNeedScan },
            {
              number_scan: task.scaned
            }
          ).finally(() => this.portMessage.postMessage('send-count'))

          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            await closeChromeFacebook(chrome, task.account!).finally(() => {
              task.account = this.positionPool.getIdleAccount(task.account)!
              this.positionPool.tranferTask(task)
            })
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          if (cursor) {
            task.cursor = cursor
            await closeChromeFacebook(chrome, task.account!).finally(() => {
              task.account = this.positionPool.getIdleAccount(task.account)!
              this.positionPool.tranferTask(task)
            })
          }
          break
        }
      } catch (error) {
        logger.error(error, 'scanGroupMember catch')
        await closeChromeFacebook(chrome, task.account!).finally(() => {
          task.account = this.positionPool.getIdleAccount(task.account)!
          this.positionPool.tranferTask(task)
        })
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    if (chrome.browser.connected)
      await closeChromeFacebook(chrome, task.account!).finally(() => {
        task.account = this.positionPool.getIdleAccount(task.account)!
        if (task.limitPerAccount > 0 && task.scaned < task.limitPerAccount)
          this.positionPool.tranferTask(task)
      })
    return
  }

  async scanGroupInfo(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    try {
      if (!(await FbAuth.login(task.account!, chrome.page))) {
        this.positionPool.taskQueue.push(task)
        await closeChromeFacebook(chrome, task.account)
        return
      }
      await FbGroup.needGotoGroup(chrome.page, task.uidNeedScan)

      const result = await FbGroup.getInfo(chrome.page, task.uidNeedScan)
      if (result?.id) {
        const censorship = await FbGroup.getCensorship(
          chrome.page,
          task.uidNeedScan,
          task.account!.uid
        )
        this.portMessage.postMessage({
          ...result,
          censorship: censorship ? 'Kiểm Duyệt' : ' Không Kiểm Duyệt',
          group_member_profiles: formatFbNumber(result.group_member_profiles || '0')
        })
      } else {
        console.log('no content')
        this.positionPool.taskQueue.push(task)
      }
    } catch (error) {
      logger.error(error, '[Scan info group]')
    }
    await closeChromeFacebook(chrome, task.account)
  }

  async scanGroupByKeyword(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor
    await FbGroup.needGotoGroupSearch(chrome.page, task.uidNeedScan)
    if (!cursor) {
      const initResult = await FbGroup.getGroupByKey(chrome.page, task.uidNeedScan)
      if (initResult) {
        has_next_page = initResult.has_next_page
        cursor = initResult.cursor
        initResult.list.map(async (group: FbGroupInfoByKeyword) => {
          if (group.id) {
            const censorship = await FbGroup.getCensorship(chrome.page, group.id, task.account!.uid)
            ++task.scaned
            current++
            this.portMessage.postMessage({
              ...group,
              censorship: censorship ? 'Kiểm Duyệt' : ' Không Kiểm Duyệt',
              group_member_profiles: formatFbNumber(group.group_member_profiles || '0')
            })
          }
        })
      }
    }
    do {
      try {
        const result = await FbGroup.getGroupByKeyPaginate(chrome.page, task.uidNeedScan, cursor!)
        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          while (result.list.length > 0) {
            const data = result.list.shift()!
            if (data.id) {
              ++task.scaned
              current++
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                break
              }
              const censorship = await FbGroup.getCensorship(
                chrome.page,
                data.id,
                task.account!.uid
              )
              this.portMessage.postMessage({
                ...data,
                censorship: censorship ? 'Kiểm Duyệt' : ' Không Kiểm Duyệt',
                group_member_profiles: formatFbNumber(data.group_member_profiles || '0')
              })
            }
          }
          // result.list.forEach(async (group: FbGroupInfoByKeyword) => {
          // 	if (group.id) {
          // 		++task.scaned
          // 		current++
          // 		if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
          // 			return
          // 		}
          // 		const censorship = await FbGroup.getCensorship(
          // 			chrome.page,
          // 			group.id,
          // 			task.account!.uid
          // 		)
          // 		this.portMessage.postMessage({
          // 			...group,
          // 			censorship: censorship ? 'Kiểm Duyệt' : ' Không Kiểm Duyệt',
          // 			group_member_profiles: formatFbNumber(group.group_member_profiles || '0')
          // 		})
          // 	}
          // })
          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, '[Scan group by keyword]')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
  }

  async scanFanPageByKeyword(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    await FbFanPage.needGotoFanPageSearch(chrome.page, task.uidNeedScan)
    let current = 0
    let has_next_page = true
    let cursor = task.cursor || 'null'

    if (!cursor) {
      const initResult = await FbFanPage.getFanPageByKey(chrome.page, task.uidNeedScan)
      if (initResult) {
        has_next_page = initResult.has_next_page
        cursor = initResult.cursor
        initResult.list.map((fanpage: FanPageInfoByKeyword) => {
          if (fanpage.id) {
            current++
            ++task.scaned
            this.portMessage.postMessage({
              ...fanpage,
              countFollower: formatFbNumber(fanpage.countFollower || '0')
            })
          }
        })
      }
    }

    do {
      try {
        const result = await FbFanPage.getFanPageByKeyPaginate(
          chrome.page,
          task.uidNeedScan,
          cursor
        )

        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          while (result.list.length > 0) {
            const data = result.list.shift()!
            if (data.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                break
              }
              this.portMessage.postMessage({
                ...data,
                countFollower: formatFbNumber(data.countFollower || '0')
              })
            }
          }
          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          console.log(`no result`)
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        this.positionPool.taskQueue.push(task)
        logger.error(error, 'scanFanPageByKeyword catch')
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
  }

  async scanProfileFriend(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    await FbProfile.needGotoProfile(chrome.page, task.uidNeedScan)
    let current = 0
    let has_next_page = true
    let cursor = task.cursor

    do {
      try {
        const result = await FbProfile.getFriendsGraph(chrome.page, task.uidNeedScan, cursor)

        if (result && result.list.length > 0) {
          cursor = result.cursor
          has_next_page = result.has_next_page

          result.list.map((data: ProfileFriendInfo) => {
            if (data.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage(data)
            }
          })
        } else {
          this.portMessage.postMessage({
            id: 0,
            mainId: task.uidNeedScan,
            name: 'Riêng tư'
          })
          break
        }
        if (
          (SCAN_PER_ACC - current <= 0 && has_next_page) ||
          !(await FbAuth.login(task.account!, chrome.page))
        ) {
          task.cursor = cursor
          this.positionPool.taskQueue.push(task)
          break
        }
        if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
          break
        }
      } catch (error) {
        logger.error(error, 'scanProfileFriend catch')
        this.positionPool.taskQueue.push(task)
      }
    } while (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)

    await closeChromeFacebook(chrome, task.account)
  }

  async scanProfileGroup(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    await FbProfile.needGotoProfile(chrome.page, task.uidNeedScan)
    let current = 0
    let has_next_page = true
    let cursor = task.cursor

    do {
      try {
        const result = await FbProfile.getGroups(
          chrome.page,
          task.uidNeedScan,
          task.account!.token!
        )
        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          const groups: Array<ProfileGroupInfo> = []
          await Promise.all(
            result.list.map(async (group: ProfileGroupInfo) => {
              if (group.id) {
                current++
                group.mainId = task.uidNeedScan
                group.memberCount = group.group_member_profiles.count
                group.censorship = (await FbGroup.getCensorship(
                  chrome.page,
                  group.id,
                  task.uidNeedScan
                ))
                  ? 'Kiểm duyệt'
                  : 'Không kiểm duyệt'
                groups.push(group)
              }
            })
          )
          _.forEach(groups, (group) => this.portMessage.postMessage(group))
          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanProfileGroup catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (has_next_page && SCAN_PER_ACC - current > 0)
    await closeChromeFacebook(chrome, task.account)
  }

  async scanProfileFollower(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor

    do {
      try {
        const result = await FbProfile.getFollowers(chrome.page, task.uidNeedScan, cursor)

        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          result.list.map((follow: ProfileFollowerInfo) => {
            if (follow.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage(follow)
            }
          })
          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanProfileFollower catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
  }

  async scanProfileFollowing(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor

    do {
      try {
        const result = await FbProfile.getFollowings(chrome.page, task.uidNeedScan, cursor)

        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          result.list.map((follow: ProfileFollowerInfo) => {
            if (follow.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage(follow)
            }
          })
          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanProfileFollowing catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
  }

  async scanProfileInfo(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let result: ProfileInfo | undefined
    try {
      result = await FbProfile.getInfoGraph(chrome.page, task.uidNeedScan)
      if (result && result.id) {
        this.portMessage.postMessage(result)
      } else {
        this.positionPool.taskQueue.push(task)
      }
    } catch (error) {
      logger.error(error, 'scanProfileInfo catch')
      if (!result) this.positionPool.taskQueue.push(task)
    }
    await closeChromeFacebook(chrome, task.account)
  }

  async scanPostList(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    switch (task.postType!) {
      case 'group':
        await this.scanPostListGroup(chrome, task)
        break

      case 'fanpage':
        await this.scanPostListFanPage(chrome, task)
        break

      default:
        await this.scanPostListProfile(chrome, task)
        break
    }
    return
  }

  async scanPostListProfile(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor
    do {
      try {
        const result = await FbProfile.getPosts(chrome.page, task.uidNeedScan, cursor)
        if (result) {
          cursor = result.cursor
          has_next_page = result.has_next_page

          result.list.map((post: PostInfo) => {
            if (post.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage(post)
            }
          })
          if (SCAN_PER_ACC - current <= 0 || !(await FbAuth.login(task.account!, chrome.page))) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanPostListProfile catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
    return
  }

  async scanPostListGroup(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor
    do {
      try {
        const result = await FbGroup.getPosts(chrome.page, task.uidNeedScan, cursor)
        if (result) {
          cursor = result.cursor
          has_next_page = result.has_next_page

          result.list.map((post: PostInfo) => {
            if (post.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage(post)
            }
          })
          if (SCAN_PER_ACC - current <= 0 || !(await FbAuth.login(task.account!, chrome.page))) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanPostListGroup catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )

    await closeChromeFacebook(chrome, task.account)
  }

  async scanPostListFanPage(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor
    do {
      try {
        const result = await FbFanPage.getPosts(chrome.page, task.uidNeedScan, cursor)

        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor

          result.list.map((post: PostInfo) => {
            if (post.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage(post)
            }
          })

          if (SCAN_PER_ACC - current <= 0 || !(await FbAuth.login(task.account!, chrome.page))) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanPostListFanPage catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
  }

  async scanPostInteraction(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor

    do {
      try {
        const result = await FbPost.getInteractions(chrome.page, task.uidNeedScan, cursor)

        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          result.list.map((data: PostInteraction) => {
            current++
            if (data.id) {
              this.portMessage.postMessage(data)
            }
          })

          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanPostInteraction catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (has_next_page && SCAN_PER_ACC - current > 0)
    await closeChromeFacebook(chrome, task.account)
  }

  async scanPostComment(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor
    let cursor_deep = task.deep_cursor
    let has_next_page_deep = true

    do {
      try {
        const result = await FbPost.getComments(chrome.page, task.uidNeedScan, cursor)

        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          result.list.map(async (data: PostComment) => {
            if (data.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage(data)
              // scan deep
              if (data.legacy_fbid) {
                do {
                  const deep = await FbPost.getCommentsDeep(
                    chrome.page,
                    task.uidNeedScan,
                    data.legacy_fbid,
                    cursor_deep
                  )
                  if (deep) {
                    has_next_page_deep = deep.has_next_page
                    cursor_deep = result.cursor
                    deep.list.map((data: PostComment) => {
                      if (data.id) {
                        current++
                        ++task.scaned
                        if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                          return
                        }
                        this.portMessage.postMessage(data)
                      }
                    })
                    if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                      break
                    }
                  } else {
                    break
                  }
                } while (
                  has_next_page_deep &&
                  (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
                )
              }
            }
          })

          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            return
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanPostComment catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
  }

  async scanPostShare(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let cursor = task.cursor
    let has_next_page = true

    if (!cursor) {
      const initShare = await FbPost.getShares(chrome.page, task.uidNeedScan)
      if (initShare) {
        has_next_page = initShare.has_next_page
        cursor = initShare.cursor
        initShare.list.map((data: PostShareInfo) => {
          if (data.id) {
            current++
            ++task.scaned
            this.portMessage.postMessage({
              ...data,
              message: isUndefined(data.message) ? '' : data.message
            })
          }
        })
      }
    }

    do {
      try {
        const result = await FbPost.getSharesPaginate(chrome.page, task.uidNeedScan, cursor)

        if (result) {
          cursor = result.cursor
          has_next_page = result.has_next_page
          result.list.map((data: PostShareInfo) => {
            if (data.id) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage({
                ...data,
                message: isUndefined(data.message) ? '' : data.message
              })
            }
          })

          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            break
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanPostShare catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
  }

  async scanCommentsReel(chrome: IBrowserLauncher, task: ScanTask): Promise<void> {
    let current = 0
    let has_next_page = true
    let cursor = task.cursor
    // let cursor_deep = task.deep_cursor
    // let has_next_page_deep = true

    do {
      try {
        const result = await FbPost.getCommentsReel(chrome.page, task.uidNeedScan, cursor)

        if (result) {
          has_next_page = result.has_next_page
          cursor = result.cursor
          result.list.map(async (data: ReelComments) => {
            if (data.id_post) {
              current++
              ++task.scaned
              if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
                return
              }
              this.portMessage.postMessage(data)
              // scan deep
              // if (data.legacy_fbid) {
              // 	do {
              // 		const deep = await FbPost.getCommentsDeep(
              // 			chrome.page,
              // 			task.uidNeedScan,
              // 			data.legacy_fbid,
              // 			cursor_deep
              // 		)
              // 		if (deep) {
              // 			has_next_page_deep = deep.has_next_page
              // 			cursor_deep = result.cursor
              // 			deep.list.map((data: PostComment) => {
              // 				if (data.id) {
              // 					current++
              // 					++task.scaned
              // 					if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
              // 						return
              // 					}
              // 					this.portMessage.postMessage(data)
              // 				}
              // 			})
              // 			if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
              // 				break
              // 			}
              // 		} else {
              // 			break
              // 		}
              // 	} while (
              // 		has_next_page_deep &&
              // 		(SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
              // 	)
              // }
            }
          })

          if (
            (SCAN_PER_ACC - current <= 0 && has_next_page) ||
            !(await FbAuth.login(task.account!, chrome.page))
          ) {
            task.cursor = cursor
            this.positionPool.taskQueue.push(task)
            break
          }
          if (task.limitPerAccount > 0 && task.scaned > task.limitPerAccount) {
            return
          }
        } else {
          this.positionPool.taskQueue.push(task)
          break
        }
      } catch (error) {
        logger.error(error, 'scanPostComment catch')
        this.positionPool.taskQueue.push(task)
        break
      }
    } while (
      has_next_page &&
      (SCAN_PER_ACC - current > 0 || task.limitPerAccount - task.scaned > 0)
    )
    await closeChromeFacebook(chrome, task.account)
  }
}
