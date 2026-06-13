import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import About from './pages/About.jsx'
import './styles/global.css'
import 'react-datepicker/dist/react-datepicker.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/about"        element={<About />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}