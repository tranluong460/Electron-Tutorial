import { NavLink } from 'react-router-dom'

const Aside = (): JSX.Element => {
  const navMenu = [
    {
      name: 'Trang chủ',
      url: '/'
    },
    {
      name: 'Facebook',
      url: '#',
      children: [
        {
          name: 'Tăng Like Bài Viết',
          url: '/facebook/buff-like'
        },
        {
          name: 'Tăng Comment Bài Viết',
          url: '/facebook/buff-comment'
        },
        {
          name: 'Tăng Share Bài Viết',
          url: '/facebook/buff-share'
        }
      ]
    },
    {
      name: 'Youtube',
      url: '#',
      children: [
        {
          name: 'Tăng View',
          url: '/youtube/buff-view'
        },
        {
          name: 'Tăng Like',
          url: '/youtube/buff-like'
        },
        {
          name: 'Tăng Subscribe',
          url: '/youtube/buff-subscribe'
        },
        {
          name: 'Tăng Comment',
          url: '/youtube/buff-comment'
        }
      ]
    }
  ]
  return (
    <nav className="main-header">
      <div className="logo">
        <span>Tool</span>
      </div>

      <div className="menu-sidebar">
        <ul className="nav-sidebar">
          {navMenu.map((nav) => (
            <li key={nav.name} className="nav-item">
              <NavLink to={nav.url} className="nav-link">
                {nav.name}
              </NavLink>

              {nav.children && (
                <ul className="nav-treeview">
                  {nav.children.map((children) => (
                    <li className="nav-item" key={children.name}>
                      <NavLink to={children.url} className="nav-link">
                        {children.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Aside
