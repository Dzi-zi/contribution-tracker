import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Contribution Tracker</span>
      <Link to="/about" className="footer-link">About</Link>
    </footer>
  )
}