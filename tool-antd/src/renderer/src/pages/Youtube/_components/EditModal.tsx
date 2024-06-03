import { Youtube } from '@renderer/apis'
import { AccountYoutube } from '@system/database/entities'
import { Button, Form, Input, Modal, message } from 'antd'
import type { FormProps } from 'antd'
import { useState } from 'react'

type EditModalProps = {
  dataEdit: AccountYoutube
  toggleModal: () => void
  openModalEdit: boolean
}

const EditModal = ({ dataEdit, toggleModal, openModalEdit }: EditModalProps): JSX.Element => {
  const [loading, setLoading] = useState(false)

  const onFinish: FormProps<AccountYoutube>['onFinish'] = async (values) => {
    setLoading(true)

    await Youtube.editAccount(values)
      .then((result) => {
        if (result) {
          message.success('Sửa thành công')
          toggleModal()
        } else {
          message.error('Sửa thất bại')
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <Modal open={openModalEdit} onCancel={toggleModal} footer={null}>
      <Form
        layout="vertical"
        className="p-5"
        style={{ maxWidth: 600 }}
        initialValues={dataEdit}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<AccountYoutube> label="ID" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item<AccountYoutube> label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item<AccountYoutube> label="Mật khẩu" name="password">
          <Input />
        </Form.Item>

        <Form.Item<AccountYoutube> label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sửa
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditModal
