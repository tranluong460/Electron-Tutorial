import { NavLink } from 'react-router-dom'

const Header = (): JSX.Element => {
  return (
    <ul className="header">
      <li>
        <NavLink to="/">Electron</NavLink>
      </li>

      <li>
        <NavLink to="/home">Home</NavLink>
      </li>
    </ul>
  )
}

export default Header
