import { Header, Versions } from '@renderer/components'
import { Outlet } from 'react-router-dom'

const BasePage = (): JSX.Element => {
  return (
    <div className="base-body">
      <div className="base-electron">
        <Header />
        <Outlet />
        <Versions />
      </div>
    </div>
  )
}

export default BasePage
