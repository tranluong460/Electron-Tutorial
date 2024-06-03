import { Layout } from 'antd'

type FooterProps = {
  collapsed: boolean
  colorBgContainer: string
}

const Footer = ({ collapsed, colorBgContainer }: FooterProps): JSX.Element => {
  return (
    <Layout.Footer
      className={`p-3 w-screen text-center duration-200 ${collapsed ? 'ml-[40px]' : 'ml-[100px]'}`}
      style={{
        position: 'fixed',
        bottom: 0,
        zIndex: 40,
        background: colorBgContainer
      }}
    >
      Tool ©{new Date().getFullYear()} Created by Alone
    </Layout.Footer>
  )
}

export default Footer
