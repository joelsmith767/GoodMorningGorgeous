import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PixelCalendar } from '../components/PixelCalendar/PixelCalendar'
import { usePixelReveal } from '../components/PixelCalendar/usePixelReveal'
import { pixelCalendarConfig } from '../components/PixelCalendar/config'
import { DailyReveal } from '../components/DailyReveal/DailyReveal'
import { REVEALER_EMAIL } from '../components/DailyReveal/dailyRevealConfig'
import { DigitalClock } from '../components/DigitalClock/DigitalClock'
import { cities } from '../cities'

export function Home() {
  const { user, logout } = useAuth()
  const pixelReveal = usePixelReveal()
  const isRevealer = user?.email === REVEALER_EMAIL

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

      <div className="home-content">
        <PixelCalendar
          gridColumns={pixelReveal.gridColumns}
          gridRows={pixelReveal.gridRows}
          totalPixels={pixelReveal.totalPixels}
          revealedCount={pixelReveal.revealedCount}
          revealStepByCell={pixelReveal.revealStepByCell}
          onRevealNext={pixelReveal.revealNext}
          onResetToToday={pixelReveal.resetToToday}
        />

        {isRevealer && (
          <DailyReveal
            image={pixelCalendarConfig.image}
            gridColumns={pixelReveal.gridColumns}
            gridRows={pixelReveal.gridRows}
            totalPixels={pixelReveal.totalPixels}
            revealedCount={pixelReveal.revealedCount}
            revealStepByCell={pixelReveal.revealStepByCell}
            nextCellIndex={pixelReveal.nextCellIndex}
            hasPendingReveal={pixelReveal.hasPendingReveal}
            loading={pixelReveal.loading}
            onRevealNext={pixelReveal.revealNext}
          />
        )}
      </div>
    </main>
  )
}
