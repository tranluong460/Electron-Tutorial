import { Test } from '@renderer/apis'

const HomePage = (): JSX.Element => {
  const handleClick = (): Promise<void> => Test.openYoutube()

  return (
    <div className="actions">
      <div className="action">
        <button onClick={handleClick}>Open Youtube</button>
      </div>
    </div>
  )
}

export default HomePage
