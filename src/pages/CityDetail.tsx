import { Link, useParams } from 'react-router-dom'
import { DigitalClock } from '../components/DigitalClock/DigitalClock'
import { cities } from '../cities'
import './CityDetail.css'

export function CityDetail() {
  const { cityId } = useParams<{ cityId: string }>()
  const city = cities.find((candidate) => candidate.id === cityId)

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
      <p className="city-detail__placeholder">More about {city.label} coming soon.</p>
    </main>
  )
}
