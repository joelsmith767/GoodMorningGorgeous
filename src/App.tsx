import { useAuth } from './auth/AuthContext'
import { Login } from './auth/Login'
import { PixelCalendar } from './components/PixelCalendar/PixelCalendar'
import { DigitalClock } from './components/DigitalClock/DigitalClock'

function App() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return <main className="app-loading" />
  }

  if (!user) {
    return <Login />
  }

  return (
    <main>
      <div className="clock-corner clock-corner--left">
        <DigitalClock timeZone="America/Vancouver" label="Vancouver" />
      </div>
      <div className="clock-corner clock-corner--right">
        <DigitalClock timeZone="Europe/London" label="Glasgow" />
      </div>
      <button type="button" className="logout-button" onClick={logout}>
        Sign out
      </button>
      <PixelCalendar />
    </main>
  )
}

export default App
