import { Auth } from './apis'
import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import {
  BasePage,
  HomePage,
  LikeYoutube,
  SubscribeYoutube,
  ViewYoutube,
  ManagerYoutube,
  CommentYoutube,
  LoginPage
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
          <Route path="/youtube/comment" element={<CommentYoutube />} />
          <Route path="/youtube/like" element={<LikeYoutube />} />
          <Route path="/youtube/subscribe" element={<SubscribeYoutube />} />
          <Route path="/youtube/view" element={<ViewYoutube />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
