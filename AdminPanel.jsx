import React, { useState } from 'react'

export default function AdminPanel() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Обои')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Загрузка...')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('category', category)
    formData.append('width', width)
    formData.append('height', height)
    formData.append('file', file)

    // Заглушка — пока backend не подключён
    setTimeout(() => {
      setStatus('Загружено успешно (заглушка)')
    }, 1000)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Загрузка материала (ShnaiderKea)</h2>
      <form onSubmit={handleSubmit}>
        <label>Название:<br />
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label><br /><br />
        <label>Категория:<br />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>Обои</option>
            <option>Плитка</option>
            <option>Вагонка</option>
            <option>Паркет</option>
            <option>Люстра</option>
          </select>
        </label><br /><br />
        <label>Размер (см):<br />
          <input type="number" placeholder="Ширина" value={width} onChange={e => setWidth(e.target.value)} required />
          <input type="number" placeholder="Высота" value={height} onChange={e => setHeight(e.target.value)} required />
        </label><br /><br />
        <label>Изображение:<br />
          <input type="file" onChange={e => setFile(e.target.files[0])} required />
        </label><br /><br />
        <button type="submit">Загрузить</button>
      </form>
      <p>{status}</p>
    </div>
  )
}
