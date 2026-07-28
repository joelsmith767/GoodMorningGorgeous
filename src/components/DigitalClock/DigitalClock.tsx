import { useEffect, useState } from 'react'
import { getTimeInZone } from './timeInZone'
import './DigitalClock.css'

export interface DigitalClockProps {
  timeZone: string
  label: string
  size?: 'small' | 'large'
}

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

export function DigitalClock({ timeZone, label, size = 'small' }: DigitalClockProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const { hours, minutes, seconds } = getTimeInZone(timeZone, now)

  return (
    <div className={`digital-clock digital-clock--${size}`}>
      <span className="digital-clock__time">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
      <span className="digital-clock__label">{label}</span>
    </div>
  )
}
