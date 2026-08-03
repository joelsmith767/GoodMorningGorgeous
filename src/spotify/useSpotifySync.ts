import { useCallback, useEffect, useState } from 'react'
import { refreshSpotifyTokens, startSpotifyAuth } from './spotifyAuth'
import { loadSpotifyAuth, saveSpotifyAuth, type StoredSpotifyAuth } from './spotifyTokenStore'
import {
  addTracksToPlaylist,
  createPlaylist,
  getCurrentUserId,
  getPlaylistTrackIds,
} from './spotifyApi'
import { SPOTIFY_PLAYLIST_ID, SPOTIFY_PLAYLIST_NAME } from './config'

const REFRESH_MARGIN_MS = 60_000

async function getValidAccessToken(
  auth: StoredSpotifyAuth,
): Promise<{ accessToken: string; refreshedAuth?: StoredSpotifyAuth }> {
  if (Date.now() < auth.expiresAt - REFRESH_MARGIN_MS) {
    return { accessToken: auth.accessToken }
  }
  const refreshed = await refreshSpotifyTokens(auth.refreshToken)
  const nextAuth = { ...auth, ...refreshed }
  await saveSpotifyAuth(nextAuth)
  return { accessToken: refreshed.accessToken, refreshedAuth: nextAuth }
}

function playlistUrlFor(playlistId: string): string {
  return `https://open.spotify.com/playlist/${playlistId}`
}

/**
 * Runs a best-effort "catch-up" sync whenever the archive page is visited
 * while connected — this site has no backend, so there's no way to run this
 * on a fixed schedule; visiting is the trigger. Tracks already in the
 * playlist are left alone (dedup by track id), so a catalog repeat doesn't
 * create duplicate entries.
 */
export function useSpotifySync(enabled: boolean, chronologicalTrackIds: string[]) {
  const [connected, setConnected] = useState(false)
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadSpotifyAuth()
      .then((auth) => {
        if (cancelled || !auth) return
        setConnected(Boolean(auth.refreshToken))
        if (auth.playlistId) {
          setPlaylistUrl(playlistUrlFor(auth.playlistId))
        }
      })
      .catch(() => {
        // Not connected yet; leave defaults as-is.
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!enabled || chronologicalTrackIds.length === 0) {
      return
    }
    let cancelled = false

    const run = async () => {
      try {
        let auth = await loadSpotifyAuth()
        if (cancelled || !auth?.refreshToken) {
          return
        }

        setSyncing(true)
        setLastError(null)
        const { accessToken, refreshedAuth } = await getValidAccessToken(auth)
        if (refreshedAuth) {
          auth = refreshedAuth
        }

        let playlistId = auth.playlistId
        if (!playlistId) {
          if (SPOTIFY_PLAYLIST_ID) {
            playlistId = SPOTIFY_PLAYLIST_ID
          } else {
            const userId = await getCurrentUserId(accessToken)
            playlistId = await createPlaylist(accessToken, userId, SPOTIFY_PLAYLIST_NAME)
          }
          await saveSpotifyAuth({ playlistId })
          if (!cancelled) {
            setPlaylistUrl(playlistUrlFor(playlistId))
          }
        }

        const existingIds = await getPlaylistTrackIds(accessToken, playlistId)
        const missing = chronologicalTrackIds.filter((id) => !existingIds.has(id))
        if (missing.length > 0) {
          await addTracksToPlaylist(accessToken, playlistId, missing)
        }
      } catch (error) {
        // Best-effort background sync — try again next visit, but surface
        // what happened so it's not a silent, unexplained no-op.
        console.error('Spotify sync failed:', error)
        if (!cancelled) {
          setLastError(error instanceof Error ? error.message : String(error))
        }
      } finally {
        if (!cancelled) {
          setSyncing(false)
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [enabled, chronologicalTrackIds])

  const connect = useCallback(() => {
    startSpotifyAuth()
  }, [])

  return { connected, playlistUrl, syncing, lastError, connect }
}
