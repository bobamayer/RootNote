// ─── Chord Intervals ──────────────────────────────────────────────────────────

const CHORD_INTERVALS: Record<string, number[]> = {
  // Major
  '': [0, 4, 7, 12],
  'maj': [0, 4, 7, 12],
  // Minor
  'm': [0, 3, 7, 12],
  'min': [0, 3, 7, 12],
  // Dominant 7th
  '7': [0, 4, 7, 10],
  // Major 7th
  'maj7': [0, 4, 7, 11],
  'M7': [0, 4, 7, 11],
  // Minor 7th
  'm7': [0, 3, 7, 10],
  'min7': [0, 3, 7, 10],
  // Minor major 7th
  'mM7': [0, 3, 7, 11],
  'mmaj7': [0, 3, 7, 11],
  // Suspended
  'sus2': [0, 2, 7, 12],
  'sus4': [0, 5, 7, 12],
  '7sus4': [0, 5, 7, 10],
  '9sus4': [0, 5, 7, 10, 14],
  // Diminished
  'dim': [0, 3, 6, 12],
  'dim7': [0, 3, 6, 9],
  'o': [0, 3, 6, 9],
  'o7': [0, 3, 6, 9],
  // Augmented
  'aug': [0, 4, 8, 12],
  '+': [0, 4, 8, 12],
  'aug7': [0, 4, 8, 10],
  // Add chords
  'add9': [0, 4, 7, 14],
  'add2': [0, 2, 4, 7],
  'add4': [0, 4, 5, 7],
  'madd9': [0, 3, 7, 14],
  'madd4': [0, 3, 5, 7],
  // 6th chords
  '6': [0, 4, 7, 9],
  'm6': [0, 3, 7, 9],
  // 9th chords
  '9': [0, 4, 7, 10, 14],
  'maj9': [0, 4, 7, 11, 14],
  'm9': [0, 3, 7, 10, 14],
  // 11th chords
  '11': [0, 4, 7, 10, 14, 17],
  'maj11': [0, 4, 7, 11, 14, 17],
  'm11': [0, 3, 7, 10, 14, 17],
  // 13th chords
  '13': [0, 4, 7, 10, 14, 17, 21],
  'maj13': [0, 4, 7, 11, 14, 17, 21],
  'm13': [0, 3, 7, 10, 14, 17, 21],
  // Half diminished
  'm7b5': [0, 3, 6, 10],
  'ø': [0, 3, 6, 10],
  'ø7': [0, 3, 6, 10],
  // Power chord
  '5': [0, 7, 12],
  // Altered dominant
  '7b5': [0, 4, 6, 10],
  '7s5': [0, 4, 8, 10],
  '7b9': [0, 4, 7, 10, 13],
  '7s9': [0, 4, 7, 10, 15],
  '7s11': [0, 4, 7, 10, 18],
  'maj7s11': [0, 4, 7, 11, 18],
  'maj7b5': [0, 4, 6, 11],
  // Minor with extensions
  'm6': [0, 3, 7, 9],
}

// ─── Root Note Semitones ──────────────────────────────────────────────────────

const ROOT_SEMITONES: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
}

const C3_FREQ = 130.81

function semitoneToFreq(semitone: number): number {
  return C3_FREQ * Math.pow(2, semitone / 12)
}

// ─── Progressive Fallback Matching ───────────────────────────────────────────
// If a suffix isn't found directly, strip modifiers progressively
// until we find a match or fall back to major

