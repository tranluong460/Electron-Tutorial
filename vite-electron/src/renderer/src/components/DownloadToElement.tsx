import { useState } from 'react'
import { MetruyencvCrud } from '../apis'

const DownloadToElement = (): JSX.Element => {
  const [bookUrl, setBookUrl] = useState(
    'https://metruyencv.com/truyen/ta-o-nhan-gian-dap-dat-thanh-tien'
  )
  const [fileExtension, setFileExtension] = useState('json')
  const [firstChapter, setFirstChapter] = useState('1')
  const [lastChapter, setLastChapter] = useState('3')

  return (
    <>
      <div>
        <div>
          <input
            id="input-book-url"
            type="text"
            placeholder="Đường dẫn truyện"
            onChange={(e) => setBookUrl(e.target.value)}
            value={bookUrl}
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

        <div style={{ marginTop: '10px' }}>
          <input
            type="number"
            min={1}
            placeholder="Chương đầu"
            onChange={(e) => setFirstChapter(e.target.value)}
            value={firstChapter}
          />
          <input
            type="number"
            min={1}
            placeholder="Chương cuối"
            value={lastChapter}
            style={{ marginLeft: '3px' }}
            onChange={(e) => setLastChapter(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button
          id="btn-scratch"
          onClick={() =>
            MetruyencvCrud.scratchBookToElement({
              bookUrl,
              fileExtension,
              firstChapter,
              lastChapter
            })
          }
        >
          Tải xuống
        </button>
      </div>
    </>
  )
}

export default DownloadToElement
