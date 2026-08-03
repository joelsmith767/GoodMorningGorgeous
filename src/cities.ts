export type CalendarOwner = 'hannah' | 'joel'

export interface CityConfig {
  id: string
  label: string
  timeZone: string
  /** Whose personal calendar shows on this city's page. */
  calendarOwner: CalendarOwner
  latitude: number
  longitude: number
}

export const cities: CityConfig[] = [
  {
    id: 'vancouver',
    label: 'Vancouver',
    timeZone: 'America/Vancouver',
    calendarOwner: 'hannah',
    latitude: 49.2827,
    longitude: -123.1207,
  },
  {
    id: 'glasgow',
    label: 'Glasgow',
    timeZone: 'Europe/London',
    calendarOwner: 'joel',
    latitude: 55.8642,
    longitude: -4.2518,
  },
]
