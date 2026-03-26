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

const CHORD_NOTES: Record<string, string[]> = {
  'C': ['C3', 'E3', 'G3', 'C4'], 'G': ['G2', 'B2', 'D3', 'G3'],
  'D': ['D3', 'F#3', 'A3', 'D4'], 'A': ['A2', 'C#3', 'E3', 'A3'],
  'E': ['E2', 'G#2', 'B2', 'E3'], 'F': ['F3', 'A3', 'C4', 'F4'],
  'Bb': ['Bb2', 'D3', 'F3', 'Bb3'], 'Eb': ['Eb3', 'G3', 'Bb3', 'Eb4'],
  'Ab': ['Ab2', 'C3', 'Eb3', 'Ab3'], 'Db': ['Db3', 'F3', 'Ab3', 'Db4'],
  'Gb': ['Gb2', 'Bb2', 'Db3', 'Gb3'], 'B': ['B2', 'D#3', 'F#3', 'B3'],
  'Am': ['A2', 'C3', 'E3', 'A3'], 'Em': ['E2', 'G2', 'B2', 'E3'],
  'Dm': ['D3', 'F3', 'A3', 'D4'], 'Bm': ['B2', 'D3', 'F#3', 'B3'],
  'Gm': ['G2', 'Bb2', 'D3', 'G3'], 'Cm': ['C3', 'Eb3', 'G3', 'C4'],
  'Fm': ['F3', 'Ab3', 'C4', 'F4'], 'F#m': ['F#3', 'A3', 'C#4', 'F#4'],
  'C#m': ['C#3', 'E3', 'G#3', 'C#4'], 'G#m': ['G#2', 'B2', 'D#3', 'G#3'],
  'Bbm': ['Bb2', 'Db3', 'F3', 'Bb3'], 'Ebm': ['Eb3', 'Gb3', 'Bb3', 'Eb4'],
  'G7': ['G2', 'B2', 'D3', 'F3'], 'C7': ['C3', 'E3', 'G3', 'Bb3'],
  'D7': ['D3', 'F#3', 'A3', 'C4'], 'A7': ['A2', 'C#3', 'E3', 'G3'],
  'E7': ['E2', 'G#2', 'B2', 'D3'], 'F7': ['F3', 'A3', 'C4', 'Eb4'],
  'B7': ['B2', 'D#3', 'F#3', 'A3'], 'Bb7': ['Bb2', 'D3', 'F3', 'Ab3'],
  'Cmaj7': ['C3', 'E3', 'G3', 'B3'], 'Gmaj7': ['G2', 'B2', 'D3', 'F#3'],
  'Dmaj7': ['D3', 'F#3', 'A3', 'C#4'], 'Amaj7': ['A2', 'C#3', 'E3', 'G#3'],
  'Fmaj7': ['F3', 'A3', 'C4', 'E4'], 'Bbmaj7': ['Bb2', 'D3', 'F3', 'A3'],
  'Emaj7': ['E2', 'G#2', 'B2', 'D#3'], 'Bmaj7': ['B2', 'D#3', 'F#3', 'A#3'],
  'Am7': ['A2', 'C3', 'E3', 'G3'], 'Em7': ['E2', 'G2', 'B2', 'D3'],
  'Dm7': ['D3', 'F3', 'A3', 'C4'], 'Bm7': ['B2', 'D3', 'F#3', 'A3'],
  'Gm7': ['G2', 'Bb2', 'D3', 'F3'], 'Cm7': ['C3', 'Eb3', 'G3', 'Bb3'],
  'F#m7': ['F#3', 'A3', 'C#4', 'E4'], 'C#m7': ['C#3', 'E3', 'G#3', 'B3'],
  'Asus2': ['A2', 'B2', 'E3', 'A3'], 'Dsus2': ['D3', 'E3', 'A3', 'D4'],
  'Esus2': ['E2', 'F#2', 'B2', 'E3'], 'Gsus2': ['G2', 'A2', 'D3', 'G3'],
  'Asus4': ['A2', 'D3', 'E3', 'A3'], 'Dsus4': ['D3', 'G3', 'A3', 'D4'],
  'Esus4': ['E2', 'A2', 'B2', 'E3'], 'Gsus4': ['G2', 'C3', 'D3', 'G3'],
  'Csus2': ['C3', 'D3', 'G3', 'C4'], 'Csus4': ['C3', 'F3', 'G3', 'C4'],
  'Bdim': ['B2', 'D3', 'F3', 'B3'], 'Cdim': ['C3', 'Eb3', 'Gb3', 'C4'],
  'Ddim': ['D3', 'F3', 'Ab3', 'D4'], 'Edim': ['E3', 'G3', 'Bb3', 'E4'],
  'Caug': ['C3', 'E3', 'G#3', 'C4'], 'Gaug': ['G2', 'B2', 'D#3', 'G3'],
  'Daug': ['D3', 'F#3', 'A#3', 'D4'], 'Eaug': ['E2', 'G#2', 'C3', 'E3'],
  'Fadd9': ['F3', 'A3', 'C4', 'G4'], 'Cadd9': ['C3', 'E3', 'G3', 'D4'],
  'Gadd9': ['G2', 'B2', 'D3', 'A3'], 'Dadd9': ['D3', 'F#3', 'A3', 'E4'],
}

function parseChords(text: string): string[] {
  const lines = text.split('\n')
  for (const line of lines) {
    if (line.includes('Chord Names:')) {
      const chordPart = line
        .replace(/\*\*Chord Names:\*\*/, '')
        .replace(/Chord Names:/, '')
        .trim()
      const chords = chordPart
        .split(/[\s\-–—,|]+/)
        .map(c => c.trim().replace(/[^A-Za-z0-9#b]/g, ''))
        .filter(c => c.length > 0 && CHORD_NOTES[c])
      if (chords.length > 0) return chords
    }
  }
  return []
}

// Module-level context — one per app lifetime
let audioCtx: AudioContext | null = null
let unlocked = false

function getContext(): AudioContext {
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AC()
    unlocked = false
  }
  return audioCtx
}

// Plays a zero-gain buffer — must be called synchronously in tap handler
function syncUnlock(ctx: AudioContext) {
  if (unlocked) return
  const buf = ctx.createBuffer(1, 1, ctx.sampleRate)
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(ctx.destination)
  src.start(0)
  unlocked = true
}

function playChords(ctx: AudioContext, chords: string[]): number {
  const chordDuration = 1.2
  const noteFadeDuration = 0.8
  const startOffset = 0.1

  chords.forEach((chord, i) => {
    const notes = CHORD_NOTES[chord]
    if (!notes) return
    const chordStart = ctx.currentTime + startOffset + i * chordDuration

    notes.forEach((note, ni) => {
      const freq = NOTE_FREQUENCIES[note]
      if (!freq) return
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
  // This must be called directly from a click handler — no async before it
  function playProgression(text: string): Promise<boolean> {
    const chords = parseChords(text)
    if (chords.length === 0) return Promise.resolve(false)

    // All of this runs synchronously within the tap gesture
    const ctx = getContext()
    syncUnlock(ctx) // silent buffer — keeps iOS unlocked

    if (ctx.state === 'suspended') {
      // resume() is a Promise but iOS trusts it because syncUnlock already ran
      return ctx.resume().then(() => {
        const duration = playChords(ctx, chords)
        return new Promise(resolve => setTimeout(() => resolve(true), duration))
      }).catch(() => Promise.resolve(false))
    }

    // Context already running — play immediately
    const duration = playChords(ctx, chords)
    return new Promise(resolve => setTimeout(() => resolve(true), duration))
  }

  return { playProgression }
}
