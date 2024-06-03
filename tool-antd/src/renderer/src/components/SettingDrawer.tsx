import { Drawer } from 'antd'

type SettingDrawerProps = {
  openSetting: boolean
  onCloseSetting: () => void
}

const SettingDrawer = ({ openSetting, onCloseSetting }: SettingDrawerProps): JSX.Element => {
  return (
    <Drawer title="Cài đặt" width={720} onClose={onCloseSetting} open={openSetting}>
      <p>Cài đặt tài khoản ...</p>
    </Drawer>
  )
}

export default SettingDrawer
