import type { CSSProperties } from 'react'
import './PixelGrid.css'

export interface PixelGridProps {
  image: string
  gridColumns: number
  gridRows: number
  totalPixels: number
  revealedCount: number
  revealStepByCell: number[]
  /** Plays the unravel animation on this one cell (used by the daily reveal modal). */
  highlightCellIndex?: number | null
  /** Caps frame width against viewport height too, so it never overflows short screens. */
  maxWidthVh?: number
}

export function PixelGrid({
  image,
  gridColumns,
  gridRows,
  totalPixels,
  revealedCount,
  revealStepByCell,
  highlightCellIndex = null,
  maxWidthVh = 60,
}: PixelGridProps) {
  const frameStyle: CSSProperties = {
    aspectRatio: `${gridColumns} / ${gridRows}`,
    width: `min(90vw, 900px, ${((gridColumns / gridRows) * maxWidthVh).toFixed(2)}vh)`,
  }

  return (
    <div className="pixel-grid-frame" style={frameStyle}>
      <img src={image} alt="" className="pixel-grid-frame__photo" />
      <div
        className="pixel-grid-frame__grid"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        }}
      >
        {Array.from({ length: totalPixels }, (_, index) => {
          const isRevealed = revealStepByCell[index] < revealedCount
          const isUnraveling = index === highlightCellIndex

          return (
            <div
              key={index}
              className={[
                'pixel-grid-frame__cell',
                isRevealed ? 'is-revealed' : 'is-locked',
                isUnraveling ? 'is-unraveling' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          )
        })}
      </div>
    </div>
  )
}
