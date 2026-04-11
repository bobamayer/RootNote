const NOTE_FREQUENCIES: Record<string, number> = {
  'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78,
  'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83,
  'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56,
  'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65,
  'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
  'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25,
  'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61,
  'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
}

// Semitone intervals for chord types
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
  // Diminished
  'dim': [0, 3, 6, 12],
  'dim7': [0, 3, 6, 9],
  'o': [0, 3, 6, 9],
  // Augmented
  'aug': [0, 4, 8, 12],
  '+': [0, 4, 8, 12],
  // Add chords
  'add9': [0, 4, 7, 14],
  'add2': [0, 2, 4, 7],
  'madd9': [0, 3, 7, 14],
  // 6th chords
  '6': [0, 4, 7, 9],
  'm6': [0, 3, 7, 9],
  // 9th chords
  '9': [0, 4, 7, 10, 14],
  'maj9': [0, 4, 7, 11, 14],
  'm9': [0, 3, 7, 10, 14],
  // 11th
  '11': [0, 4, 7, 10, 14, 17],
  // Half diminished
  'm7b5': [0, 3, 6, 10],
  'ø': [0, 3, 6, 10],
  // Power chord
  '5': [0, 7, 12],
}

// Root note to semitone from C
const ROOT_SEMITONES: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
}

// Base frequency for C3
const C3_FREQ = 130.81

function semitoneToFreq(semitone: number): number {
  return C3_FREQ * Math.pow(2, semitone / 12)
}

function parseChordToFreqs(chordName: string): number[] {
  if (!chordName || chordName.length === 0) return []

  // Parse root note (handle sharps and flats)
  let root = ''
  let suffix = ''

  if (chordName.length >= 2 && (chordName[1] === '#' || chordName[1] === 'b')) {
    root = chordName.slice(0, 2)
    suffix = chordName.slice(2)
  } else {
    root = chordName.slice(0, 1)
    suffix = chordName.slice(1)
  }

  // Handle 'Db', 'Eb', 'Ab', 'Bb', 'Gb' — two char roots
  if (chordName.length >= 2 && chordName[1] === 'b' && ROOT_SEMITONES[chordName.slice(0, 2)] !== undefined) {
    root = chordName.slice(0, 2)
    suffix = chordName.slice(2)
  }

  const rootSemitone = ROOT_SEMITONES[root]
  if (rootSemitone === undefined) return []

  // Find matching interval pattern
  const intervals = CHORD_INTERVALS[suffix] ?? CHORD_INTERVALS['']

  // Build frequencies — spread across octave 3
  return intervals.map(interval => {
    const semitone = rootSemitone + interval
    return semitoneToFreq(semitone)
  })
}

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

let audioCtx: AudioContext | null = null

function getOrCreateContext(): AudioContext {
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

export function useAudio() {
  function playProgression(text: string): Promise<boolean> {
    const chords = parseChords(text)
    if (chords.length === 0) return Promise.resolve(false)

    const ctx = getOrCreateContext()
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

  return { playProgression }
}
