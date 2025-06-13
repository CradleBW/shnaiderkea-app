
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
    <div style={{ padding: 30 }}>
      <h2>Панель администратора</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Название" /><br />
      <input value={length} onChange={e => setLength(e.target.value)} placeholder="Длина (м)" /><br />
      <input value={width} onChange={e => setWidth(e.target.value)} placeholder="Ширина (м)" /><br />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Выберите категорию</option>
        <option value="обои">Обои</option>
        <option value="плитка">Плитка</option>
        <option value="вагонка">Вагонка</option>
        <option value="паркет">Паркет</option>
        <option value="люстра">Люстра</option>
      </select><br />
      <input type="file" onChange={e => setImage(e.target.files[0])} /><br />
      <button onClick={handleUpload}>Загрузить</button>
      <p>{status}</p>

      <h3>Загруженные материалы</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {materials.map((m, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: 10, margin: 10 }}>
            <img src={m.image} style={{ width: 100 }} />
            <p>{m.name} — {m.category}</p>
            <p>{m.length} м × {m.width} м</p>
          </div>
        ))}
      </div>
    </div>
  )
}
