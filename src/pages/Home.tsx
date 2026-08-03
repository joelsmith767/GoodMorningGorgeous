import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PixelCalendar } from '../components/PixelCalendar/PixelCalendar'
import { usePixelReveal } from '../components/PixelCalendar/usePixelReveal'
import { pixelCalendarConfig } from '../components/PixelCalendar/config'
import { DailyReveal } from '../components/DailyReveal/DailyReveal'
import { REVEALER_EMAIL, REVEAL_RESET_TIME_ZONE } from '../components/DailyReveal/dailyRevealConfig'
import { DigitalClock } from '../components/DigitalClock/DigitalClock'
import { getDistanceKm, estimateFlightHours } from '../lib/greatCircle'
import { getDaysUntilInZone } from '../lib/dayKey'
import { cities } from '../cities'

export function Home() {
  const { user, logout } = useAuth()
  const pixelReveal = usePixelReveal()
  const isRevealer = user?.email === REVEALER_EMAIL

  const [cityA, cityB] = cities
  const distanceKm = Math.round(getDistanceKm(cityA, cityB))
  const flightHours = Math.round(estimateFlightHours(distanceKm))
  const daysUntilReunion = getDaysUntilInZone(pixelCalendarConfig.endDate, REVEAL_RESET_TIME_ZONE)

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
        <div className="home-stats">
          <p className="home-stat-line">{daysUntilReunion} days until we're back together</p>
          <p className="home-stat-line">
            {cityA.label} ✈ {cityB.label} · {distanceKm.toLocaleString()} km · ~{flightHours}h flight
          </p>
        </div>

        <PixelCalendar
          gridColumns={pixelReveal.gridColumns}
          gridRows={pixelReveal.gridRows}
          totalPixels={pixelReveal.totalPixels}
          revealedCount={pixelReveal.revealedCount}
          revealStepByCell={pixelReveal.revealStepByCell}
          onRevealNext={pixelReveal.revealNext}
          onResetToToday={pixelReveal.resetToToday}
        />

        {isRevealer ? (
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
        ) : (
          !pixelReveal.loading && (
            <p className="reveal-status">
              {pixelReveal.hasPendingReveal
                ? "Hannah hasn't revealed today's pixel yet"
                : "Hannah's already revealed today's pixel"}
            </p>
          )
        )}

        <Link to="/songs" className="song-archive-link">
          Past songs →
        </Link>
      </div>
    </main>
  )
}
