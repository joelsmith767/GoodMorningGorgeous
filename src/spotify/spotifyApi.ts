const API_BASE = 'https://api.spotify.com/v1'

async function spotifyFetch<T>(url: string, accessToken: string, init?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`
  const res = await fetch(fullUrl, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status}`)
  }
  return res.status === 204 ? (null as T) : res.json()
}

export async function getCurrentUserId(accessToken: string): Promise<string> {
  const data = await spotifyFetch<{ id: string }>('/me', accessToken)
  return data.id
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
): Promise<string> {
  const data = await spotifyFetch<{ id: string }>(`/users/${userId}/playlists`, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      name,
      public: false,
      description: 'Song of the day, archived automatically.',
    }),
  })
  return data.id
}

interface PlaylistTracksPage {
  items: { track: { id: string | null } | null }[]
  next: string | null
}

export async function getPlaylistTrackIds(
  accessToken: string,
  playlistId: string,
): Promise<Set<string>> {
  const ids = new Set<string>()
  let url: string | null = `/playlists/${playlistId}/tracks?fields=items(track(id)),next&limit=100`

  while (url) {
    const page: PlaylistTracksPage = await spotifyFetch(url, accessToken)
    for (const item of page.items) {
      if (item.track?.id) {
        ids.add(item.track.id)
      }
    }
    url = page.next
  }

  return ids
}

const ADD_TRACKS_CHUNK_SIZE = 100

export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  trackIds: string[],
): Promise<void> {
  for (let i = 0; i < trackIds.length; i += ADD_TRACKS_CHUNK_SIZE) {
    const chunk = trackIds.slice(i, i + ADD_TRACKS_CHUNK_SIZE)
    await spotifyFetch(`/playlists/${playlistId}/tracks`, accessToken, {
      method: 'POST',
      body: JSON.stringify({ uris: chunk.map((id) => `spotify:track:${id}`) }),
    })
  }
}
