import { Button, Table, Tag } from 'antd'
import { Youtube } from '@renderer/apis/youtube'
import { AccountYoutube } from '@system/database/entities'
import { EditModal, TitleTableYoutube } from './_components'
import { useEffect, useState } from 'react'
import type { TableProps } from 'antd'

const ManagerYoutube = (): JSX.Element => {
  const [dataAccount, setDataAccount] = useState<AccountYoutube[]>()
  const [dataSelection, setDataSelection] = useState<string[]>([])
  const [dataEdit, setDataEdit] = useState<AccountYoutube | null>(null)
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleEdit = (dataEdit: AccountYoutube): void => {
    setDataEdit(dataEdit)
    setOpenModalEdit(true)
  }

  const toggleModal = (): void => {
    setDataEdit(null)
    setOpenModalEdit(!openModalEdit)
  }

  const columns: TableProps<AccountYoutube>['columns'] = [
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
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryId',
      key: 'categoryId.id',
      render: (_t) => _t && <Tag color="magenta">{_t.name}</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_t, r) => (
        <div>
          <Button onClick={() => handleEdit(r)}>Sửa</Button>
        </div>
      )
    }
  ]

  const rowSelection = {
    onChange: (selectedRowKeys): void => {
      setDataSelection(selectedRowKeys)
    }
  }

  const getDataAccount = async (): Promise<void> =>
    await Youtube.getAllAccount().then((result) => setDataAccount(result))

  useEffect(() => {
    getDataAccount()
  }, [dataAccount])

  return (
    <>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        title={() => <TitleTableYoutube dataSelection={dataSelection} />}
        bordered
        rowKey="email"
        columns={columns}
        dataSource={dataAccount}
      />

      {dataEdit && (
        <EditModal dataEdit={dataEdit} toggleModal={toggleModal} openModalEdit={openModalEdit} />
      )}
    </>
  )
}

export default ManagerYoutube
