import React, { useState } from 'react'
import axios from 'axios'

export default function AdminPanel() {
  const [image, setImage] = useState(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', 'ml_default')
    setStatus('Загрузка...')

    try {
      const cloudinaryRes = await axios.post(
        'https://api.cloudinary.com/v1_1/dm3jegk4k/image/upload',
        formData
      )
      const imageUrl = cloudinaryRes.data.secure_url
      await axios.post('https://shnaiderkea-backend.onrender.com/materials', {
        name,
        image: imageUrl
      })
      setStatus('Успешно загружено!')
    } catch (error) {
      console.error('Ошибка при загрузке материала:', error)
      setStatus('Ошибка загрузки')
    }
  }

  return (
    <div>
      <h2>Панель администратора</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Название материала" />
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Загрузить</button>
      </form>
      <p>{status}</p>
    </div>
  )
}
