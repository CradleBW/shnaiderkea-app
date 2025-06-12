import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import AdminPanel from './AdminPanel'
import ClientPanel from './ClientPanel'

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Добро пожаловать в ShnaiderKea!</h1>
      <p><Link to="/admin">Панель администратора</Link></p>
      <p><Link to="/client">Клиентская зона</Link></p>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/client" element={<ClientPanel />} />
      </Routes>
    </Router>
  )
}

export default App
