import { Outlet } from 'react-router-dom'

const BasePage = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Outlet />
    </div>
  )
}

export default BasePage
