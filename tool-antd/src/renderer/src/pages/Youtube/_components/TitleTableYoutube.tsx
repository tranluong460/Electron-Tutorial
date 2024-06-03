import { useState } from 'react'
import { Button, Flex } from 'antd'
import { ImportYoutubeDrawer } from './.'

const TitleTableYoutube = (): JSX.Element => {
  const [openDrawer, setOpenDrawer] = useState(false)

  const toggleOpenDrawer = (): void => setOpenDrawer(!openDrawer)

  return (
    <>
      <Flex align="center" justify="end">
        <Button onClick={toggleOpenDrawer}>Nhập dữ liệu</Button>
      </Flex>

      <ImportYoutubeDrawer openDrawer={openDrawer} toggleOpenDrawer={toggleOpenDrawer} />
    </>
  )
}

export default TitleTableYoutube
