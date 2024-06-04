import { Category as ICategory } from '@system/database/entities'
import { Button, Flex, Form, Input, Modal, message } from 'antd'
import { useState } from 'react'
import type { FormProps } from 'antd'
import { Category } from '@renderer/apis'

const TitleTableCategory = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onFinish: FormProps<ICategory>['onFinish'] = async (values) => {
    setLoading(true)

    await Category.create(values)
      .then((result) => {
        if (result) {
          message.success('Thêm thành công')
          setIsModalOpen(false)
        } else {
          message.error('Thêm thất bại')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const toggleModal = (): void => setIsModalOpen(!isModalOpen)

  return (
    <Flex align="center" justify="end" gap="large">
      <Button onClick={toggleModal}>Thêm</Button>

      <Modal title="Thêm danh mục" open={isModalOpen} onCancel={toggleModal} footer={null}>
        <Form layout="vertical" style={{ maxWidth: 600 }} onFinish={onFinish} autoComplete="off">
          <Form.Item<ICategory>
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập têb!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="flex items-center justify-center" wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}

export default TitleTableCategory
