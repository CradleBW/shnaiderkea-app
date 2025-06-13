
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function ClientPanel() {
  const [materials, setMaterials] = useState([])
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  const [height, setHeight] = useState('')
  const [quantity, setQuantity] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [aiImage, setAiImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('https://shnaiderkea-backend.onrender.com/materials')
      .then(res => setMaterials(res.data))
      .catch(console.error)
  }, [])

  const handleCalculate = () => {
    const area = parseFloat(width) * parseFloat(length)
    if (!isNaN(area)) {
      setQuantity(Math.ceil(area))
    }
  }

  const handleGenerate = async () => {
    if (!imageUrl || !selectedMaterial) return
    setLoading(true)
    try {
      const res = await axios.post('https://shnaiderkea-backend.onrender.com/replicate', {
        image_url: imageUrl,
        prompt: `Покажи ${selectedMaterial.name} в интерьере`
      })
      setAiImage(res.data?.output)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: '0 auto' }}>
      <h2>Клиентская панель</h2>

      <div style={{ marginBottom: 20 }}>
        <input value={width} onChange={e => setWidth(e.target.value)} placeholder="Ширина (м)" type="number" style={{ marginRight: 10 }} />
        <input value={length} onChange={e => setLength(e.target.value)} placeholder="Длина (м)" type="number" style={{ marginRight: 10 }} />
        <input value={height} onChange={e => setHeight(e.target.value)} placeholder="Высота (м)" type="number" />
        <button onClick={handleCalculate} style={{ marginLeft: 10 }}>Рассчитать</button>
      </div>

      {quantity && <p>Нужно материала: <strong>{quantity}</strong> м²</p>}

      <div style={{ marginBottom: 20 }}>
        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="URL фото комнаты" style={{ width: '80%' }} />
        {imageUrl && <div><img src={imageUrl} alt="preview" style={{ marginTop: 10, width: 200 }} /></div>}
      </div>

      <h3>Выберите материал:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {materials.map((m, i) => (
          <div key={i} onClick={() => setSelectedMaterial(m)} style={{
            border: selectedMaterial?.name === m.name ? '2px solid green' : '1px solid #ccc',
            padding: 10, margin: 10, cursor: 'pointer'
          }}>
            <img src={m.image} alt={m.name} style={{ width: 100 }} />
            <p>{m.name}</p>
          </div>
        ))}
      </div>

      {selectedMaterial && imageUrl && (
        <button onClick={handleGenerate} style={{ marginTop: 20 }} disabled={loading}>
          {loading ? 'Обработка...' : 'Посмотреть в интерьере'}
        </button>
      )}

      {aiImage && (
        <div style={{ marginTop: 30 }}>
          <h3>Результат:</h3>
          <img src={aiImage} style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  )
}
