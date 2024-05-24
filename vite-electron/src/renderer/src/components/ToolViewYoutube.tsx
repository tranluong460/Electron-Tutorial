import { ToolYoutube } from '@renderer/apis'
import { useState } from 'react'

const ToolViewYoutube = (): JSX.Element => {
  const [stream, setStream] = useState<number>(2)
  const [loop, setLoop] = useState<number>(3)
  const [delay, setDelay] = useState<number>(1)
  const [keyword, setKeyWord] = useState<string[]>([
    'ttg',
    'dat g',
    'electron',
    'worker',
    'cluster'
  ])

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '0.7fr 1fr',
    gap: '10px',
    marginBottom: '20px'
  }

  const inputStyle = {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  }

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer'
  }

  const buttonContainerStyle = {
    gridColumn: '1 / span 2',
    display: 'flex',
    justifyContent: 'center'
  }

  return (
    <div style={{ width: 400 }}>
      <h1 style={{ textAlign: 'center' }}>Youtube</h1>

      <div style={containerStyle}>
        <label htmlFor="input-keyword">Tìm kiếm</label>
        <input
          id="input-keyword"
          type="string"
          value={keyword}
          placeholder="Tìm kiếm"
          style={inputStyle}
          onChange={(e) => setKeyWord(e.target.value.split(',') || [''])}
        />
      </div>

      <div style={containerStyle}>
        <label htmlFor="input-stream">Số luồng chạy</label>
        <input
          id="input-stream"
          type="number"
          value={stream}
          min={1}
          max={2}
          placeholder="Số luồng chạy"
          style={inputStyle}
          onChange={(e) => setStream(Number(e.target.value))}
        />
      </div>

      <div style={containerStyle}>
        <label htmlFor="input-loop">Vòng lặp hành động</label>
        <input
          id="input-loop"
          type="number"
          value={loop}
          min={1}
          placeholder="Vòng lặp hành động"
          style={inputStyle}
          onChange={(e) => setLoop(Number(e.target.value))}
        />
      </div>

      <div style={containerStyle}>
        <label htmlFor="input-delay">Thời gian delay (phút)</label>
        <input
          id="input-delay"
          type="number"
          value={delay}
          min={1}
          placeholder="Thời gian delay (phút)"
          style={inputStyle}
          onChange={(e) => setDelay(Number(e.target.value))}
        />
      </div>

      <div style={buttonContainerStyle}>
        <button
          style={buttonStyle}
          onClick={() => ToolYoutube.increaseViews({ keyword, stream, loop, delay })}
        >
          Bắt đầu
        </button>
      </div>
    </div>
  )
}

export default ToolViewYoutube
