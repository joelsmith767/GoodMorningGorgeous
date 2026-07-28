import { createSeededOrder } from '../../lib/seededShuffle'

export type RevealOrder = 'linear' | 'random'

/** Returns an array where result[step] = grid cell index revealed at that step. */
export function createRevealOrder(totalPixels: number, mode: RevealOrder, seed: number): number[] {
  if (mode === 'linear') {
    return Array.from({ length: totalPixels }, (_, index) => index)
  }

  return createSeededOrder(totalPixels, seed)
}
