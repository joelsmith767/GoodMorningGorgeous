import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useAuth } from '../auth/AuthContext'
import { songCatalog } from '../songs'
import { getDayIndex, pickSongOfTheDay } from '../components/SongOfTheDay/songSelection'
import { getDayKeyInZone } from '../lib/dayKey'
import { REVEALER_EMAIL, REVEAL_RESET_TIME_ZONE, TEST_START_DATE } from '../components/DailyReveal/dailyRevealConfig'
import { pixelCalendarConfig } from '../components/PixelCalendar/config'
import { usePixelReveal } from '../components/PixelCalendar/usePixelReveal'
import { useSpotifySync } from '../spotify/useSpotifySync'
import './SongArchive.css'

const MS_PER_DAY = 24 * 60 * 60 * 1000

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
// just replaying that same picker across every day that's actually been
// revealed — capped by revealedCount (the same Firestore-backed counter the
// pixel grid uses) rather than by today's date, so a song isn't added to the
// playlist before that day's reveal ritual has happened. Also capped by real
// elapsed days, since the pixel grid's "reveal next (test)" button can
// otherwise push revealedCount ahead of today. Returned oldest-first, since
// that's the order the Spotify sync wants to insert in.
function listArchivedTrackIds(revealedCount: number): string[] {
  const startDate = TEST_START_DATE ?? pixelCalendarConfig.startDate
  const todayKey = getDayKeyInZone(REVEAL_RESET_TIME_ZONE)
  const daysElapsed = countDaysBetween(startDate, todayKey) + 1
  const revealedDays = Math.max(0, Math.min(revealedCount, daysElapsed))

  const trackIds: string[] = []
  for (let i = 0; i < revealedDays; i++) {
    const dayKey = addDays(startDate, i)
    // Noon UTC safely falls within the same Vancouver calendar day, so this
    // resolves back to dayKey regardless of the viewer's own timezone.
    const trackId = pickSongOfTheDay(songCatalog, getDayIndex(new Date(`${dayKey}T12:00:00Z`)))
    if (trackId) {
      trackIds.push(trackId)
    }
  }

  return trackIds
}

export function SongArchive() {
  const { user } = useAuth()
  const isJoel = user?.email !== REVEALER_EMAIL
  const pixelReveal = usePixelReveal()
  const trackIds = useMemo(
    () => listArchivedTrackIds(pixelReveal.revealedCount),
    [pixelReveal.revealedCount],
  )
  const spotify = useSpotifySync(isJoel, trackIds)

  const showConnectPrompt = isJoel && !spotify.connected
  const showEmptyMessage = !spotify.playlistUrl && !showConnectPrompt

  return (
    <main className="song-archive">
      <Link to="/" className="song-archive__back">
        ← Back
      </Link>
      <h1 className="song-archive__title">Past songs</h1>

      {spotify.playlistUrl && (
        <a
          href={spotify.playlistUrl}
          target="_blank"
          rel="noreferrer"
          className="song-archive__playlist-link"
        >
          Listen to the archive on Spotify →
        </a>
      )}

      {showConnectPrompt && (
        <button type="button" className="song-archive__connect" onClick={spotify.connect}>
          Connect Spotify to auto-sync this playlist
        </button>
      )}

      {isJoel && spotify.connected && spotify.syncing && (
        <p className="song-archive__sync-status">Syncing playlist…</p>
      )}

      {isJoel && spotify.lastError && (
        <p className="song-archive__error">Sync failed: {spotify.lastError}</p>
      )}

      {showEmptyMessage && <p className="song-archive__empty">Nothing archived yet.</p>}
    </main>
  )
}
