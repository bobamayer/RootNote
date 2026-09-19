// The Worker <-> frontend contract.
//
// The Worker (worker/index.ts) builds a matching JSON schema and forces
// Claude to call a tool with exactly this shape, so this is real structured
// data — not text the frontend has to scrape with regex.
//
// These interfaces are duplicated by hand in worker/index.ts because the
// Worker and the Vite app are separate TypeScript projects with no shared
// package between them. Keeping two hand-synced copies of one contract is
// an honest tradeoff for now — if the shapes ever drift, that's the sign a
// later phase should pull them into a shared `types` package both sides
// import. Until then: change one, change the other, in the same commit.

export interface Chord {
  /** Full chord symbol exactly as notated, e.g. "F#m7", "Cadd9", "Bbmaj7". */
  name: string
  /** Root note only, with # or b if needed, e.g. "F#", "Bb", "C". */
  root: string
  /** Everything after the root, e.g. "m7", "add9". Empty string = major triad. */
  quality: string
}

export interface ProgressionSection {
  /** Section title, e.g. "Main Progression" or "Variation". */
  label: string
  /** Exactly one chord per bar, in order. */
  chords: Chord[]
  /** Instrument-specific tab, as plain text with newlines. Rendered verbatim, never parsed. */
  tab: string
  /** "Why This Works" for the main progression, "The Twist" for the variation. */
  explanation: string
}

export interface ProgressionResponse {
  main: ProgressionSection
  variation: ProgressionSection
}
