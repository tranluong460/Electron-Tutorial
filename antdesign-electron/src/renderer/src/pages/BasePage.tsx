import { Outlet } from 'react-router-dom'
import React, { useState } from 'react'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu } from 'antd'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5')
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />)
]

const BasePage = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0
        }}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              cursor: 'pointer',
              padding: '12px'
            }}
          >
            <span style={{ fontSize: '1.5rem', lineHeight: '2rem' }}>Electron</span>
          </div>
        </div>

        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 30,
            display: 'flex',
            background: 'white',
            alignItems: 'center',
            justifyContent: 'right',
            gap: 30
          }}
        />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#fff'
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            marginTop: '10px',
            textAlign: 'center',
            margin: '0 16px',
            background: '#fff'
          }}
        >
          Electron ©{new Date().getFullYear()} Created by Alone
        </Footer>
      </Layout>
    </Layout>
  )
}

export default BasePage
