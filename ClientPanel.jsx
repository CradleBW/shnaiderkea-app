import React, { useState } from 'react'

export default function ClientPanel() {
  const [roomLength, setRoomLength] = useState('')
  const [roomWidth, setRoomWidth] = useState('')
  const [roomHeight, setRoomHeight] = useState('')
  const [roomImage, setRoomImage] = useState(null)
  const [category, setCategory] = useState('Плитка')
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [result, setResult] = useState('')

  const materials = [
    {
      name: 'Плитка серая 30x30',
      category: 'Плитка',
      width: 30,
      height: 30,
      image_url: 'https://res.cloudinary.com/dm3jegk4k/image/upload/v1718200000/sample.jpg'
    },
    {
      name: 'Обои цветочные 53x1000',
      category: 'Обои',
      width: 53,
      height: 1000,
      image_url: 'https://res.cloudinary.com/dm3jegk4k/image/upload/v1718200000/sample.jpg'
    }
  ]

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

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Клиент: Подбор материалов</h2>

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
        <input type="file" onChange={e => setRoomImage(URL.createObjectURL(e.target.files[0]))} />
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
    </div>
  )
}
