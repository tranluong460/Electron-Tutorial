import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Layout, theme } from 'antd'
import { Footer, Header, Sider } from '@renderer/components'

const BasePage = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  return (
    <Layout>
      <Header collapsed={collapsed} colorBgContainer={colorBgContainer} />

      <Layout>
        <Sider collapsed={collapsed} onCollapsed={() => setCollapsed(!collapsed)} />

        <Layout>
          <Layout.Content>
            <div
              className={`p-2 mt-[70px] mb-[50px] mr-[10px] duration-200 min-h-[720px] ${collapsed ? 'ml-[85px]' : 'ml-[205px]'}`}
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG
              }}
            >
              <div className="max-w-[1420px]">
                <Outlet />
              </div>
            </div>
          </Layout.Content>

          <Footer collapsed={collapsed} colorBgContainer={colorBgContainer} />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BasePage
