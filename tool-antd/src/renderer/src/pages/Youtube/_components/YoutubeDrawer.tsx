import { Youtube } from '@renderer/apis'
import { useState } from 'react'
import { Button, Drawer, Flex, Form, Input, Select, Table, message } from 'antd'
import type { FormProps, TableProps } from 'antd'
import { AccountYoutube } from '@system/database/entities'

type YoutubeDrawerDrawerProps = {
  openDrawer: boolean
  toggleOpenDrawer: () => void
}

const YoutubeDrawer = ({ openDrawer, toggleOpenDrawer }: YoutubeDrawerDrawerProps): JSX.Element => {
  const key = 'import_excel_account_youtube'
  const [messageApi, contextHolder] = message.useMessage()
  const [dataAccount, setDataAccount] = useState<IDataExcel[]>([])
  const [type, setType] = useState<string>()

  const columns: TableProps<IDataExcel>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
      render: (_t, _r, index) => index + 1
    },
    ...(type === 'email|password|phone'
      ? [
          { title: 'Email', dataIndex: 'email', key: 'email' },
          { title: 'Password', dataIndex: 'password', key: 'password' },
          { title: 'Phone', dataIndex: 'phone', key: 'phone' }
        ]
      : [
          { title: 'Email', dataIndex: 'email', key: 'email' },
          { title: 'Password', dataIndex: 'password', key: 'password' },
          { title: 'Email Recovery', dataIndex: 'emailRecovery', key: 'emailRecovery' }
        ])
  ]

  const handleChange = (value: string): void => {
    setDataAccount([])
    setType(value)
  }

  const toggleImportExcel = async (): Promise<void> => {
    if (!type) {
      message.error('Vui lòng chọn kiểu dữ liệu')
      return
    }

    await Youtube.importExcel(type).then((result) => {
      setDataAccount(result)
    })
  }

  const toggleImportText = async (): Promise<void> => {
    if (!type) {
      message.error('Vui lòng chọn kiểu dữ liệu')
      return
    }

    await Youtube.importText(type).then((result) => {
      setDataAccount(result)
    })
  }

  const createNewDataExcel = async (): Promise<void> => {
    if (!dataAccount) return

    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...'
    })

    if (!type) return

    await Youtube.createNewDataExcel({
      dataAccount,
      type
    }).then((result) => {
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

  const onFinish: FormProps<AccountYoutube>['onFinish'] = async (values) => {
    if (!values) return

    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...'
    })

    await Youtube.createNewDataExcel(values).then((result) => {
      if (result) {
        messageApi.open({
          key,
          type: 'success',
          content: 'Nhập dữ liệu thành công'
        })

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
          <Form layout="horizontal" onFinish={onFinish} autoComplete="off">
            <Form.Item<AccountYoutube> label="Email" name="email">
              <Input />
            </Form.Item>

            <Form.Item<AccountYoutube> label="Mật khẩu" name="password">
              <Input />
            </Form.Item>

            <Form.Item<AccountYoutube> label="Số điện thoại" name="phone">
              <Input />
            </Form.Item>

            <Form.Item className="flex justify-center items-center">
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>

          <Table
            title={() => (
              <Flex align="center" gap={10} justify="end">
                <Select
                  defaultValue={type}
                  style={{ width: 250 }}
                  onChange={handleChange}
                  options={[
                    { value: 'email|password|phone', label: 'email|password|phone' },
                    { value: 'email|password|emailRecovery', label: 'email|password|emailRecovery' }
                  ]}
                />
                <Button onClick={toggleImportExcel}>Excel</Button>
                <Button onClick={toggleImportText}>Text</Button>
              </Flex>
            )}
            rowKey="email"
            bordered
            columns={columns}
            dataSource={dataAccount}
          />
        </Flex>
      </Drawer>
    </>
  )
}

export default YoutubeDrawer
