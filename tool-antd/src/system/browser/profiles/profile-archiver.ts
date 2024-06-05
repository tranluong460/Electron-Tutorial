/* eslint-disable @typescript-eslint/explicit-function-return-type */
import AdmZip from 'adm-zip'
import { promises as _promises } from 'fs'
import path from 'path'

import { getDirectoriesForArchiver } from './profile-directories-to-remove'

const { access } = _promises

export const archiveProfile = async (profileFolder = '', tryAgain = true) => {
  const folderExists = await access(profileFolder).then(
    () => true,
    () => false
  )
  if (!folderExists) {
    throw new Error('Invalid profile folder path: ' + profileFolder)
  }

  const archive = new AdmZip()
  archive.addLocalFolder(path.join(profileFolder, 'Default'), 'Default')
  try {
    archive.addLocalFile(path.join(profileFolder, 'First Run'))
  } catch (e) {
    archive.addFile('First Run', Buffer.from(''))
  }

  const dirsToRemove = getDirectoriesForArchiver()
  dirsToRemove.forEach((entry) => archive.deleteFile(entry))

  const archiveIsValid = checkProfileArchiveIsValid(archive)
  if (tryAgain && !archiveIsValid) {
    await new Promise<void>((r) => setTimeout(() => r(), 300))

    return archiveProfile(profileFolder, false)
  }

  return new Promise((resolve, reject) => archive.toBuffer(resolve, reject))
}

export const decompressProfile = async (zipPath = '', profileFolder = ''): Promise<void> => {
  const zipExists = await access(zipPath).then(
    () => true,
    () => false
  )
  if (!zipExists) {
    throw new Error('Invalid zip path: ' + zipPath)
  }

  const archive = new AdmZip(zipPath)
  archive.getEntries().forEach((elem) => {
    if (
      !elem.isDirectory &&
      (elem.entryName.includes('RunningChromeVersion') ||
        elem.entryName.includes('SingletonLock') ||
        elem.entryName.includes('SingletonSocket') ||
        elem.entryName.includes('SingletonCookie'))
    ) {
      archive.deleteFile(elem)
    }
  })

  archive.extractAllTo(profileFolder, true)
}

export const checkProfileArchiveIsValid = (zipObject): boolean => {
  if (!zipObject) {
    throw new Error('No zip object provided')
  }

  return (
    zipObject
      .getEntries()
      .map((elem) => {
        if (elem.isDirectory) {
          return false
        }

        return elem.entryName.includes('Preferences') || elem.entryName.includes('Cookies')
      })
      .filter(Boolean).length >= 2
  )
}
