// Deterministic PRNG so a given seed always produces the same shuffle —
// used anywhere we need a "random but stable" order (pixel reveal order,
// song-of-the-day rotation) that doesn't change on every reload.
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

/** Returns a shuffled [0, length) index order, stable for a given seed. */
export function createSeededOrder(length: number, seed: number): number[] {
  const order = Array.from({ length }, (_, index) => index)
  const random = mulberry32(seed)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
