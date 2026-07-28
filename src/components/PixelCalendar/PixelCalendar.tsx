import { pixelCalendarConfig } from './config'
import { PixelGrid } from './PixelGrid'
import type { RevealOrder } from './revealOrder'
import './PixelCalendar.css'

export interface PixelCalendarProps {
  gridColumns: number
  gridRows: number
  totalPixels: number
  revealedCount: number
  revealStepByCell: number[]
  revealOrderMode: RevealOrder
  onRevealOrderModeChange: (mode: RevealOrder) => void
  onRevealNext: () => void
  onResetToToday: () => void
}

export function PixelCalendar({
  gridColumns,
  gridRows,
  totalPixels,
  revealedCount,
  revealStepByCell,
  revealOrderMode,
  onRevealOrderModeChange,
  onRevealNext,
  onResetToToday,
}: PixelCalendarProps) {
  const { image } = pixelCalendarConfig

  return (
    <div className="pixel-calendar">
      <PixelGrid
        image={image}
        gridColumns={gridColumns}
        gridRows={gridRows}
        totalPixels={totalPixels}
        revealedCount={revealedCount}
        revealStepByCell={revealStepByCell}
      />

      <div className="pixel-calendar__controls">
        <p>
          {revealedCount} / {totalPixels} days revealed
        </p>
        <div className="pixel-calendar__order-toggle" role="group" aria-label="Reveal order">
          <button
            type="button"
            className={revealOrderMode === 'linear' ? 'is-active' : ''}
            onClick={() => onRevealOrderModeChange('linear')}
          >
            Linear
          </button>
          <button
            type="button"
            className={revealOrderMode === 'random' ? 'is-active' : ''}
            onClick={() => onRevealOrderModeChange('random')}
          >
            Random
          </button>
        </div>
        <button type="button" onClick={onRevealNext} disabled={revealedCount >= totalPixels}>
          Reveal next pixel (test)
        </button>
        <button type="button" onClick={onResetToToday}>
          Reset to today
        </button>
      </div>
    </div>
  )
}
