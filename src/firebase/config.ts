import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase's client-side config values are not secret — they identify the
// project to Google's servers, but actual access is controlled by Firebase
// Auth + security rules, not by hiding this object. Safe to commit.
const prodConfig = {
  apiKey: 'AIzaSyBVfghnuKe89ATxCtyVcDVrivQ3-sBLC6s',
  authDomain: 'hannahsgoingawaypresent.firebaseapp.com',
  projectId: 'hannahsgoingawaypresent',
  storageBucket: 'hannahsgoingawaypresent.firebasestorage.app',
  messagingSenderId: '131228601988',
  appId: '1:131228601988:web:d5a1d40ca40636df117cd1',
}

// Separate Firebase project for the staging/UAT deploy — its own Auth users
// and Firestore, isolated from real shared progress in prodConfig.
const stagingConfig = {
  apiKey: 'AIzaSyBUkRNSdVrCEhN82-2KqkV6vmbf2Ju0GcE',
  authDomain: 'goodmorninggorgeous-staging.firebaseapp.com',
  projectId: 'goodmorninggorgeous-staging',
  storageBucket: 'goodmorninggorgeous-staging.firebasestorage.app',
  messagingSenderId: '699661780775',
  appId: '1:699661780775:web:e339ab8209559e574d0b02',
}

const firebaseConfig = import.meta.env.MODE === 'staging' ? stagingConfig : prodConfig

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
