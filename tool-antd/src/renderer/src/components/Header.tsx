import { useState } from 'react'
import { Logo, SettingDrawer } from './.'
import { Avatar, Dropdown, Flex, Layout, message } from 'antd'
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Auth } from '@renderer/apis'

type HeaderProps = {
  collapsed: boolean
  colorBgContainer: string
}

const Header = ({ collapsed, colorBgContainer }: HeaderProps): JSX.Element => {
  const key = 'logout_account'
  const [openSetting, setOpenSetting] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const toggleSettingDrawer = (): void => setOpenSetting(!openSetting)

  const toggleLogout = async (): Promise<void> => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...'
    })

    await Auth.logout().then(async (result) => {
      if (result) {
        messageApi.open({
          key,
          type: 'success',
          content: 'Đăng xuất thành công'
        })

        await new Promise((resolve) => setTimeout(resolve, 500))

        window.location.reload()
      } else {
        messageApi.open({
          key,
          type: 'error',
          content: 'Đăng xuất thất bại'
        })
      }
    })
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
      onClick: toggleSettingDrawer
    },
    {
      type: 'divider'
    },
    {
      key: '2',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: toggleLogout
    }
  ]

  return (
    <>
      {contextHolder}

      <Layout.Header
        className={`z-50 pr-5 fixed w-screen duration-200 ${collapsed ? 'pl-5' : 'pl-[70px]'}`}
        style={{ background: colorBgContainer }}
      >
        <Flex align="center" justify="space-between" vertical={false}>
          <Flex>
            <Logo />
          </Flex>

          <Flex className="pr-5">
            <Dropdown trigger={['click']} menu={{ items }} className="cursor-pointer">
              <Avatar size="large">Alone</Avatar>
            </Dropdown>
          </Flex>
        </Flex>

        <SettingDrawer openSetting={openSetting} onCloseSetting={toggleSettingDrawer} />
      </Layout.Header>
    </>
  )
}

export default Header
