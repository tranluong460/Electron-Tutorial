import { Youtube } from '@renderer/apis'
import { AccountYoutube } from '@system/database/entities'
import { Button, Form, Input, Checkbox, InputNumber, Flex, Select } from 'antd'
import type { FormProps } from 'antd'
import { useEffect, useState } from 'react'

type FieldType = {
  stream: string
  link: string
  actions: string[]
  comments: string
  accounts: number[]
  max_time_video: string
  delay_time: string
}

const SeedingYoutube = (): JSX.Element => {
  const [dataAccount, setDataAccount] = useState<AccountYoutube[]>()

  const checkBoxOptions = [
    { label: 'Like', value: 'like' },
    { label: 'Dislike', value: 'dislike' },
    { label: 'Subscribe', value: 'subscribe' }
  ]

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const newLinks = values.link
      .split('\n')
      .map((link) => link.trim())
      .filter((link) => link.length > 0)

    const newComments = values.comments
      .split('\n')
      .map((link) => link.trim())
      .filter((link) => link.length > 0)

    await Youtube.seedingVideo({
      ...values,
      links: newLinks,
      comments: newComments,
      stream: Number(values.stream),
      max_time_video: Number(values.max_time_video),
      delay_time: Number(values.delay_time)
    })
  }

  useEffect(() => {
    const getDataAccount = async (): Promise<void> => {
      await Youtube.getAllAccount().then((data) => setDataAccount(data))
    }

    getDataAccount()
  }, [])

  return (
    <Flex align="center" justify="center" vertical={true} gap={50}>
      <h1 className="text-3xl mt-3">Seeding video youtube</h1>

      <Form
        layout="vertical"
        onFinish={onFinish}
        className="ml-10 2xl:w-[1250px] xl:w-[1100px] lg:w-[800px] md:w-[430px]"
        autoComplete="off"
        initialValues={{ stream: 2, max_time_video: 1, delay_time: 3 }}
      >
        <div className="flex">
          <Form.Item<FieldType>
            label="Số luồng chạy đồng thời"
            name="stream"
            rules={[{ required: true, message: 'Vui lòng nhập số luồng chạy!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Xem video tối đa (phút)"
            name="max_time_video"
            rules={[{ required: true, message: 'Thời gian xem video' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Thời gian đợi 1 hành động (giây)"
            name="delay_time"
            rules={[{ required: true, message: 'Thời gian đợi 1 hành động' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </div>

        <Form.Item
          label="Chọn tài khoản"
          name="accounts"
          rules={[{ required: true, message: 'Chọn 1 tài khoản!' }]}
        >
          <Select
            mode="multiple"
            options={
              dataAccount &&
              dataAccount.map((account) => ({
                label: account.email,
                value: account.id
              }))
            }
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Nhập link video"
          name="link"
          rules={[{ required: true, message: 'Vui lòng nhập link video!' }]}
        >
          <Input.TextArea rows={4} placeholder="Mỗi link video là một dòng" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Hành động"
          name="actions"
          rules={[{ required: true, message: 'Chọn 1 hành động!' }]}
        >
          <Checkbox.Group options={checkBoxOptions} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Nội dung bình luận"
          name="comments"
          rules={[{ required: true, message: 'Nhập nội dung!' }]}
        >
          <Input.TextArea rows={4} placeholder="Mỗi bình luận là một dòng" />
        </Form.Item>

        <Form.Item className="flex items-center justify-center">
          <Button type="primary" htmlType="submit">
            Bắt đầu
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default SeedingYoutube
