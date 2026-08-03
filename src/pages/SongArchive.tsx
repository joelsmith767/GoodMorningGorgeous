import { Link } from 'react-router-dom'
import { songCatalog } from '../songs'
import { getDayIndex, pickSongOfTheDay } from '../components/SongOfTheDay/songSelection'
import { getDayKeyInZone } from '../lib/dayKey'
import { REVEAL_RESET_TIME_ZONE, TEST_START_DATE } from '../components/DailyReveal/dailyRevealConfig'
import { pixelCalendarConfig } from '../components/PixelCalendar/config'
import './SongArchive.css'

const MS_PER_DAY = 24 * 60 * 60 * 1000

interface ArchivedDay {
  dayKey: string
  trackId: string
}

// Pure UTC calendar-date arithmetic — avoids the viewer's own machine
// timezone, which would otherwise shift dates parsed as local midnight.
function addDays(dayKey: string, days: number): string {
  const [year, month, day] = dayKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function countDaysBetween(startKey: string, endKey: string): number {
  const [y1, m1, d1] = startKey.split('-').map(Number)
  const [y2, m2, d2] = endKey.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / MS_PER_DAY)
}

// Song selection is a pure function of the calendar date, so the archive is
// just replaying that same picker across every day the ritual has run —
// no separate "was this revealed" state needs to exist anywhere.
function listArchivedDays(): ArchivedDay[] {
  const startDate = TEST_START_DATE ?? pixelCalendarConfig.startDate
  const todayKey = getDayKeyInZone(REVEAL_RESET_TIME_ZONE)
  const totalDays = countDaysBetween(startDate, todayKey)

  const days: ArchivedDay[] = []
  for (let i = 0; i <= totalDays; i++) {
    const dayKey = addDays(startDate, i)
    // Noon UTC safely falls within the same Vancouver calendar day, so this
    // resolves back to dayKey regardless of the viewer's own timezone.
    const trackId = pickSongOfTheDay(songCatalog, getDayIndex(new Date(`${dayKey}T12:00:00Z`)))
    if (trackId) {
      days.push({ dayKey, trackId })
    }
  }

  return days.reverse()
}

function formatDayLabel(dayKey: string): string {
  const date = new Date(`${dayKey}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function SongArchive() {
  const days = listArchivedDays()

  return (
    <main className="song-archive">
      <Link to="/" className="song-archive__back">
        ← Back
      </Link>
      <h1 className="song-archive__title">Past songs</h1>
      {days.length === 0 ? (
        <p className="song-archive__empty">No songs yet.</p>
      ) : (
        <ul className="song-archive__list">
          {days.map(({ dayKey, trackId }) => (
            <li key={dayKey} className="song-archive__item">
              <span className="song-archive__date">{formatDayLabel(dayKey)}</span>
              <a
                href={`https://open.spotify.com/track/${trackId}`}
                target="_blank"
                rel="noreferrer"
                className="song-archive__open"
              >
                Open in Spotify
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
