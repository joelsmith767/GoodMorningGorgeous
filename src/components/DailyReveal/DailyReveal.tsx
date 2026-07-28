import { useState } from 'react'
import { PixelGrid } from '../PixelCalendar/PixelGrid'
import { SongOfTheDay } from '../SongOfTheDay/SongOfTheDay'
import './DailyReveal.css'

type ModalView = 'closed' | 'choice' | 'revealing' | 'song'

export interface DailyRevealProps {
  image: string
  gridColumns: number
  gridRows: number
  totalPixels: number
  revealedCount: number
  revealStepByCell: number[]
  nextCellIndex: number | null
  onRevealNext: () => void
}

// How long the unravel animation plays before the pixel actually locks in as
// revealed and the modal closes. Keep in sync with the CSS animation duration.
const UNRAVEL_DURATION_MS = 900

export function DailyReveal({
  image,
  gridColumns,
  gridRows,
  totalPixels,
  revealedCount,
  revealStepByCell,
  nextCellIndex,
  onRevealNext,
}: DailyRevealProps) {
  const [view, setView] = useState<ModalView>('closed')
  const [revealingCellIndex, setRevealingCellIndex] = useState<number | null>(null)

  const open = () => setView('choice')

  const close = () => {
    setView('closed')
    setRevealingCellIndex(null)
  }

  const handleReveal = () => {
    if (nextCellIndex === null) {
      return
    }
    setView('revealing')
    setRevealingCellIndex(nextCellIndex)
    window.setTimeout(() => {
      onRevealNext()
      close()
    }, UNRAVEL_DURATION_MS)
  }

  return (
    <>
      <button type="button" className="daily-reveal-trigger" onClick={open}>
        Today
      </button>

      {view !== 'closed' && (
        <div className="daily-reveal-overlay" role="dialog" aria-modal="true">
          <div className="daily-reveal-modal">
            {view !== 'revealing' && (
              <button
                type="button"
                className="daily-reveal-modal__close"
                onClick={close}
                aria-label="Close"
              >
                ×
              </button>
            )}

            {view === 'choice' && (
              <div className="daily-reveal-modal__choice">
                <button type="button" onClick={handleReveal} disabled={nextCellIndex === null}>
                  Reveal pixel
                </button>
                <button type="button" onClick={() => setView('song')}>
                  Song of the day
                </button>
              </div>
            )}

            {view === 'revealing' && (
              <PixelGrid
                image={image}
                gridColumns={gridColumns}
                gridRows={gridRows}
                totalPixels={totalPixels}
                revealedCount={revealedCount}
                revealStepByCell={revealStepByCell}
                highlightCellIndex={revealingCellIndex}
                maxWidthVh={75}
              />
            )}

            {view === 'song' && <SongOfTheDay />}
          </div>
        </div>
      )}
    </>
  )
}
