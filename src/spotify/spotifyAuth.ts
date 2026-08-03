import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPES } from './config'
import { generateCodeChallenge, generateCodeVerifier } from './pkce'

const CODE_VERIFIER_KEY = 'spotify_pkce_verifier'

/** Redirects the browser to Spotify's login/consent screen. */
export async function startSpotifyAuth(): Promise<void> {
  const verifier = generateCodeVerifier()
  sessionStorage.setItem(CODE_VERIFIER_KEY, verifier)
  const challenge = await generateCodeChallenge(verifier)

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

export interface SpotifyTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

function parseTokenResponse(data: {
  access_token: string
  refresh_token?: string
  expires_in: number
}, fallbackRefreshToken: string): SpotifyTokens {
  return {
    accessToken: data.access_token,
    // Spotify may omit refresh_token on refresh if it hasn't changed.
    refreshToken: data.refresh_token ?? fallbackRefreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
}

/** Exchanges the ?code= param from the OAuth redirect for real tokens. */
export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
  const verifier = sessionStorage.getItem(CODE_VERIFIER_KEY)
  if (!verifier) {
    throw new Error('Missing Spotify PKCE verifier')
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_verifier: verifier,
    }),
  })
  sessionStorage.removeItem(CODE_VERIFIER_KEY)
  if (!res.ok) {
    throw new Error('Spotify token exchange failed')
  }
  const data = await res.json()
  return parseTokenResponse(data, '')
}

export async function refreshSpotifyTokens(refreshToken: string): Promise<SpotifyTokens> {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) {
    throw new Error('Spotify token refresh failed')
  }
  const data = await res.json()
  return parseTokenResponse(data, refreshToken)
}