function findIntervals(suffix: string): number[] {
  // Direct match
  if (CHORD_INTERVALS[suffix] !== undefined) return CHORD_INTERVALS[suffix]

  // Normalise # aliases — prompt uses 's' for sharp in some cases
  const normalised = suffix.replace(/s(\d)/g, '#$1')
  if (CHORD_INTERVALS[normalised] !== undefined) return CHORD_INTERVALS[normalised]

  // Strip trailing number: m9 -> m, maj13 -> maj
  const noTrailingNum = suffix.replace(/\d+$/, '')
  if (noTrailingNum !== suffix && CHORD_INTERVALS[noTrailingNum] !== undefined) {
    return CHORD_INTERVALS[noTrailingNum]
  }

  // Strip altered extension: 7b5 -> 7, 7#9 -> 7
  const noAlteration = suffix.replace(/[b#s]\d+$/, '')
  if (noAlteration !== suffix && CHORD_INTERVALS[noAlteration] !== undefined) {
    return CHORD_INTERVALS[noAlteration]
  }

  // Strip from first digit: maj9 -> maj, m11 -> m
  const noDigits = suffix.replace(/\d+.*$/, '')
  if (noDigits !== suffix && CHORD_INTERVALS[noDigits] !== undefined) {
    return CHORD_INTERVALS[noDigits]
  }

  // Strip sus: 7sus4 -> 7
  const noSus = suffix.replace(/sus\d*$/, '')
  if (noSus !== suffix && CHORD_INTERVALS[noSus] !== undefined) {
    return CHORD_INTERVALS[noSus]
  }

  // Strip add: madd9 -> m
  const noAdd = suffix.replace(/add\d*$/, '')
  if (noAdd !== suffix && CHORD_INTERVALS[noAdd] !== undefined) {
    return CHORD_INTERVALS[noAdd]
  }

  // If starts with m treat as minor
  if (suffix.startsWith('m') && CHORD_INTERVALS['m'] !== undefined) {
    return CHORD_INTERVALS['m']
  }

  // Final fallback — plain major
  return CHORD_INTERVALS['']
}

// ─── Chord Parser ─────────────────────────────────────────────────────────────

function parseChordToFreqs(chordName: string): number[] {
  if (!chordName || chordName.length === 0) return []

  // Strip any slash chord bass note e.g. C/E -> C
  const noSlash = chordName.split('/')[0]

  // Strip parentheses e.g. C(add9) -> Cadd9
  const noParens = noSlash.replace(/[()]/g, '')

  let root = ''
  let suffix = ''

  // Try two-char root first: C#, Db, Eb, Bb, F#, Ab, Gb
  if (noParens.length >= 2 && (noParens[1] === '#' || noParens[1] === 'b')) {
    const twoChar = noParens.slice(0, 2)
    if (ROOT_SEMITONES[twoChar] !== undefined) {
      root = twoChar
      suffix = noParens.slice(2)
    }
  }

  // Fall back to single char root
  if (!root) {
    root = noParens.slice(0, 1).toUpperCase()
    suffix = noParens.slice(1)
  }

  const rootSemitone = ROOT_SEMITONES[root]
  if (rootSemitone === undefined) return []

  const intervals = findIntervals(suffix)
  return intervals.map(interval => semitoneToFreq(rootSemitone + interval))
}

// ─── Text Parser ──────────────────────────────────────────────────────────────

function parseChords(text: string): string[] {
  const lines = text.split('\n')
  for (const line of lines) {
    if (line.includes('Chord Names:')) {
      const chordPart = line
        .replace(/\*\*Chord Names:\*\*/gi, '')
        .replace(/Chord Names:/gi, '')
        .replace(/\(repeated.*?\)/gi, '')
        .replace(/\[.*?\]/g, '')
        .trim()
      const chords = chordPart
        .split(/[\s\-–—,|\/\\]+/)
        .map(c => c.trim().replace(/[^A-Za-z0-9#b]/g, ''))
        .filter(c => c.length > 0)
      if (chords.length > 0) return chords
    }
  }
  return []
}

// ─── Browser Detection ────────────────────────────────────────────────────────

function isSafari(): boolean {
  const ua = navigator.userAgent
  return /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua)
}

function isChrome(): boolean {
  const ua = navigator.userAgent
  return /Chrome/.test(ua) || /CriOS/.test(ua)
}

// ─── AudioContext ─────────────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null

function getContext(): AudioContext {
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AC()
  }
  return audioCtx
}

function syncUnlock(ctx: AudioContext) {
  const buf = ctx.createBuffer(1, 1, ctx.sampleRate)
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(ctx.destination)
  src.start(0)
}

// ─── Chord Scheduling ─────────────────────────────────────────────────────────

function scheduleChords(ctx: AudioContext, chords: string[]): number {
  const chordDuration = 1.2
  const noteFadeDuration = 0.8
  const startOffset = 0.15

  chords.forEach((chord, i) => {
    const freqs = parseChordToFreqs(chord)
    if (freqs.length === 0) return

    const chordStart = ctx.currentTime + startOffset + i * chordDuration

    freqs.forEach((freq, ni) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, chordStart)
      const nd = ni * 0.05
      gain.gain.setValueAtTime(0, chordStart + nd)
      gain.gain.linearRampToValueAtTime(0.15, chordStart + nd + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, chordStart + nd + noteFadeDuration)
      osc.start(chordStart + nd)
      osc.stop(chordStart + nd + noteFadeDuration + 0.1)
    })
  })

  return (chords.length * chordDuration + startOffset + 1.5) * 1000
}

// ─── Browser-Specific Play Paths ──────────────────────────────────────────────

function playSafari(chords: string[]): Promise<boolean> {
  const ctx = getContext()
  syncUnlock(ctx)

  const doPlay = (): Promise<boolean> => {
    const duration = scheduleChords(ctx, chords)
    return new Promise(resolve => setTimeout(() => resolve(true), duration))
  }

  if (ctx.state === 'suspended') {
    return ctx.resume().then(doPlay).catch(() => Promise.resolve(false))
  }
  return doPlay()
}

function playChrome(chords: string[]): Promise<boolean> {
  const ctx = getContext()

  const doPlay = (): Promise<boolean> => {
    const duration = scheduleChords(ctx, chords)
    return new Promise(resolve => setTimeout(() => resolve(true), duration))
  }

  return ctx.resume().then(doPlay).catch(() => {
    try { return doPlay() } catch { return Promise.resolve(false) }
  })
}

function playStandard(chords: string[]): Promise<boolean> {
  const ctx = getContext()

  const doPlay = (): Promise<boolean> => {
    const duration = scheduleChords(ctx, chords)
    return new Promise(resolve => setTimeout(() => resolve(true), duration))
  }

  if (ctx.state === 'suspended') {
    return ctx.resume().then(doPlay).catch(() => Promise.resolve(false))
  }
  return doPlay()
}

// ─── Public Hook ──────────────────────────────────────────────────────────────

export function useAudio() {
  function playProgression(text: string): Promise<boolean> {
    const chords = parseChords(text)
    if (chords.length === 0) return Promise.resolve(false)

    try {
      if (isSafari()) return playSafari(chords)
      if (isChrome()) return playChrome(chords)
      return playStandard(chords)
    } catch {
      return Promise.resolve(false)
    }
  }

  return { playProgression }
}
