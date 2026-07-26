const MS_PER_DAY = 24 * 60 * 60 * 1000

function parseDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00`)
}

export function getTotalDays(startDate: string, endDate: string): number {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1
}

export function getDaysElapsed(startDate: string): number {
  const start = parseDate(startDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.floor((today.getTime() - start.getTime()) / MS_PER_DAY) + 1
}
