export interface SpotifyOEmbedData {
  title: string
  thumbnailUrl: string
}

// Spotify's public oEmbed endpoint — no API key needed. Used only to get a
// plain <img> we can animate ourselves; the embed iframe is cross-origin and
// gives us no control over anything inside it.
export async function fetchSpotifyOEmbed(trackId: string): Promise<SpotifyOEmbedData | null> {
  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`,
    )
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return { title: data.title, thumbnailUrl: data.thumbnail_url }
  } catch {
    return null
  }
}
