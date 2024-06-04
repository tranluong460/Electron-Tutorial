import { useEffect, useState } from 'react'
import { Button, Flex, Form, Modal, Select, message } from 'antd'
import { YoutubeDrawer } from './.'
import { Category, Youtube } from '@renderer/apis'
import type { FormProps } from 'antd'
import { Category as ICategory } from '@system/database/entities'

type TitleTableYoutubeType = {
  dataSelection: string[]
}

const TitleTableYoutube = ({ dataSelection }: TitleTableYoutubeType): JSX.Element => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [form] = Form.useForm()
  const [openModal, setOpenModal] = useState(false)
  const toggleOpenDrawer = (): void => setOpenDrawer(!openDrawer)
  const [dataCategory, setDataCategory] = useState<ICategory[]>()
  const key = 'set_category'
  const [messageApi, contextHolder] = message.useMessage()

  const handleDeleteAccount = async (): Promise<void> => {
    if (dataSelection.length === 0) {
      message.error('Chọn ít nhất một tài khoản')
      return
    }

    await Youtube.deleteAccount(dataSelection)
  }

  const handleSetCategory = async (): Promise<void> => {
    if (dataSelection.length === 0) {
      message.error('Chọn ít nhất một tài khoản')
      return
    }

    setOpenModal(true)
  }

  const toggleCloseModal = (): void => {
    setOpenModal(false)
    form.resetFields()
  }

  const onFinish: FormProps<ISetCategoryNew>['onFinish'] = async (values) => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading ...'
    })

    const dataSet = {
      category: values.category,
      dataAccount: dataSelection
    }

    await Category.setCategory(dataSet).then((result) => {
      if (result) {
        messageApi.open({
          key,
          type: 'success',
          content: 'Thêm danh mục thành công'
        })

        toggleCloseModal()
      } else {
        messageApi.open({
          key,
          type: 'error',
          content: 'Thêm danh mục thất bại'
        })
      }
    })
  }

  useEffect(() => {
    const getCate = async (): Promise<void> => {
      await Category.getAll().then((result) => setDataCategory(result))
    }

    getCate()
  }, [])

  return (
    <>
      {contextHolder}

      <Flex align="center" justify="end" gap="large">
        <Button onClick={toggleOpenDrawer}>Nhập dữ liệu</Button>
        <Button onClick={handleSetCategory}>Thêm danh mục</Button>
        <Button danger onClick={handleDeleteAccount}>
          Xóa tài khoản
        </Button>
      </Flex>

      <Modal open={openModal} onCancel={toggleCloseModal} footer={null}>
        <Form
          form={form}
          layout="vertical"
          className="p-5"
          style={{ maxWidth: 600 }}
          initialValues={dataCategory}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Chọn danh mục" name="category">
            <Select
              options={
                dataCategory &&
                dataCategory.map((category) => ({
                  label: category.name,
                  value: category.id
                }))
              }
            />
          </Form.Item>

          <Form.Item className="flex items-center justify-center" wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <YoutubeDrawer openDrawer={openDrawer} toggleOpenDrawer={toggleOpenDrawer} />
    </>
  )
}

export default TitleTableYoutube
