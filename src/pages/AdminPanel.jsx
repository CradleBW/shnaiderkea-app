
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminPanel() {
  const [name, setName] = useState('')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [materials, setMaterials] = useState([])
  const [status, setStatus] = useState('')

  const fetchMaterials = () => {
    axios.get("https://shnaiderkea-backend.onrender.com/materials")
      .then(res => setMaterials(res.data))
      .catch(console.error)
  }

  useEffect(fetchMaterials, [])

  const handleUpload = async () => {
    if (!image || !name || !category) {
      setStatus("❗ Заполните все поля")
      return
    }

    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "unsigned")

    try {
      const upload = await axios.post("https://api.cloudinary.com/v1_1/dm3jegk4k/image/upload", formData)
      const url = upload.data.secure_url

      await axios.post("https://shnaiderkea-backend.onrender.com/materials", {
        name, image: url, length, width, category
      })

      setStatus("✅ Материал добавлен")
      setName(''); setLength(''); setWidth(''); setCategory(''); setImage(null)
      fetchMaterials()
    } catch (err) {
      console.error(err)
      setStatus("❌ Ошибка при загрузке")
    }
  }

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: 'auto', fontFamily: 'Arial' }}>
      <h2>Панель администратора</h2>
      <p><input value={name} onChange={e => setName(e.target.value)} placeholder="Название материала" style={{ width: '100%', padding: 8, marginBottom: 10 }} /></p>
      <p><input value={length} onChange={e => setLength(e.target.value)} placeholder="Длина (м)" style={{ width: '49%', marginRight: '2%', padding: 8 }} />
         <input value={width} onChange={e => setWidth(e.target.value)} placeholder="Ширина (м)" style={{ width: '49%', padding: 8 }} /></p>
      <p><select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 10 }}>
        <option value="">Выберите категорию</option>
        <option value="обои">Обои</option>
        <option value="плитка">Плитка</option>
        <option value="вагонка">Вагонка</option>
        <option value="паркет">Паркет</option>
        <option value="люстра">Люстра</option>
      </select></p>
      <p><input type="file" onChange={e => setImage(e.target.files[0])} /></p>
      <button onClick={handleUpload} style={{ background: '#2ecc71', color: '#fff', padding: '10px 20px', borderRadius: 6, border: 'none' }}>Загрузить</button>
      <p>{status}</p>

      <h3>Загруженные материалы</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {materials.map((m, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: 10, margin: 10, width: 160, borderRadius: 5 }}>
            <img src={m.image} style={{ width: '100%', borderRadius: 4 }} />
            <p><strong>{m.name}</strong></p>
            <p><small>{m.category}</small></p>
            <p><small>{m.length} × {m.width} м</small></p>
          </div>
        ))}
      </div>
    </div>
  )
}
