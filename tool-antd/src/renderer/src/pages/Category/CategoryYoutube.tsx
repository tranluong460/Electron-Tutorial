import { Category as ICategory } from '@system/database/entities'
import type { TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { Category } from '@renderer/apis'
import { Button, Table, Flex, Form, Input, Modal, message } from 'antd'
import type { FormProps } from 'antd'

const CategoryYoutube = (): JSX.Element => {
  const [dataCategory, setDataCategory] = useState<ICategory[]>([])
  const [dataSelection, setDataSelection] = useState<number[]>([])
  const [dataEdit, setDataEdit] = useState<ICategory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onFinish: FormProps<ICategory>['onFinish'] = async (values) => {
    setLoading(true)

    if (dataEdit) {
      await Category.edit(values)
        .then((result) => {
          if (result) {
            message.success('Sửa thành công')
            toggleModal()
          } else {
            message.error('Sửa thất bại')
          }
        })
        .finally(() => {
          setLoading(false)
        })

      return
    }

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

  const toggleModal = (): void => {
    setIsModalOpen(!isModalOpen)
    dataEdit && setDataEdit(null)
  }

  const columns: TableProps<ICategory>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_t, _r, index) => index + 1
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_t) => (
        <div>
          <Button onClick={() => handleEdit(_t)}>Sửa</Button>
        </div>
      )
    }
  ]

  const handleEdit = async (dataEdit: ICategory): Promise<void> => {
    setDataEdit(dataEdit)
    toggleModal()
  }

  const checkCategory = async (): Promise<void> =>
    await Category.getAll().then((data) => setDataCategory(data))

  const rowSelection = {
    onChange: (selectedRowKeys): void => {
      setDataSelection(selectedRowKeys)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (dataSelection.length === 0) {
      message.success('Chọn ít nhất 1 dữ liệu')
      return
    }

    await Category.delete(dataSelection)
  }

  useEffect(() => {
    checkCategory()
  }, [dataCategory])

  return (
    <Table
      rowSelection={{
        type: 'checkbox',
        ...rowSelection
      }}
      rowKey="id"
      title={() => (
        <Flex align="center" justify="end" gap="large">
          <Button onClick={toggleModal}>Thêm</Button>
          <Button danger onClick={handleDelete}>
            Xóa danh mục
          </Button>

          <Modal
            key={dataEdit ? dataEdit.id : 'Add'}
            title={dataEdit ? 'Sửa danh mục' : 'Thêm danh mục'}
            open={isModalOpen}
            onCancel={toggleModal}
            footer={null}
          >
            <Form
              layout="vertical"
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              autoComplete="off"
              initialValues={dataEdit ? dataEdit : undefined}
            >
              {dataEdit && (
                <Form.Item<ICategory> label="ID" name="id">
                  <Input disabled />
                </Form.Item>
              )}

              <Form.Item<ICategory>
                label="Tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập têb!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item className="flex items-center justify-center" wrapperCol={{ offset: 6 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {dataEdit ? 'Sửa' : 'Tạo'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Flex>
      )}
      columns={columns}
      dataSource={dataCategory}
    />
  )
}

export default CategoryYoutube
