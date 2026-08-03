import { useEffect, useState } from 'react'

export interface CityWeather {
  temperature: number
  weatherCode: number
  isDay: boolean
}

/**
 * Open-Meteo needs no API key and allows browser-side calls, which matters
 * here since this site has no backend to keep a key secret behind.
 */
export function useCityWeather(latitude: number, longitude: number): CityWeather | null {
  const [weather, setWeather] = useState<CityWeather | null>(null)

  useEffect(() => {
    let cancelled = false
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setWeather({
          temperature: data.current.temperature_2m,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
        })
      })
      .catch(() => {
        // Weather is a nice-to-have; leave it unset rather than surface an error.
      })

    return () => {
      cancelled = true
    }
  }, [latitude, longitude])

  return weather
}
