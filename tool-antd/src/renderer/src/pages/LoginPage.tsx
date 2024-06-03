import { Auth } from '@renderer/apis'
import { useState } from 'react'
import { Button, Flex, Form, Input, message } from 'antd'
import type { FormProps } from 'antd'

type FieldType = {
  username: string
  password: string
}

const LoginPage = (): JSX.Element => {
  const [loading, setLoading] = useState(false)

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setLoading(true)

    await Auth.login(values).then(async (result) => {
      setLoading(false)

      if (result) {
        message.success('Đăng nhập thành công')

        await new Promise((resolve) => setTimeout(resolve, 500))

        window.location.reload()
      } else {
        message.error('Đăng nhập thất bại')
      }
    })
  }

  return (
    <Flex vertical align="center" gap="large" justify="center" className="min-h-screen">
      <h1 className="text-3xl">Đăng nhập</h1>

      <Form
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ username: 'hotboyson', password: 'l0u9o0n7g' }} // cspell: disable-line
      >
        <Form.Item<FieldType>
          label="Tài khoản"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default LoginPage
