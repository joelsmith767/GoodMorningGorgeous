export type RevealOrder = 'linear' | 'random'

// Deterministic PRNG so a given seed always produces the same shuffle —
// the reveal order must stay stable across reloads/days, not re-shuffle each visit.
function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Returns an array where result[step] = grid cell index revealed at that step. */
export function createRevealOrder(totalPixels: number, mode: RevealOrder, seed: number): number[] {
  const order = Array.from({ length: totalPixels }, (_, index) => index)

  if (mode === 'linear') {
    return order
  }

  const random = mulberry32(seed)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
