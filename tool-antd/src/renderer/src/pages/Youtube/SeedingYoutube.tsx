import { Button, Form, Input, Checkbox, InputNumber } from 'antd'
import type { FormProps } from 'antd'

type FieldType = {
  stream: string
  link: string
  actions: string[]
  comments: string
}

const SeedingYoutube = (): JSX.Element => {
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

    console.log({ ...values, link: newLinks, comments: newComments })
  }

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 300 }}
      autoComplete="off"
      initialValues={{ stream: 2 }}
    >
      <Form.Item<FieldType>
        label="Số luồng chạy đồng thời"
        name="stream"
        rules={[{ required: true, message: 'Vui lòng nhập số luồng chạy!' }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item<FieldType>
        label="Nhập link video"
        name="link"
        rules={[{ required: true, message: 'Vui lòng nhập link video!' }]}
      >
        <Input.TextArea rows={4} placeholder="Mỗi link video là một dòng" />
      </Form.Item>

      <Form.Item<FieldType> label="Hành động" name="actions">
        <Checkbox.Group options={checkBoxOptions} />
      </Form.Item>

      <Form.Item<FieldType> label="Nội dung bình luận" name="comments">
        <Input.TextArea rows={4} placeholder="Mỗi bình luận là một dòng" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Bắt đầu
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SeedingYoutube
