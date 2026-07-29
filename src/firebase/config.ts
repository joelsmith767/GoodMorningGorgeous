import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase's client-side config values are not secret — they identify the
// project to Google's servers, but actual access is controlled by Firebase
// Auth + security rules, not by hiding this object. Safe to commit.
const firebaseConfig = {
  apiKey: 'AIzaSyBVfghnuKe89ATxCtyVcDVrivQ3-sBLC6s',
  authDomain: 'hannahsgoingawaypresent.firebaseapp.com',
  projectId: 'hannahsgoingawaypresent',
  storageBucket: 'hannahsgoingawaypresent.firebasestorage.app',
  messagingSenderId: '131228601988',
  appId: '1:131228601988:web:d5a1d40ca40636df117cd1',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
