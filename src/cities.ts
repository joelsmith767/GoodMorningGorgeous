export interface CityConfig {
  id: string
  label: string
  timeZone: string
}

export const cities: CityConfig[] = [
  { id: 'vancouver', label: 'Vancouver', timeZone: 'America/Vancouver' },
  { id: 'glasgow', label: 'Glasgow', timeZone: 'Europe/London' },
]
