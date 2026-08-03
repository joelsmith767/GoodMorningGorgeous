import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { DigitalClock } from '../components/DigitalClock/DigitalClock'
import { CityCalendar } from '../components/CityCalendar/CityCalendar'
import { REVEALER_EMAIL } from '../components/DailyReveal/dailyRevealConfig'
import { cities } from '../cities'
import './CityDetail.css'

export function CityDetail() {
  const { cityId } = useParams<{ cityId: string }>()
  const city = cities.find((candidate) => candidate.id === cityId)
  const { user } = useAuth()
  const viewerRole = user?.email === REVEALER_EMAIL ? 'hannah' : 'joel'

  if (!city) {
    return (
      <main className="city-detail">
        <p>Unknown city.</p>
        <Link to="/" className="city-detail__back">
          ← Back
        </Link>
      </main>
    )
  }

  return (
    <main className="city-detail">
      <Link to="/" className="city-detail__back">
        ← Back
      </Link>
      <DigitalClock timeZone={city.timeZone} label={city.label} size="large" />
      <CityCalendar
        key={city.calendarOwner}
        owner={city.calendarOwner}
        ownerLabel={city.calendarOwner === 'hannah' ? "Hannah's calendar" : "Joel's calendar"}
        canEdit={city.calendarOwner === viewerRole}
        timeZone={city.timeZone}
      />
    </main>
  )
}
