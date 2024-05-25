import { ToolYoutube } from '@renderer/apis'
import { useState } from 'react'

const ViewYoutube = (): JSX.Element => {
  const [viewYoutube, setViewYoutube] = useState<IIncreaseViewYoutube>({
    keyword: ['ttg', 'dat g', 'electron', 'worker', 'cluster'],
    delay: 1,
    stream: 2,
    loop: 3
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target

    setViewYoutube((prevState) => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmit = (): void => {
    ToolYoutube.increaseViews(viewYoutube)
  }

  return (
    <div>
      <div>
        <label htmlFor="keyword">Từ khóa tìm kiếm:</label>
        <input
          id="keyword"
          type="text"
          value={viewYoutube.keyword}
          placeholder="Nhập từ khóa tìm kiếm"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="stream">Số luồng chạy:</label>
        <input
          id="stream"
          type="number"
          value={viewYoutube.stream}
          min={1}
          placeholder="Số luồng chạy"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="loop">Vòng lặp hành động:</label>
        <input
          id="loop"
          type="number"
          value={viewYoutube.loop}
          min={1}
          placeholder="Vòng lặp hành động"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="delay">Thời gian delay:</label>
        <input
          id="delay"
          type="number"
          value={viewYoutube.delay}
          min={1}
          placeholder="Thời gian delay"
          onChange={handleChange}
        />
      </div>

      <div>
        <button onClick={handleSubmit}>Xác nhận</button>
      </div>
    </div>
  )
}

export default ViewYoutube
