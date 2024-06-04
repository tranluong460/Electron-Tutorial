import { Category as ICategory } from '@system/database/entities'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import { TitleTableCategory } from './_components'
import { useEffect, useState } from 'react'
import { Category } from '@renderer/apis'

const CategoryYoutube = (): JSX.Element => {
  const [dataCategory, setDataCategory] = useState<ICategory[]>([])

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
    }
  ]

  const checkCategory = async (): Promise<void> => {
    await Category.getAll().then((data) => setDataCategory(data))
  }

  useEffect(() => {
    checkCategory()
  }, [dataCategory])

  return (
    <Table
      rowKey="name"
      title={() => <TitleTableCategory />}
      columns={columns}
      dataSource={dataCategory}
    />
  )
}

export default CategoryYoutube
