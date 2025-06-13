
import React, { useState } from 'react'
import axios from 'axios'

export default function AdminPanel() {
  const [image, setImage] = useState(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  const uploadMaterial = async () => {
    if (!image || !name) {
      setStatus('❗ Укажите имя и выберите изображение')
      return
    }

    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', 'unsigned')

    try {
      const upload = await axios.post('https://api.cloudinary.com/v1_1/dm3jegk4k/image/upload', formData)
      const imageUrl = upload.data.secure_url

      await axios.post('https://shnaiderkea-backend.onrender.com/materials', { name, image: imageUrl })
      setStatus('✅ Материал успешно добавлен')
      setImage(null)
      setName('')
    } catch (e) {
      console.error(e)
      setStatus('❌ Ошибка при загрузке')
    }
  }

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: '0 auto' }}>
      <h2>Панель администратора</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Название материала" style={{ display: 'block', marginBottom: 10, width: '100%' }} />
      <input type="file" onChange={e => setImage(e.target.files[0])} style={{ display: 'block', marginBottom: 10 }} />
      <button onClick={uploadMaterial}>Загрузить материал</button>
      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  )
}
