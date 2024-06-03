import { useState } from 'react'
import { Button, Flex, message } from 'antd'
import { ImportYoutubeDrawer } from './.'
import { Youtube } from '@renderer/apis'

type TitleTableYoutubeType = {
  dataSelection: string[]
}

const TitleTableYoutube = ({ dataSelection }: TitleTableYoutubeType): JSX.Element => {
  const [openDrawer, setOpenDrawer] = useState(false)

  const toggleOpenDrawer = (): void => setOpenDrawer(!openDrawer)

  const handleDeleteAccount = async (): Promise<void> => {
    if (dataSelection.length === 0) {
      message.error('Chọn ít nhất một tài khoản')
      return
    }

    await Youtube.deleteAccount(dataSelection)
  }

  return (
    <>
      <Flex align="center" justify="end" gap="large">
        <Button onClick={toggleOpenDrawer}>Nhập dữ liệu</Button>
        <Button danger onClick={handleDeleteAccount}>
          Xóa tài khoản
        </Button>
      </Flex>

      <ImportYoutubeDrawer openDrawer={openDrawer} toggleOpenDrawer={toggleOpenDrawer} />
    </>
  )
}

export default TitleTableYoutube
