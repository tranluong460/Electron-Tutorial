import { SeedingYoutube } from '@renderer/apis'

const HomePage = (): JSX.Element => {
  const handleSeeding = () => SeedingYoutube.seedingYoutube()

  return (
    <button className="bg-blue-500 rounded-md p-2" onClick={handleSeeding}>
      Seeding
    </button>
  )
}

export default HomePage
