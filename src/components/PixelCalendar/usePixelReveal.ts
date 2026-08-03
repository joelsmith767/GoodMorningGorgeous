import { useEffect, useMemo, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { pixelCalendarConfig } from './config'
import { getTotalDays } from './dateUtils'
import { createRevealOrder } from './revealOrder'
import { getDaysElapsedInZone } from '../../lib/dayKey'
import { REVEAL_RESET_TIME_ZONE, TEST_START_DATE } from '../DailyReveal/dailyRevealConfig'

const sharedStateDoc = doc(db, 'sharedState', 'pixelReveal')

/**
 * Centralizes all pixel-reveal state so it can be shared between the grid
 * display (PixelCalendar) and the daily reveal modal. revealedCount lives in
 * Firestore (one shared document) rather than local state, since it's a
 * single shared picture both accounts view — not something to recompute
 * automatically from the date on every load.
 */
export function usePixelReveal() {
  const { endDate, gridColumns, gridRows, revealOrder: revealOrderMode, randomSeed } =
    pixelCalendarConfig
  const effectiveStartDate = TEST_START_DATE ?? pixelCalendarConfig.startDate

  const totalPixels = useMemo(
    () => getTotalDays(pixelCalendarConfig.startDate, endDate),
    [endDate],
  )

  // revealOrder[step] = cell index revealed at that step; revealStepByCell is the inverse.
  const { revealOrder, revealStepByCell } = useMemo(() => {
    const order = createRevealOrder(totalPixels, revealOrderMode, randomSeed)
    const steps = new Array<number>(totalPixels)
    order.forEach((cellIndex, step) => {
      steps[cellIndex] = step
    })
    return { revealOrder: order, revealStepByCell: steps }
  }, [totalPixels, revealOrderMode, randomSeed])

  const daysElapsedToday = useMemo(
    () =>
      Math.min(
        Math.max(getDaysElapsedInZone(effectiveStartDate, REVEAL_RESET_TIME_ZONE), 0),
        totalPixels,
      ),
    [effectiveStartDate, totalPixels],
  )

  const [revealedCount, setRevealedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getDoc(sharedStateDoc)
      .then((snapshot) => {
        if (cancelled) return
        const storedCount = snapshot.exists() ? (snapshot.data().revealedCount ?? 0) : 0
        setRevealedCount(Math.min(storedCount, totalPixels))
      })
      .catch(() => {
        // Leave revealedCount at its current value; still stop loading below.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [totalPixels])

  const revealNext = async () => {
    const next = Math.min(revealedCount + 1, totalPixels)
    setRevealedCount(next)
    await setDoc(sharedStateDoc, { revealedCount: next }, { merge: true })
  }

  const resetToToday = async () => {
    setRevealedCount(daysElapsedToday)
    await setDoc(sharedStateDoc, { revealedCount: daysElapsedToday }, { merge: true })
  }

  const nextCellIndex = revealedCount < totalPixels ? revealOrder[revealedCount] : null
  const hasPendingReveal = revealedCount < daysElapsedToday

  return {
    gridColumns,
    gridRows,
    totalPixels,
    revealedCount,
    revealStepByCell,
    revealNext,
    resetToToday,
    nextCellIndex,
    hasPendingReveal,
    loading,
  }
}
