import { getDayKeyInZone } from '../../lib/dayKey'
import { REVEAL_RESET_TIME_ZONE } from '../DailyReveal/dailyRevealConfig'

const MS_PER_DAY = 24 * 60 * 60 * 1000

// Keyed off Vancouver's calendar day (same reference clock as the pixel
// reveal gate) so it's the same song for both accounts, not per-viewer.
export function getDayIndex(date: Date = new Date()): number {
  const dayKey = getDayKeyInZone(REVEAL_RESET_TIME_ZONE, date)
  return Math.floor(new Date(`${dayKey}T00:00:00`).getTime() / MS_PER_DAY)
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
