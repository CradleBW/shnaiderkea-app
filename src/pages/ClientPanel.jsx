
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ClientPanel() {
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  const [height, setHeight] = useState('')
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [materials, setMaterials] = useState([])
  const [quantity, setQuantity] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const calculateQuantity = (materialLength, materialWidth) => {
    const roomArea = parseFloat(width) * parseFloat(length)
    const materialArea = parseFloat(materialLength) * parseFloat(materialWidth)
    if (!isNaN(roomArea) && !isNaN(materialArea) && materialArea > 0) {
      return Math.ceil(roomArea / materialArea)
    }
    return null
  }

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('https://shnaiderkea-backend.onrender.com/materials')
      setMaterials(res.data)
    } catch (err) {
      console.error('Ошибка при получении материалов:', err)
    }
  }

  const viewInInterior = async (material) => {
    const formData = new FormData()
    formData.append('image', image)
    formData.append('prompt', `Покажи ${material.category} "${material.name}" в интерьере`)
    try {
      const res = await axios.post('https://shnaiderkea-backend.onrender.com/replicate', formData)
      if (res.data?.output_url) {
        window.open(res.data.output_url, '_blank')
      }
    } catch (err) {
      alert('Ошибка при обращении к ИИ')
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <h2>Клиентская панель</h2>

      <label>Введите ширину помещения (м):</label><br />
      <input type="number" value={width} onChange={e => setWidth(e.target.value)} /><br />

      <label>Введите длину помещения (м):</label><br />
      <input type="number" value={length} onChange={e => setLength(e.target.value)} /><br />

      <label>Введите высоту помещения (м):</label><br />
      <input type="number" value={height} onChange={e => setHeight(e.target.value)} /><br />

      <label>Загрузите фото помещения:</label><br />
      <input type="file" accept="image/*" onChange={handleImageChange} /><br />
      {previewUrl && <img src={previewUrl} alt="preview" style={{ width: 300, marginTop: 10 }} />}

      <h3 style={{ marginTop: 30 }}>Материалы</h3>
      {materials.length === 0 ? <p>Материалы не найдены.</p> : (
        materials.map(mat => (
          <div key={mat._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <p><strong>Название:</strong> {mat.name}</p>
            <p><strong>Категория:</strong> {mat.category}</p>
            <p><strong>Размер:</strong> {mat.length} × {mat.width} м</p>
            {width && length && (
              <p><strong>Необходимое количество:</strong> {calculateQuantity(mat.length, mat.width)}</p>
            )}
            {image && (
              <button onClick={() => viewInInterior(mat)} style={{ padding: '6px 14px', borderRadius: 6 }}>
                Посмотреть в интерьере
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
