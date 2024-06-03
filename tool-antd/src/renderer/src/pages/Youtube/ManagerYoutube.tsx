import { Table } from 'antd'
import { Youtube } from '@renderer/apis/youtube'
import { IAccountYoutube } from '@renderer/interface'
import { AccountYoutube } from '@system/database/entities'
import { TitleTableYoutube } from './_components'
import { useEffect, useState } from 'react'
import type { TableProps } from 'antd'

const ManagerYoutube = (): JSX.Element => {
  const [dataAccount, setDataAccount] = useState<AccountYoutube[]>()

  const columns: TableProps<IAccountYoutube>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_t, _r, index) => index + 1
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    }
  ]

  const getDataAccount = async (): Promise<void> =>
    await Youtube.getAllAccount().then((result) => {
      setDataAccount(result)
    })

  useEffect(() => {
    getDataAccount()
  }, [dataAccount])

  return (
    <Table
      title={() => <TitleTableYoutube />}
      bordered
      rowKey="email"
      columns={columns}
      dataSource={dataAccount}
    />
  )
}

export default ManagerYoutube
