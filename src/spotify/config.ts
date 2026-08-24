// Spotify's client-side (PKCE) OAuth flow needs no secret, so this is safe to
// commit — same reasoning as the public Firebase config.
export const SPOTIFY_CLIENT_ID = '5bebec667e2c4e7ab83113af43fc292b'

// Must exactly match a redirect URI registered in the Spotify dashboard.
// Hardcoded (not derived from window.location) because the OAuth round-trip
// can only work against the deployed site anyway — Spotify won't accept a
// localhost redirect_uri that isn't separately registered.
export const SPOTIFY_REDIRECT_URI = 'https://joelsmith767.github.io/GoodMorningGorgeous/'

export const SPOTIFY_SCOPES = 'playlist-modify-private playlist-modify-public playlist-read-private'

// Joel created this playlist himself (to control its name/cover/description),
// so the sync uses it directly instead of auto-creating one. Set to null to
// go back to auto-creating a playlist named SPOTIFY_PLAYLIST_NAME.
export const SPOTIFY_PLAYLIST_ID: string | null = '4gEl5KSok1heaLGVBxKAtb'

export const SPOTIFY_PLAYLIST_NAME = 'Song of the Day Archive'
