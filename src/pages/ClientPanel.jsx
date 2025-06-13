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
