import { Auth } from './apis'
import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import {
  BasePage,
  HomePage,
  SeedingYoutube,
  ManagerYoutube,
  LoginPage,
  CategoryYoutube
} from './pages'

function App(): JSX.Element {
  const [isLogin, setIsLogin] = useState(false)

  const checkLogin = async (): Promise<void> =>
    await Auth.isAuth().then((result) => setIsLogin(result))

  useEffect(() => {
    checkLogin()
  }, [isLogin])

  return (
    <Router>
      <Routes>
        <Route element={isLogin ? <BasePage /> : <LoginPage />}>
          <Route index element={<HomePage />} />

          <Route path="/youtube/manager" element={<ManagerYoutube />} />
          <Route path="/youtube/seeding" element={<SeedingYoutube />} />
          <Route path="/youtube/category" element={<CategoryYoutube />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
