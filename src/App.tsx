import { Routes, Route } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { Login } from './auth/Login'
import { Home } from './pages/Home'
import { CityDetail } from './pages/CityDetail'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <main className="app-loading" />
  }

  if (!user) {
    return <Login />
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/city/:cityId" element={<CityDetail />} />
    </Routes>
  )
}

export default App
