import { useState } from 'react'
import { getDayKeyInZone } from '../../lib/dayKey'
import { REVEAL_RESET_TIME_ZONE } from '../DailyReveal/dailyRevealConfig'
import { FAREWELL_MESSAGE_DATE, FAREWELL_MESSAGE } from './farewellMessageConfig'
import './FarewellMessage.css'

export function FarewellMessage() {
  const [open, setOpen] = useState(false)

  const todayKey = getDayKeyInZone(REVEAL_RESET_TIME_ZONE)
  if (todayKey !== FAREWELL_MESSAGE_DATE) {
    return null
  }

  return (
    <>
      <button type="button" className="farewell-message-trigger" onClick={() => setOpen(true)}>
        Dear Hannah
      </button>

      {open && (
        <div className="farewell-message-overlay" role="dialog" aria-modal="true">
          <div className="farewell-message-modal">
            <button
              type="button"
              className="farewell-message-modal__close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <p className="farewell-message-modal__text">{FAREWELL_MESSAGE}</p>
          </div>
        </div>
      )}
    </>
  )
}
