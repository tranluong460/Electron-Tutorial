import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import {
  BaseFacebook,
  BasePage,
  BaseYoutube,
  CommentFacebook,
  CommentYoutube,
  HomePage,
  LikeFacebook,
  LikeYoutube,
  ShareFacebook,
  SubscribeYoutube,
  ViewYoutube
} from './pages'

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route element={<BasePage />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/youtube" element={<BaseYoutube />}>
            <Route path="buff-view" element={<ViewYoutube />} />
            <Route path="buff-like" element={<LikeYoutube />} />
            <Route path="buff-subscribe" element={<SubscribeYoutube />} />
            <Route path="buff-comment" element={<CommentYoutube />} />
          </Route>

          <Route path="/facebook" element={<BaseFacebook />}>
            <Route path="buff-like" element={<LikeFacebook />} />
            <Route path="buff-comment" element={<CommentFacebook />} />
            <Route path="buff-share" element={<ShareFacebook />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
