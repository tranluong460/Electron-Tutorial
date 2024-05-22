import { useEffect, useState } from 'react'
import { DemoCrud, ExportExcel } from './apis'
import { Demo } from '../../system/database/entities'

function App(): JSX.Element {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  // eslint-disable-next-line
  const [editDemo, setEditDemo] = useState<any>()
  const [data, setData] = useState<Demo[]>([])

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const allData = await DemoCrud.getAllDemos()
      setData(allData)
    }

    fetchData()
  }, [data])

  return (
    <>
      <div>
        <h1>Create Account</h1>
        <input type="text" name="name" onChange={(event) => setName(event.target.value)} />
        <input type="text" name="password" onChange={(event) => setPassword(event.target.value)} />

        <button
          onClick={() => {
            DemoCrud.createDemo({ name, password })
          }}
        >
          Create
        </button>
      </div>

      <div>
        <h1>Get All And Delete Account</h1>
        {data && (
          <>
            <button
              style={{ marginBottom: '10px' }}
              onClick={() => ExportExcel.exportFileExcel(data)}
            >
              Export excel
            </button>

            <button
              style={{ marginBottom: '10px', marginLeft: '10px' }}
              onClick={() => ExportExcel.exportFileJson(data)}
            >
              Export json
            </button>

            <button
              style={{ marginBottom: '10px', marginLeft: '10px' }}
              onClick={() => ExportExcel.importTxt()}
            >
              Import txt
            </button>
          </>
        )}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Password</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.password}</td>
                <td>
                  <button
                    onClick={() => {
                      DemoCrud.deleteDemo(item.id)
                    }}
                  >
                    Delete
                  </button>

                  <button onClick={() => setEditDemo(item)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editDemo && (
        <div>
          <h1>Edit Account</h1>
          <input
            type="text"
            name="name"
            value={editDemo?.name}
            onChange={(event) => setEditDemo((pre) => ({ ...pre, name: event.target.value }))}
          />

          <input
            type="text"
            name="password"
            value={editDemo?.password}
            onChange={(event) => setEditDemo((pre) => ({ ...pre, password: event.target.value }))}
          />
          <button
            onClick={() => {
              editDemo && DemoCrud.updateDemo(editDemo)
            }}
          >
            Update
          </button>
        </div>
      )}
    </>
  )
}

export default App
