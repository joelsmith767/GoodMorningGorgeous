import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { DigitalClock } from '../components/DigitalClock/DigitalClock'
import { CityCalendar } from '../components/CityCalendar/CityCalendar'
import { useCityWeather } from '../components/CityWeather/useCityWeather'
import { getWeatherInfo } from '../components/CityWeather/weatherCodes'
import { REVEALER_EMAIL } from '../components/DailyReveal/dailyRevealConfig'
import { cities } from '../cities'
import './CityDetail.css'

export function CityDetail() {
  const { cityId } = useParams<{ cityId: string }>()
  const city = cities.find((candidate) => candidate.id === cityId)
  const { user } = useAuth()
  const viewerRole = user?.email === REVEALER_EMAIL ? 'hannah' : 'joel'
  const weather = useCityWeather(city?.latitude ?? 0, city?.longitude ?? 0)

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

  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode, weather.isDay) : null

  return (
    <main className="city-detail">
      <Link to="/" className="city-detail__back">
        ← Back
      </Link>
      <div
        className={[
          'city-detail__clock-card',
          weather ? (weather.isDay ? 'is-day' : 'is-night') : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <DigitalClock timeZone={city.timeZone} label={city.label} size="large" />
        {weather && weatherInfo && (
          <div className="city-weather">
            <span className="city-weather__icon" aria-hidden="true">
              {weatherInfo.icon}
            </span>
            <span className="city-weather__temp">{Math.round(weather.temperature)}°C</span>
            <span className="city-weather__label">{weatherInfo.label}</span>
          </div>
        )}
      </div>
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
