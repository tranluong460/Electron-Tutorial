import { Aside } from '@renderer/components'
import { Outlet } from 'react-router-dom'

const BasePage = (): JSX.Element => {
  return (
    <div className="base-page">
      <Aside />

      <Outlet />
    </div>
  )
}

export default BasePage
