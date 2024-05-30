import { Test } from '@renderer/apis'

const HomePage = (): JSX.Element => {
  const handleClick = (): Promise<void> => Test.openYoutube()
  const handleClick2 = (): Promise<void> => Test.registerGoogle()

  return (
    <div className="actions">
      <div className="action">
        <button onClick={handleClick}>Open Youtube</button>
        <button onClick={handleClick2}>Register Google</button>
      </div>
    </div>
  )
}

export default HomePage
