import type { RevealOrder } from './revealOrder'

export interface PixelCalendarConfig {
  startDate: string
  endDate: string
  image: string
  gridColumns: number
  gridRows: number
  /** 'linear' reveals top-left to bottom-right in date order; 'random' shuffles the reveal order. */
  revealOrder: RevealOrder
  /** Only used when revealOrder is 'random'. Change this to get a different (but still stable) shuffle. */
  randomSeed: number
}

export const pixelCalendarConfig: PixelCalendarConfig = {
  startDate: '2026-08-25',
  endDate: '2027-05-27',
  image: '/images/placeholder.svg',
  gridColumns: 23,
  gridRows: 12,
  revealOrder: 'linear',
  randomSeed: 276,
}
