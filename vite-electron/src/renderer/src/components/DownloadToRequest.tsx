import { useState } from 'react'
import { MetruyencvCrud } from '../apis'

const DownloadToRequest = (): JSX.Element => {
  const [apiUrl, setApiUrl] = useState('https://backend.metruyencv.com/api/books')
  const [fileExtension, setFileExtension] = useState('json')
  const [limit, setLimit] = useState(5)
  const [page, setPage] = useState(1)

  return (
    <>
      <div>
        <div>
          <input
            id="input-book-url"
            type="text"
            placeholder="Đường dẫn api"
            onChange={(e) => setApiUrl(e.target.value)}
            value={apiUrl}
          />

          <input
            type="number"
            placeholder="Giới hạn"
            min={5}
            style={{ marginLeft: '3px' }}
            onChange={(e) => setLimit(Number(e.target.value))}
            value={limit}
          />
          <input
            type="number"
            placeholder="Trang"
            min={1}
            style={{ marginLeft: '3px' }}
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          />

          <select
            id="select-file-extension"
            onChange={(e) => setFileExtension(e.target.value)}
            style={{ marginLeft: '3px' }}
          >
            <option value="json">JSON</option>
            <option value="txt">TXT</option>
            <option value="excel">Excel</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button
          id="btn-scratch"
          onClick={() =>
            MetruyencvCrud.scratchBookToApi({
              apiUrl,
              fileExtension,
              limit,
              page
            })
          }
        >
          Tải xuống
        </button>
      </div>
    </>
  )
}

export default DownloadToRequest
