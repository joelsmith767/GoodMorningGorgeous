export interface WeatherInfo {
  icon: string
  label: string
}

// WMO weather codes, as returned by Open-Meteo's `weather_code` field.
// https://open-meteo.com/en/docs
const WEATHER_CODES: Record<number, WeatherInfo> = {
  0: { icon: '☀️', label: 'Clear sky' },
  1: { icon: '🌤️', label: 'Mainly clear' },
  2: { icon: '⛅', label: 'Partly cloudy' },
  3: { icon: '☁️', label: 'Overcast' },
  45: { icon: '🌫️', label: 'Fog' },
  48: { icon: '🌫️', label: 'Fog' },
  51: { icon: '🌦️', label: 'Light drizzle' },
  53: { icon: '🌦️', label: 'Drizzle' },
  55: { icon: '🌦️', label: 'Dense drizzle' },
  56: { icon: '🌧️', label: 'Freezing drizzle' },
  57: { icon: '🌧️', label: 'Freezing drizzle' },
  61: { icon: '🌧️', label: 'Light rain' },
  63: { icon: '🌧️', label: 'Rain' },
  65: { icon: '🌧️', label: 'Heavy rain' },
  66: { icon: '🌧️', label: 'Freezing rain' },
  67: { icon: '🌧️', label: 'Freezing rain' },
  71: { icon: '🌨️', label: 'Light snow' },
  73: { icon: '🌨️', label: 'Snow' },
  75: { icon: '🌨️', label: 'Heavy snow' },
  77: { icon: '🌨️', label: 'Snow grains' },
  80: { icon: '🌦️', label: 'Rain showers' },
  81: { icon: '🌦️', label: 'Rain showers' },
  82: { icon: '⛈️', label: 'Violent rain showers' },
  85: { icon: '🌨️', label: 'Snow showers' },
  86: { icon: '🌨️', label: 'Snow showers' },
  95: { icon: '⛈️', label: 'Thunderstorm' },
  96: { icon: '⛈️', label: 'Thunderstorm with hail' },
  99: { icon: '⛈️', label: 'Thunderstorm with hail' },
}

const DEFAULT_WEATHER_INFO: WeatherInfo = { icon: '🌡️', label: 'Unknown' }

// Clear/mostly-clear codes get a moon instead of a sun after dark; clouds,
// rain, etc. look the same regardless of time of day.
export function getWeatherInfo(code: number, isDay: boolean): WeatherInfo {
  if (!isDay && (code === 0 || code === 1)) {
    return { icon: '🌙', label: WEATHER_CODES[code].label }
  }
  return WEATHER_CODES[code] ?? DEFAULT_WEATHER_INFO
}
