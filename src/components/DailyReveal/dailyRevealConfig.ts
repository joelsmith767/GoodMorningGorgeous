// The one account that performs the daily reveal ritual. Swapping this for
// Hannah's real address later is just changing this one value.
export const REVEALER_EMAIL = 'hannah@gmail.com'

// Fixed reference clock for "is it a new day yet" — always Vancouver,
// regardless of which account is looking at the site.
export const REVEAL_RESET_TIME_ZONE = 'America/Vancouver'

/**
 * Test mode: lets the daily-reveal cycle run starting now, ahead of the real
 * Aug 25, 2026 launch. Set to null to switch back to the real schedule.
 */
export const TEST_START_DATE: string | null = '2026-07-27'
