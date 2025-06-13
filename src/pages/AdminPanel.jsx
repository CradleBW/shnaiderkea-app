
import React, { useState } from 'react'
import axios from 'axios'

export default function AdminPanel() {
  const [image, setImage] = useState(null)
  const [name, setName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    if (!image || !name) {
      alert('Заполните все поля')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', image)
      formData.append('upload_preset', 'unsigned')
      const res = await axios.post('https://api.cloudinary.com/v1_1/dm3jegk4k/image/upload', formData)
      const imageUrl = res.data.secure_url

      await axios.post('https://shnaiderkea-backend.onrender.com/materials', {
        name,
        image: imageUrl
      })

      setMessage('✅ Материал добавлен!')
      setImage(null)
      setName('')
    } catch (err) {
      console.error('Ошибка загрузки', err)
      setMessage('❌ Ошибка при добавлении')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Админ-панель</h2>
      <input type="text" placeholder="Название материала" value={name} onChange={e => setName(e.target.value)} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading}>{uploading ? 'Загрузка...' : 'Загрузить материал'}</button>
      <p>{message}</p>
    </div>
  )
}
