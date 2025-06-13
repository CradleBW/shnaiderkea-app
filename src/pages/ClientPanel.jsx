
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ClientPanel() {
  const [materials, setMaterials] = useState([])
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  const [quantity, setQuantity] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [aiImage, setAiImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('https://shnaiderkea-backend.onrender.com/materials')
      .then(res => setMaterials(res.data))
      .catch(err => console.error('Ошибка загрузки материалов', err))
  }, [])

  const handleCalculate = () => {
    const roomArea = parseFloat(width) * parseFloat(length)
    if (!isNaN(roomArea)) {
      setQuantity(Math.ceil(roomArea))
    }
  }

  const handleGenerateAIImage = async () => {
    if (!imageUrl || !selectedMaterial) return
    setLoading(true)
    try {
      const res = await axios.post('https://shnaiderkea-backend.onrender.com/replicate', {
        image_url: imageUrl,
        prompt: `Покажи ${selectedMaterial.name} в интерьере`
      })
      setAiImage(res.data?.output)
    } catch (err) {
      console.error('Ошибка запроса к ИИ', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Клиентская панель</h2>

      <div>
        <input type="number" placeholder="Ширина (м)" value={width} onChange={e => setWidth(e.target.value)} />
        <input type="number" placeholder="Длина (м)" value={length} onChange={e => setLength(e.target.value)} />
        <button onClick={handleCalculate}>Рассчитать</button>
      </div>

      {quantity && <p>Необходимое количество: {quantity} м²</p>}

      <div>
        <input type="text" placeholder="URL изображения комнаты" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        {imageUrl && <img src={imageUrl} alt="Комната" style={{ width: 200, marginTop: 10 }} />}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {materials.map((mat, idx) => (
          <div key={idx} style={{ border: selectedMaterial === mat ? '2px solid blue' : '1px solid #ccc', margin: 10, padding: 10 }} onClick={() => setSelectedMaterial(mat)}>
            <img src={mat.image} alt={mat.name} style={{ width: 100 }} />
            <p>{mat.name}</p>
          </div>
        ))}
      </div>

      {selectedMaterial && imageUrl && (
        <button onClick={handleGenerateAIImage} disabled={loading}>
          {loading ? 'Генерация...' : 'Посмотреть в интерьере'}
        </button>
      )}

      {aiImage && (
        <div style={{ marginTop: 20 }}>
          <h3>Результат:</h3>
          <img src={aiImage} alt="Интерьер с материалом" style={{ width: 300 }} />
        </div>
      )}
    </div>
  )
}
