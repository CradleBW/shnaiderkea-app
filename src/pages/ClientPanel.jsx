
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function ClientPanel() {
  const [materials, setMaterials] = useState([])
  const [room, setRoom] = useState({ width: '', length: '', height: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [quantity, setQuantity] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get("https://shnaiderkea-backend.onrender.com/materials")
      .then(res => setMaterials(res.data))
      .catch(console.error)
  }, [])

  const handleRoomChange = e => {
    setRoom({ ...room, [e.target.name]: e.target.value })
  }

  const handlePhoto = e => {
    const file = e.target.files[0]
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleCalc = () => {
    const { width, length } = room
    const area = parseFloat(width) * parseFloat(length)
    if (!isNaN(area)) setQuantity(Math.ceil(area))
  }

  const handleGenerate = async () => {
    if (!selectedMaterial || !photo) return
    setLoading(true)
    const form = new FormData()
    form.append("image", photo)
    form.append("prompt", `Покажи ${selectedMaterial.name} в интерьере`)
    try {
      const res = await axios.post("https://shnaiderkea-backend.onrender.com/replicate", form)
      setResult(res.data?.output)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 30, maxWidth: 1000, margin: 'auto', fontFamily: 'Arial' }}>
      <h2>Клиентская панель</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Введите размеры помещения (в метрах):</label><br/>
        <input name="width" placeholder="Ширина" onChange={handleRoomChange} style={{ marginRight: 10 }} />
        <input name="length" placeholder="Длина" onChange={handleRoomChange} style={{ marginRight: 10 }} />
        <input name="height" placeholder="Высота" onChange={handleRoomChange} />
        <button onClick={handleCalc} style={{ marginLeft: 10, background: '#3478f6', color: '#fff', borderRadius: 5 }}>Рассчитать</button>
      </div>

      {quantity && <p><strong>Нужно материала:</strong> {quantity} м²</p>}

      <div style={{ marginBottom: 20 }}>
        <label>Загрузите фото помещения:</label><br/>
        <input type="file" onChange={handlePhoto} />
        {photoPreview && <img src={photoPreview} alt="preview" style={{ marginTop: 10, width: 200 }} />}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {materials.map((m, i) => (
          <div key={i} style={{
            border: '1px solid #ccc', padding: 10, margin: 10, width: 180, borderRadius: 5, background: '#f9f9f9'
          }}>
            <img src={m.image} style={{ width: '100%', borderRadius: 4 }} />
            <p><strong>{m.name}</strong></p>
            <p><small>{m.category}</small></p>
            <p><small>{m.length} м × {m.width} м</small></p>
            <button onClick={() => setSelectedMaterial(m)} style={{ marginTop: 5, background: '#4CAF50', color: '#fff', borderRadius: 5 }}>Выбрать</button>
            {photo && <button onClick={handleGenerate} style={{ marginTop: 5, background: '#e67e22', color: '#fff', borderRadius: 5 }}>
              {loading ? "Генерация..." : "Посмотреть в интерьере"}
            </button>}
          </div>
        ))}
      </div>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>Результат:</h3>
          <img src={result} style={{ maxWidth: '100%', border: '1px solid #ccc' }} />
        </div>
      )}
    </div>
  )
}
