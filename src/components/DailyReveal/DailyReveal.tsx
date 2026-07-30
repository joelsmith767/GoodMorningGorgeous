import { useEffect, useRef, useState } from 'react'
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
  hasPendingReveal: boolean
  loading: boolean
  onRevealNext: () => void
}

// How long the unravel animation plays before the pixel locks in as revealed
// and the modal returns to the choice screen. Keep in sync with the CSS
// animation duration.
const UNRAVEL_DURATION_MS = 900

export function DailyReveal({
  image,
  gridColumns,
  gridRows,
  totalPixels,
  revealedCount,
  revealStepByCell,
  nextCellIndex,
  hasPendingReveal,
  loading,
  onRevealNext,
}: DailyRevealProps) {
  const [view, setView] = useState<ModalView>('closed')
  const [revealingCellIndex, setRevealingCellIndex] = useState<number | null>(null)
  const hasAutoOpenedRef = useRef(false)

  // Auto-open once per page load when there's a pixel waiting — but don't
  // nag again this session if it's closed without revealing.
  useEffect(() => {
    if (!loading && hasPendingReveal && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true
      setView('choice')
    }
  }, [loading, hasPendingReveal])

  const open = () => setView('choice')

  const close = () => {
    setView('closed')
    setRevealingCellIndex(null)
  }

  const handleReveal = () => {
    if (nextCellIndex === null || !hasPendingReveal) {
      return
    }
    setView('revealing')
    setRevealingCellIndex(nextCellIndex)
    window.setTimeout(() => {
      onRevealNext()
      setRevealingCellIndex(null)
      // Back to the choice screen (not closed) — so song of the day is
      // still reachable after revealing, instead of the whole thing ending.
      setView('choice')
    }, UNRAVEL_DURATION_MS)
  }

  return (
    <>
      <button type="button" className="daily-reveal-trigger" onClick={open}>
        Open Today
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
                <button
                  type="button"
                  className={hasPendingReveal ? '' : 'is-done'}
                  onClick={handleReveal}
                  disabled={!hasPendingReveal}
                >
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

            {view === 'song' && (
              <div className="daily-reveal-modal__song">
                <button
                  type="button"
                  className="daily-reveal-modal__back"
                  onClick={() => setView('choice')}
                >
                  ← Back
                </button>
                <SongOfTheDay />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
