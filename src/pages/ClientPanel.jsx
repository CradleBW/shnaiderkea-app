import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ClientPanel() {
  const navigate = useNavigate()
  const [roomLength, setRoomLength] = useState('')
  const [roomWidth, setRoomWidth] = useState('')
  const [roomHeight, setRoomHeight] = useState('')
  const [roomImage, setRoomImage] = useState(null)
  const [roomImageFile, setRoomImageFile] = useState(null)
  const [category, setCategory] = useState('Плитка')
  const [materials, setMaterials] = useState([])
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const res = await fetch('https://shnaiderkea-backend.onrender.com/api/materials')
        const data = await res.json()
        setMaterials(data)
        setError('')
      } catch (e) {
        setError('Ошибка загрузки материалов с сервера')
        console.error(e)
      }
    }
    fetchMaterials()
  }, [])

  const handleCalculate = () => {
    if (!selectedMaterial || !roomLength || !roomWidth || (category !== 'Пол' && !roomHeight)) {
      setResult('Введите все данные')
      return
    }

    const length = parseFloat(roomLength)
    const width = parseFloat(roomWidth)
    const height = parseFloat(roomHeight)

    const mWidth = selectedMaterial.width / 100
    const mHeight = selectedMaterial.height / 100
    const areaPerItem = mWidth * mHeight

    let totalArea = 0
    if (category === 'Пол') {
      totalArea = length * width
    } else {
      totalArea = 2 * (length + width) * height
    }

    const quantity = Math.ceil(totalArea / areaPerItem)
    setResult(`Нужно ${quantity} штук материала "${selectedMaterial.name}"`)
  }

  const handleGenerateAI = async () => {
    if (!selectedMaterial || !roomImageFile) {
      alert("Выберите материал и загрузите фото комнаты")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('image', roomImageFile)
    formData.append('prompt', `Покажи ${selectedMaterial.category.toLowerCase()} "${selectedMaterial.name}" в интерьере`)

    try {
      const res = await fetch('https://shnaiderkea-backend.onrender.com/api/generate', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data?.prediction?.urls?.get) {
        const pollRes = await fetch(data.prediction.urls.get)
        const final = await pollRes.json()
        if (final.output && final.output.length > 0) {
          setGeneratedImage(final.output[0])
        } else {
          setError("Ошибка генерации изображения")
        }
      } else {
        setError("Ошибка отправки запроса к ИИ")
      }
    } catch (err) {
      console.error(err)
      setError("Ошибка генерации изображения")
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Клиент: Подбор материалов</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>Выберите категорию:<br />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Пол</option>
          <option>Стены</option>
          <option>Потолок</option>
        </select>
      </label><br /><br />

      <label>Длина комнаты (м):<br />
        <input type="number" value={roomLength} onChange={e => setRoomLength(e.target.value)} />
      </label><br /><br />

      <label>Ширина комнаты (м):<br />
        <input type="number" value={roomWidth} onChange={e => setRoomWidth(e.target.value)} />
      </label><br /><br />

      {category !== 'Пол' && (
        <>
          <label>Высота комнаты (м):<br />
            <input type="number" value={roomHeight} onChange={e => setRoomHeight(e.target.value)} />
          </label><br /><br />
        </>
      )}

      <label>Фото комнаты:<br />
        <input type="file" onChange={e => {
          setRoomImage(URL.createObjectURL(e.target.files[0]))
          setRoomImageFile(e.target.files[0])
        }} />
      </label><br /><br />

      {roomImage && <img src={roomImage} alt="Комната" style={{ width: '100%' }} />}

      <label>Выберите материал:<br />
        <select onChange={e => {
          const mat = materials.find(m => m.name === e.target.value)
          setSelectedMaterial(mat)
        }}>
          <option value="">-- выбрать --</option>
          {materials.map(m => (
            <option key={m.name} value={m.name}>{m.name} ({m.category})</option>
          ))}
        </select>
      </label><br /><br />

      {selectedMaterial && (
        <img src={selectedMaterial.image_url} alt="Материал" style={{ width: '100%' }} />
      )}

      <button onClick={handleCalculate}>Рассчитать</button>
      <p>{result}</p>

      <button onClick={handleGenerateAI} disabled={loading}>
        {loading ? "Генерация..." : "Показать в интерьере (ИИ)"}
      </button><br /><br />

      {generatedImage && (
        <>
          <p>Результат:</p>
          <img src={generatedImage} alt="Результат" style={{ width: '100%' }} />
        </>
      )}

      <hr />
      <button onClick={() => navigate(-1)}>← Назад</button>{' '}
      <button onClick={() => window.location.reload()}>+ Добавить ещё материал</button>
    </div>
  )
}
