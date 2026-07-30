import { useEffect, useState } from 'react'
import { songCatalog } from '../../songs'
import { getDayIndex, pickSongOfTheDay } from './songSelection'
import { fetchSpotifyOEmbed, type SpotifyOEmbedData } from './spotifyOEmbed'
import './SongOfTheDay.css'

export function SongOfTheDay() {
  const trackId = pickSongOfTheDay(songCatalog, getDayIndex())
  const [thumbnail, setThumbnail] = useState<SpotifyOEmbedData | null>(null)
  const [showEmbed, setShowEmbed] = useState(false)

  useEffect(() => {
    if (!trackId) {
      return
    }
    let cancelled = false
    setShowEmbed(false)
    fetchSpotifyOEmbed(trackId).then((data) => {
      if (!cancelled) {
        setThumbnail(data)
      }
    })
    return () => {
      cancelled = true
    }
  }, [trackId])

  if (!trackId) {
    return <p className="song-of-the-day__empty">No songs in the catalog yet.</p>
  }

  return (
    <div className="song-of-the-day">
      {thumbnail && (
        <img
          key={trackId}
          src={thumbnail.thumbnailUrl}
          alt={thumbnail.title}
          className="song-of-the-day__thumbnail"
          onAnimationEnd={() => setShowEmbed(true)}
        />
      )}
      {showEmbed && (
        <iframe
          title="Song of the day"
          className="song-of-the-day__embed"
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&autoplay=1`}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      )}
    </div>
  )
}
