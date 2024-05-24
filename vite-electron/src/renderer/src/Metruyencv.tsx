import DownloadToElement from './components/DownloadToElement'
import DownloadToRequest from './components/DownloadToRequest'

const Metruyencv = (): JSX.Element => {
  return (
    <>
      <h1>Mê Truyện Cv - Catch To Element</h1>

      <DownloadToElement />

      <hr />

      <h1>Mê Truyện Cv - Catch To Http Request</h1>

      <DownloadToRequest />
    </>
  )
}

export default Metruyencv
