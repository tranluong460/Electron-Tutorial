import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { HomeOutlined, ProductOutlined, YoutubeOutlined, CommentOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

type SiderProps = {
  collapsed: boolean
  onCollapsed: () => void
}

const Sider = ({ collapsed, onCollapsed }: SiderProps): JSX.Element => {
  const navigate = useNavigate()
  const location = useLocation()

  const getItem = (
    label: React.ReactNode,
    key: React.Key | null,
    icon: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      onClick: key !== null ? (): void => navigate(key.toString()) : undefined
    } as MenuItem
  }

  const menuItems: MenuItem[] = [
    getItem('Trang chủ', '/', <HomeOutlined />),
    getItem('Quản lý youtube', null, <ProductOutlined />, [
      getItem('Quản lý tài khoản', '/youtube/manager', <YoutubeOutlined />),
      getItem('Seeding', '/youtube/seeding', <CommentOutlined />)
    ])
  ]

  return (
    <Layout.Sider
      style={{
        top: 0,
        left: 0,
        zIndex: 50,
        height: '100vh',
        overflow: 'auto',
        position: 'fixed',
        marginTop: '4rem'
      }}
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapsed}
    >
      <Menu
        mode="inline"
        theme="light"
        items={menuItems}
        className="h-screen"
        defaultSelectedKeys={[location.pathname]}
      />
    </Layout.Sider>
  )
}

export default Sider
