import React from 'react'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Arial' }}>
      <h1>Добро пожаловать в ShnaiderKea</h1>
      <p><Link to="/client">Перейти в клиентскую панель</Link></p>
      <p><Link to="/admin">Перейти в панель администратора</Link></p>
    </div>
  )
}
