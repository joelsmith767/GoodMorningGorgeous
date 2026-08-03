function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

export interface MonthDayCell {
  day: number
  dayKey: string
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Cells for a Sun-first month grid; leading `null`s pad to the month's first weekday. */
export function getMonthCells(year: number, month: number): (MonthDayCell | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = new Date(year, month, 1).getDay()
  const cells: (MonthDayCell | null)[] = Array.from({ length: leadingBlanks }, () => null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, dayKey: `${year}-${pad(month + 1)}-${pad(day)}` })
  }
  return cells
}
