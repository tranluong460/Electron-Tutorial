import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { BasePage, ElectronPage, HomePage } from './pages'

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route element={<BasePage />}>
          <Route index element={<ElectronPage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
