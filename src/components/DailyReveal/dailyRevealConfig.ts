// The one account that performs the daily reveal ritual. Mode-aware so the
// staging environment (its own separate Firebase project/users) can exercise
// the revealer view via a disposable test account instead of Hannah's real
// email — update the staging value to match whatever test account you create
// in the staging Firebase project's Auth console.
const revealerEmailByMode: Record<string, string> = {
  production: 'hannah.bruere22@gmail.com',
  staging: 'hannah-test@gmail.com',
}
export const REVEALER_EMAIL = revealerEmailByMode[import.meta.env.MODE] ?? revealerEmailByMode.production

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
