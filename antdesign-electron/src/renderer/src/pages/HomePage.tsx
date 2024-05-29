import { Test } from '@renderer/apis'
import { Button } from 'antd'
import { useState } from 'react'

export const delay = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

const HomePage = (): JSX.Element => {
  const [loading, setLoading] = useState(false)

  const handleClick = async (): Promise<void> => {
    setLoading(true)
    Test.openYoutube()
    await delay(1000)
    setLoading(false)
  }

  return (
    <div style={{ height: '1000px' }}>
      <Button onClick={handleClick} loading={loading} type="primary">
        Open Youtube
      </Button>
    </div>
  )
}

export default HomePage
