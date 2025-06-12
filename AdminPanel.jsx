import React, { useState } from 'react'

export default function AdminPanel() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Обои')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [resultUrl, setResultUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Загрузка...')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('category', category)
    formData.append('width', width)
    formData.append('height', height)
    formData.append('file', file)

    try {
      const response = await fetch('https://shnaiderkea-backend.onrender.com/api/materials', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Ошибка загрузки')
      const data = await response.json()
      setStatus('Загружено успешно ✅')
      setResultUrl(data.image_url)
    } catch (err) {
      setStatus('Ошибка при загрузке ❌')
      console.error(err)
    }
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
      {resultUrl && <img src={resultUrl} alt="Результат" style={{ width: '100%', marginTop: '10px' }} />}
    </div>
  )
}
