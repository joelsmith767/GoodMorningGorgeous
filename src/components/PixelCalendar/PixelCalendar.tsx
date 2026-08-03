import { pixelCalendarConfig } from './config'
import { PixelGrid } from './PixelGrid'
import './PixelCalendar.css'

export interface PixelCalendarProps {
  gridColumns: number
  gridRows: number
  totalPixels: number
  revealedCount: number
  revealStepByCell: number[]
  /** Only passed for Joel's account — lets him nudge the reveal forward for testing. */
  onRevealNext?: () => void
  onResetToToday?: () => void
}

export function PixelCalendar({
  gridColumns,
  gridRows,
  totalPixels,
  revealedCount,
  revealStepByCell,
  onRevealNext,
  onResetToToday,
}: PixelCalendarProps) {
  const { image } = pixelCalendarConfig

  return (
    <div className="pixel-calendar">
      <div className="pixel-calendar__frame">
        <PixelGrid
          image={image}
          gridColumns={gridColumns}
          gridRows={gridRows}
          totalPixels={totalPixels}
          revealedCount={revealedCount}
          revealStepByCell={revealStepByCell}
        />
      </div>

      <div className="pixel-calendar__controls">
        <p>
          {revealedCount} / {totalPixels} days revealed · {Math.round((revealedCount / totalPixels) * 100)}%
        </p>
      </div>

      {onRevealNext && onResetToToday && (
        <div className="pixel-calendar__test-controls">
          <button type="button" onClick={onRevealNext} disabled={revealedCount >= totalPixels}>
            Reveal next pixel (test)
          </button>
          <button type="button" onClick={onResetToToday}>
            Reset to today
          </button>
        </div>
      )}
    </div>
  )
}
