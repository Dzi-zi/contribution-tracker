import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/',             label: 'Dashboard' },
    { to: '/transactions', label: 'Transactions' },
  ]

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
        <div className="navbar-mark" aria-hidden="true">
          <div className="navbar-mark-inner" />
        </div>
        Contribution Tracker
      </Link>

      <button
        className="hamburger"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className={`ham-line ${open ? 'open' : ''}`} />
        <span className={`ham-line ${open ? 'open' : ''}`} />
        <span className={`ham-line ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="nav-dropdown" role="menu">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${pathname === to ? 'active' : ''}`}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}