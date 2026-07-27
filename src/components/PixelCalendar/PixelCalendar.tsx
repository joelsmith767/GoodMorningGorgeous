import { useMemo, useState } from 'react'
import { pixelCalendarConfig } from './config'
import { getDaysElapsed, getTotalDays } from './dateUtils'
import { createRevealOrder, type RevealOrder } from './revealOrder'
import './PixelCalendar.css'

export function PixelCalendar() {
  const { startDate, endDate, image, gridColumns, gridRows, randomSeed } = pixelCalendarConfig

  const [revealOrderMode, setRevealOrderMode] = useState<RevealOrder>(
    pixelCalendarConfig.revealOrder,
  )

  const totalPixels = useMemo(
    () => getTotalDays(startDate, endDate),
    [startDate, endDate],
  )

  // revealStepByCell[cellIndex] = which day (0-indexed) unlocks that cell
  const revealStepByCell = useMemo(() => {
    const order = createRevealOrder(totalPixels, revealOrderMode, randomSeed)
    const steps = new Array<number>(totalPixels)
    order.forEach((cellIndex, step) => {
      steps[cellIndex] = step
    })
    return steps
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

  return (
    <div className="pixel-calendar">
      <div
        className="pixel-calendar__frame"
        style={{ aspectRatio: `${gridColumns} / ${gridRows}` }}
      >
        <img src={image} alt="" className="pixel-calendar__photo" />
        <div
          className="pixel-calendar__grid"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          }}
        >
          {Array.from({ length: totalPixels }, (_, index) => {
            const isRevealed = revealStepByCell[index] < revealedCount

            return (
              <div
                key={index}
                className={`pixel-calendar__cell ${isRevealed ? 'is-revealed' : 'is-locked'}`}
              />
            )
          })}
        </div>
      </div>

      <div className="pixel-calendar__controls">
        <p>
          {revealedCount} / {totalPixels} days revealed
        </p>
        <div className="pixel-calendar__order-toggle" role="group" aria-label="Reveal order">
          <button
            type="button"
            className={revealOrderMode === 'linear' ? 'is-active' : ''}
            onClick={() => setRevealOrderMode('linear')}
          >
            Linear
          </button>
          <button
            type="button"
            className={revealOrderMode === 'random' ? 'is-active' : ''}
            onClick={() => setRevealOrderMode('random')}
          >
            Random
          </button>
        </div>
        <button type="button" onClick={revealNext} disabled={revealedCount >= totalPixels}>
          Reveal next pixel (test)
        </button>
        <button type="button" onClick={resetToToday}>
          Reset to today
        </button>
      </div>
    </div>
  )
}
