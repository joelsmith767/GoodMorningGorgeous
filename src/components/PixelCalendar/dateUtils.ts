const MS_PER_DAY = 24 * 60 * 60 * 1000

export function getTotalDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1
}
