import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ClientPanel from './pages/ClientPanel'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <Routes>
      <Route path="/client" element={<ClientPanel />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<div>404 Страница не найдена</div>} />
    </Routes>
  )
}
