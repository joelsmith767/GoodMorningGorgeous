import { useMemo, useState } from 'react'
import { pixelCalendarConfig } from './config'
import { getDaysElapsed, getTotalDays } from './dateUtils'
import { createRevealOrder, type RevealOrder } from './revealOrder'

/**
 * Centralizes all pixel-reveal state so it can be shared between the grid
 * display (PixelCalendar) and the daily reveal modal, which both need the
 * same revealedCount/order rather than maintaining separate copies.
 */
export function usePixelReveal() {
  const { startDate, endDate, gridColumns, gridRows, randomSeed } = pixelCalendarConfig

  const totalPixels = useMemo(() => getTotalDays(startDate, endDate), [startDate, endDate])

  const [revealOrderMode, setRevealOrderMode] = useState<RevealOrder>(
    pixelCalendarConfig.revealOrder,
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
    () => Math.min(Math.max(getDaysElapsed(startDate), 0), totalPixels),
    [startDate, totalPixels],
  )

  const [revealedCount, setRevealedCount] = useState(daysElapsedToday)

  const revealNext = () => {
    setRevealedCount((count) => Math.min(count + 1, totalPixels))
  }

  const resetToToday = () => {
    setRevealedCount(daysElapsedToday)
  }

  const nextCellIndex = revealedCount < totalPixels ? revealOrder[revealedCount] : null

  return {
    gridColumns,
    gridRows,
    totalPixels,
    revealedCount,
    revealStepByCell,
    revealOrderMode,
    setRevealOrderMode,
    revealNext,
    resetToToday,
    nextCellIndex,
  }
}
