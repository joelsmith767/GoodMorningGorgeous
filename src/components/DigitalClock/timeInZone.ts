export interface TimeInZone {
  hours: number
  minutes: number
  seconds: number
}

export function getTimeInZone(timeZone: string, date: Date): TimeInZone {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(date)

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    hours: Number(map.hour) % 24,
    minutes: Number(map.minute),
    seconds: Number(map.second),
  }
}
