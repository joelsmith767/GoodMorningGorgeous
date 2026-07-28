import { songCatalog } from '../../songs'
import { getDayIndex, pickSongOfTheDay } from './songSelection'
import './SongOfTheDay.css'

export function SongOfTheDay() {
  const trackId = pickSongOfTheDay(songCatalog, getDayIndex())

  if (!trackId) {
    return <p className="song-of-the-day__empty">No songs in the catalog yet.</p>
  }

  return (
    <div className="song-of-the-day">
      <iframe
        title="Song of the day"
        className="song-of-the-day__embed"
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  )
}
