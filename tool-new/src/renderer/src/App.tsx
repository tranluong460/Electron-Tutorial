import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { BasePage, HomePage } from './pages'

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route element={<BasePage />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
