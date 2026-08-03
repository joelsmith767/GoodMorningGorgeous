export type CalendarOwner = 'hannah' | 'joel'

export interface CityConfig {
  id: string
  label: string
  timeZone: string
  /** Whose personal calendar shows on this city's page. */
  calendarOwner: CalendarOwner
}

export const cities: CityConfig[] = [
  { id: 'vancouver', label: 'Vancouver', timeZone: 'America/Vancouver', calendarOwner: 'hannah' },
  { id: 'glasgow', label: 'Glasgow', timeZone: 'Europe/London', calendarOwner: 'joel' },
]
