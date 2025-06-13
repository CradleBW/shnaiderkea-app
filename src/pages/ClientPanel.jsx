import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ClientPanel() {
  const navigate = useNavigate()
  return (
    <div>
      <h2>Клиентская панель</h2>
      <button onClick={() => navigate(-1)}>← Назад</button>{' '}
      <button onClick={() => window.location.reload()}>+ Добавить ещё материал</button>
    </div>
  )
}
