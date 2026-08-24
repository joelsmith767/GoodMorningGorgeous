// The one account that performs the daily reveal ritual.
export const REVEALER_EMAIL = 'hannah.bruere22@gmail.com'

// Fixed reference clock for "is it a new day yet" — always Vancouver,
// regardless of which account is looking at the site.
export const REVEAL_RESET_TIME_ZONE = 'America/Vancouver'

/**
 * Test mode: lets the daily-reveal cycle run starting now, ahead of the real
 * Aug 25, 2026 launch. Set to null to switch back to the real schedule.
 *
 * Live as of Aug 25, 2026 — test period is over, this now follows the real
 * schedule (pixelCalendarConfig.startDate), gated on Vancouver time.
 */
export const TEST_START_DATE: string | null = null
