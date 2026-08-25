import { getDaysElapsedInZone } from '../../lib/dayKey'
import { REVEAL_RESET_TIME_ZONE } from '../DailyReveal/dailyRevealConfig'
import { pixelCalendarConfig } from '../PixelCalendar/config'

// 0-indexed day count from the same Aug 25, 2026 start date the pixel
// reveal uses (Vancouver time), so day one of the site picks the first
// song in the catalog, day two picks the second, and so on.
export function getDayIndex(date: Date = new Date()): number {
  return getDaysElapsedInZone(pixelCalendarConfig.startDate, REVEAL_RESET_TIME_ZONE, date) - 1
}

/**
 * Picks a song for the given day by walking straight through the catalog in
 * order, wrapping back to the start once it reaches the end.
 */
export function pickSongOfTheDay(catalog: string[], dayIndex: number): string | null {
  if (catalog.length === 0) {
    return null
  }

  const position = ((dayIndex % catalog.length) + catalog.length) % catalog.length
  return catalog[position]
}
