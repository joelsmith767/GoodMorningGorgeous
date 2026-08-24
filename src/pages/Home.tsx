import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PixelCalendar } from '../components/PixelCalendar/PixelCalendar'
import { usePixelReveal } from '../components/PixelCalendar/usePixelReveal'
import { pixelCalendarConfig } from '../components/PixelCalendar/config'
import { DailyReveal } from '../components/DailyReveal/DailyReveal'
import { REVEALER_EMAIL, REVEAL_RESET_TIME_ZONE } from '../components/DailyReveal/dailyRevealConfig'
import { FarewellMessage } from '../components/FarewellMessage/FarewellMessage'
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
          <div className="home-stats__countdown">
            <p className="home-stats__label">Days until reunion</p>
            <p className="home-stats__count">{daysUntilReunion}</p>
          </div>
          <div className="home-stats__route">
            <span className="home-stats__route-to">
              {cityA.label} → {cityB.label}
            </span>
            <span className="home-stats__route-mid">{distanceKm.toLocaleString()} km</span>
            <span className="home-stats__route-dur">~{flightHours}h</span>
          </div>
        </div>

        <PixelCalendar
          gridColumns={pixelReveal.gridColumns}
          gridRows={pixelReveal.gridRows}
          totalPixels={pixelReveal.totalPixels}
          revealedCount={pixelReveal.revealedCount}
          revealStepByCell={pixelReveal.revealStepByCell}
          onRevealNext={!isRevealer ? pixelReveal.revealNext : undefined}
          onResetToToday={!isRevealer ? pixelReveal.resetToToday : undefined}
        />

        <div className="ritual-buttons">
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
          <FarewellMessage />
        </div>
      </div>
    </main>
  )
}
