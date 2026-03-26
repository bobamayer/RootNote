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
  // Major chords
  'C': ['C3', 'E3', 'G3', 'C4'], 'G': ['G2', 'B2', 'D3', 'G3'],
  'D': ['D3', 'F#3', 'A3', 'D4'], 'A': ['A2', 'C#3', 'E3', 'A3'],
  'E': ['E2', 'G#2', 'B2', 'E3'], 'F': ['F3', 'A3', 'C4', 'F4'],
  'Bb': ['Bb2', 'D3', 'F3', 'Bb3'], 'Eb': ['Eb3', 'G3', 'Bb3', 'Eb4'],
  'Ab': ['Ab2', 'C3', 'Eb3', 'Ab3'], 'Db': ['Db3', 'F3', 'Ab3', 'Db4'],
  'Gb': ['Gb2', 'Bb2', 'Db3', 'Gb3'], 'B': ['B2', 'D#3', 'F#3', 'B3'],
  // Minor chords
  'Am': ['A2', 'C3', 'E3', 'A3'], 'Em': ['E2', 'G2', 'B2', 'E3'],
  'Dm': ['D3', 'F3', 'A3', 'D4'], 'Bm': ['B2', 'D3', 'F#3', 'B3'],
  'Gm': ['G2', 'Bb2', 'D3', 'G3'], 'Cm': ['C3', 'Eb3', 'G3', 'C4'],
  'Fm': ['F3', 'Ab3', 'C4', 'F4'], 'F#m': ['F#3', 'A3', 'C#4', 'F#4'],
  'C#m': ['C#3', 'E3', 'G#3', 'C#4'], 'G#m': ['G#2', 'B2', 'D#3', 'G#3'],
  'Bbm': ['Bb2', 'Db3', 'F3', 'Bb3'], 'Ebm': ['Eb3', 'Gb3', 'Bb3', 'Eb4'],
  // 7th chords
  'G7': ['G2', 'B2', 'D3', 'F3'], 'C7': ['C3', 'E3', 'G3', 'Bb3'],
  'D7': ['D3', 'F#3', 'A3', 'C4'], 'A7': ['A2', 'C#3', 'E3', 'G3'],
  'E7': ['E2', 'G#2', 'B2', 'D3'], 'F7': ['F3', 'A3', 'C4', 'Eb4'],
  'B7': ['B2', 'D#3', 'F#3', 'A3'], 'Bb7': ['Bb2', 'D3', 'F3', 'Ab3'],
  // Major 7th
  'Cmaj7': ['C3', 'E3', 'G3', 'B3'], 'Gmaj7': ['G2', 'B2', 'D3', 'F#3'],
  'Dmaj7': ['D3', 'F#3', 'A3', 'C#4'], 'Amaj7': ['A2', 'C#3', 'E3', 'G#3'],
  'Fmaj7': ['F3', 'A3', 'C4', 'E4'], 'Bbmaj7': ['Bb2', 'D3', 'F3', 'A3'],
  // Minor 7th
  'Am7': ['A2', 'C3', 'E3', 'G3'], 'Em7': ['E2', 'G2', 'B2', 'D3'],
  'Dm7': ['D3', 'F3', 'A3', 'C4'], 'Bm7': ['B2', 'D3', 'F#3', 'A3'],
  'Gm7': ['G2', 'Bb2', 'D3', 'F3'], 'Cm7': ['C3', 'Eb3', 'G3', 'Bb3'],
  // Sus chords
  'Asus2': ['A2', 'B2', 'E3', 'A3'], 'Dsus2': ['D3', 'E3', 'A3', 'D4'],
  'Asus4': ['A2', 'D3', 'E3', 'A3'], 'Dsus4': ['D3', 'G3', 'A3', 'D4'],
  'Esus4': ['E2', 'A2', 'B2', 'E3'], 'Gsus4': ['G2', 'C3', 'D3', 'G3'],
  // Diminished / Augmented
  'Bdim': ['B2', 'D3', 'F3', 'B3'], 'Cdim': ['C3', 'Eb3', 'Gb3', 'C4'],
  'Caug': ['C3', 'E3', 'G#3', 'C4'], 'Gaug': ['G2', 'B2', 'D#3', 'G3'],
}

function parseChords(text: string): string[] {
  const chordLineMatch = text.match(/\*\*Chord Names:\*\*\s*([^\n]+)/)
  if (!chordLineMatch) return []
  const chordLine = chordLineMatch[1]
  return chordLine.split(/[\s\-–—,|]+/).map(c => c.trim()).filter(c => c.length > 0 && CHORD_NOTES[c])
}

export function useAudio() {
  async function playProgression(text: string) {
    const chords = parseChords(text)
    if (chords.length === 0) return false

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const chordDuration = 1.2
    const noteFadeDuration = 0.8

    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i]
      const notes = CHORD_NOTES[chord]
      if (!notes) continue
      const startTime = ctx.currentTime + i * chordDuration

      notes.forEach((note, noteIndex) => {
        const freq = NOTE_FREQUENCIES[note]
        if (!freq) return

        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()

        osc.connect(gainNode)
        gainNode.connect(ctx.destination)

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, startTime)

        const noteDelay = noteIndex * 0.04
        gainNode.gain.setValueAtTime(0, startTime + noteDelay)
        gainNode.gain.linearRampToValueAtTime(0.18, startTime + noteDelay + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDelay + noteFadeDuration)

        osc.start(startTime + noteDelay)
        osc.stop(startTime + noteDelay + noteFadeDuration + 0.1)
      })
    }

    return true
  }

  return { playProgression }
}
