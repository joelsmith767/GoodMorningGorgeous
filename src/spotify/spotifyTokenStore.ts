import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { SpotifyTokens } from './spotifyAuth'

export interface StoredSpotifyAuth extends SpotifyTokens {
  playlistId?: string
}

const spotifyAuthDoc = doc(db, 'sharedState', 'spotifyAuth')

export async function loadSpotifyAuth(): Promise<StoredSpotifyAuth | null> {
  const snapshot = await getDoc(spotifyAuthDoc)
  return snapshot.exists() ? (snapshot.data() as StoredSpotifyAuth) : null
}

export async function saveSpotifyAuth(data: Partial<StoredSpotifyAuth>): Promise<void> {
  await setDoc(spotifyAuthDoc, data, { merge: true })
}
