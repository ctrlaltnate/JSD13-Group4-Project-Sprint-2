import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/index.js'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App
