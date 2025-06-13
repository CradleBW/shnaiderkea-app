
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminPanel() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('обои')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [image, setImage] = useState(null)
  const [materials, setMaterials] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', 'unsigned_preset')

    try {
      const cloudRes = await axios.post(
        'https://api.cloudinary.com/v1_1/dm3jegk4k/image/upload',
        formData
      )
      const imageUrl = cloudRes.data.secure_url

      const newMaterial = {
        name, category, length, width, image: imageUrl
      }

      await axios.post('https://shnaiderkea-backend.onrender.com/materials', newMaterial)
      alert('Материал успешно добавлен!')
      fetchMaterials()
    } catch (err) {
      console.error(err)
      alert('Ошибка при загрузке материала.')
    }
  }

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('https://shnaiderkea-backend.onrender.com/materials')
      setMaterials(res.data)
    } catch (err) {
      console.error('Ошибка получения списка материалов')
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <h2>Панель администратора</h2>
      <form onSubmit={handleSubmit}>
        <label>Название материала:</label><br />
        <input value={name} onChange={e => setName(e.target.value)} required /><br />

        <label>Категория:</label><br />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="обои">Обои</option>
          <option value="плитка">Плитка</option>
          <option value="паркет">Паркет</option>
          <option value="вагонка">Вагонка</option>
          <option value="люстра">Люстра</option>
        </select><br />

        <label>Длина (м):</label><br />
        <input type="number" value={length} onChange={e => setLength(e.target.value)} required /><br />

        <label>Ширина (м):</label><br />
        <input type="number" value={width} onChange={e => setWidth(e.target.value)} required /><br />

        <label>Изображение материала:</label><br />
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required /><br />

        <button type="submit" style={{ marginTop: 10, padding: '8px 14px', borderRadius: 6 }}>
          Загрузить материал
        </button>
      </form>

      <h3 style={{ marginTop: 30 }}>Загруженные материалы</h3>
      {materials.length === 0 ? <p>Пока ничего не загружено.</p> : (
        materials.map(mat => (
          <div key={mat._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <p><strong>Название:</strong> {mat.name}</p>
            <p><strong>Категория:</strong> {mat.category}</p>
            <p><strong>Размер:</strong> {mat.length} × {mat.width} м</p>
            {mat.image && <img src={mat.image} alt={mat.name} style={{ width: 200 }} />}
          </div>
        ))
      )}
    </div>
  )
}
