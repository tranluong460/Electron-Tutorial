import { Youtube } from '@renderer/apis'
import { useState } from 'react'
import { Button, Drawer, Flex, Table, message } from 'antd'
import type { TableProps } from 'antd'

type ImportAccountYoutubeDrawerProps = {
  openDrawer: boolean
  toggleOpenDrawer: () => void
}

const ImportYoutubeDrawer = ({
  openDrawer,
  toggleOpenDrawer
}: ImportAccountYoutubeDrawerProps): JSX.Element => {
  const key = 'import_excel_account_youtube'
  const [messageApi, contextHolder] = message.useMessage()
  const [dataAccount, setDataAccount] = useState<IDataExcelYoutube[]>([])

  const columns: TableProps<IDataExcelYoutube>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
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

  const toggleImportExcel = async (): Promise<void> =>
    await Youtube.importExcel().then((result) => {
      setDataAccount(result)
    })

  const createNewDataExcel = async (): Promise<void> => {
    if (!dataAccount) return

    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...'
    })

    await Youtube.createNewDataExcel(dataAccount).then((result) => {
      if (result) {
        messageApi.open({
          key,
          type: 'success',
          content: 'Nhập dữ liệu thành công'
        })

        setDataAccount([])
        toggleOpenDrawer()
      } else {
        messageApi.open({
          key,
          type: 'error',
          content: 'Nhập dữ liệu thất bại'
        })
      }
    })
  }

  return (
    <>
      {contextHolder}

      <Drawer
        extra={
          <Button
            onClick={createNewDataExcel}
            disabled={dataAccount.length > 0 ? false : true}
            type="primary"
          >
            Nhập dữ liệu
          </Button>
        }
        width={720}
        title="Nhập dữ liệu youtube"
        open={openDrawer}
        onClose={toggleOpenDrawer}
      >
        <Flex vertical gap="large">
          <Flex align="center" justify="end">
            <Button onClick={toggleImportExcel}>Excel</Button>
          </Flex>

          <Table rowKey="email" bordered columns={columns} dataSource={dataAccount} />
        </Flex>
      </Drawer>
    </>
  )
}

export default ImportYoutubeDrawer
