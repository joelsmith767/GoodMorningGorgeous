import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { Login } from './auth/Login'
import { Home } from './pages/Home'
import { CityDetail } from './pages/CityDetail'
import { SongArchive } from './pages/SongArchive'
import { exchangeCodeForTokens } from './spotify/spotifyAuth'
import { saveSpotifyAuth } from './spotify/spotifyTokenStore'

function App() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Handles the redirect back from Spotify's OAuth consent screen — lands on
  // the site root (redirect_uri has no hash), regardless of which page the
  // "Connect Spotify" click originated from.
  useEffect(() => {
    if (!user) return
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) return

    exchangeCodeForTokens(code)
      .then((tokens) => saveSpotifyAuth(tokens))
      .catch(() => {
        // Nothing to recover here — the user can just click Connect again.
      })
      .finally(() => {
        window.history.replaceState({}, '', window.location.pathname + window.location.hash)
        navigate('/songs')
      })
  }, [user, navigate])

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
      <Route path="/songs" element={<SongArchive />} />
    </Routes>
  )
}

export default App
