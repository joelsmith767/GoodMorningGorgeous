import { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteField, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import type { CalendarOwner } from '../../cities'

/**
 * One Firestore doc per owner (sharedState/calendar-hannah, calendar-joel)
 * so each person's notes can be written without touching the other's data.
 */
export function useCityCalendar(owner: CalendarOwner) {
  const docRef = useMemo(() => doc(db, 'sharedState', `calendar-${owner}`), [owner])
  const [entries, setEntries] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getDoc(docRef).then((snapshot) => {
      if (cancelled) return
      setEntries(snapshot.exists() ? (snapshot.data().entries ?? {}) : {})
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [docRef])

  const saveEntry = useCallback(
    async (dayKey: string, text: string) => {
      const trimmed = text.trim()
      setEntries((prev) => {
        const next = { ...prev }
        if (trimmed) next[dayKey] = trimmed
        else delete next[dayKey]
        return next
      })
      await setDoc(docRef, { entries: { [dayKey]: trimmed || deleteField() } }, { merge: true })
    },
    [docRef],
  )

  return { entries, loading, saveEntry }
}
