const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Stable "YYYY-MM-DD" key for the calendar day in a given timezone. */
export function getDayKeyInZone(timeZone: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/**
 * Days elapsed since startDate, counted against "today" in a specific
 * timezone rather than the viewer's own local time — so everyone sees the
 * same day-count regardless of where they're looking from.
 */
export function getDaysElapsedInZone(
  startDate: string,
  timeZone: string,
  referenceDate: Date = new Date(),
): number {
  const start = new Date(`${startDate}T00:00:00`)
  const todayKey = getDayKeyInZone(timeZone, referenceDate)
  const todayLocalMidnight = new Date(`${todayKey}T00:00:00`)
  return Math.floor((todayLocalMidnight.getTime() - start.getTime()) / MS_PER_DAY) + 1
}

/** Whole days from "today" (in the given timezone) until targetDate. */
export function getDaysUntilInZone(
  targetDate: string,
  timeZone: string,
  referenceDate: Date = new Date(),
): number {
  const target = new Date(`${targetDate}T00:00:00`)
  const todayKey = getDayKeyInZone(timeZone, referenceDate)
  const todayLocalMidnight = new Date(`${todayKey}T00:00:00`)
  return Math.ceil((target.getTime() - todayLocalMidnight.getTime()) / MS_PER_DAY)
}
