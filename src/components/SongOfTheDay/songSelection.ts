import { createSeededOrder } from '../../lib/seededShuffle'

const MS_PER_DAY = 24 * 60 * 60 * 1000

// Independent of the pixel calendar's date range — the song plays every day,
// not gated behind the reveal start date.
export function getDayIndex(date: Date = new Date()): number {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor(localMidnight.getTime() / MS_PER_DAY)
}

// Change this to reshuffle the rotation (e.g. after a big catalog update).
const SONG_SEED = 42

/**
 * Picks a song for the given day, cycling through a shuffled version of the
 * catalog so nothing repeats until every song has played once, then reshuffles
 * implicitly by wrapping — same "stable random" approach as the pixel reveal order.
 */
export function pickSongOfTheDay(catalog: string[], dayIndex: number): string | null {
  if (catalog.length === 0) {
    return null
  }

  const order = createSeededOrder(catalog.length, SONG_SEED)
  const position = ((dayIndex % catalog.length) + catalog.length) % catalog.length
  return catalog[order[position]]
}
