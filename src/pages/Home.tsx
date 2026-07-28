import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PixelCalendar } from '../components/PixelCalendar/PixelCalendar'
import { DigitalClock } from '../components/DigitalClock/DigitalClock'
import { cities } from '../cities'

export function Home() {
  const { logout } = useAuth()

  return (
    <main>
      {cities.map((city, index) => (
        <Link
          key={city.id}
          to={`/city/${city.id}`}
          className={`clock-corner clock-corner--${index === 0 ? 'left' : 'right'} clock-tile-link`}
        >
          <DigitalClock timeZone={city.timeZone} label={city.label} />
        </Link>
      ))}
      <button type="button" className="logout-button" onClick={logout}>
        Sign out
      </button>
      <PixelCalendar />
    </main>
  )
}
