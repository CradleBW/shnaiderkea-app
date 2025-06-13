import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ClientPanel() {
  const [materials, setMaterials] = useState([])
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  const [quantity, setQuantity] = useState(null)

  useEffect(() => {
    axios.get('https://shnaiderkea-backend.onrender.com/materials')
      .then(res => setMaterials(res.data))
      .catch(() => setMaterials([]))
  }, [])

  const handleCalculate = () => {
    const roomArea = parseFloat(width) * parseFloat(length)
    if (!isNaN(roomArea)) {
      setQuantity(Math.ceil(roomArea))
    }
  }

  return (
    <div>
      <h2>Клиентская панель</h2>
      <div>
        <input type="number" placeholder="Ширина (м)" value={width} onChange={e => setWidth(e.target.value)} />
        <input type="number" placeholder="Длина (м)" value={length} onChange={e => setLength(e.target.value)} />
        <button onClick={handleCalculate}>Рассчитать количество</button>
      </div>
      {quantity && <p>Необходимое количество: {quantity} м²</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {materials.map((mat, idx) => (
          <div key={idx} style={{ margin: 10 }}>
            <img src={mat.image} alt={mat.name} style={{ width: 150 }} />
            <p>{mat.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
