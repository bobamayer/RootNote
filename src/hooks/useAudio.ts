import { Chord } from '../types'

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

// ─── Fallback Matching ─────────────────────────────────────────────────────
// The Worker's chord-notation rules constrain what `quality` should look
// like, but this stays defensive in case Claude drifts from the rules —
// strip modifiers progressively until we find a match or fall back to major.

function findIntervals(quality: string): number[] {
  // Direct match
  if (CHORD_INTERVALS[quality] !== undefined) return CHORD_INTERVALS[quality]

  // Strip trailing number: m9 -> m, maj13 -> maj
  const noTrailingNum = quality.replace(/\d+$/, '')
  if (noTrailingNum !== quality && CHORD_INTERVALS[noTrailingNum] !== undefined) {
    return CHORD_INTERVALS[noTrailingNum]
  }

  // Strip altered extension: 7b5 -> 7, 7s9 -> 7
  const noAlteration = quality.replace(/[bs]\d+$/, '')
  if (noAlteration !== quality && CHORD_INTERVALS[noAlteration] !== undefined) {
    return CHORD_INTERVALS[noAlteration]
  }

  // Strip from first digit: maj9 -> maj, m11 -> m
  const noDigits = quality.replace(/\d+.*$/, '')
  if (noDigits !== quality && CHORD_INTERVALS[noDigits] !== undefined) {
    return CHORD_INTERVALS[noDigits]
  }

  // Strip sus: 7sus4 -> 7
  const noSus = quality.replace(/sus\d*$/, '')
  if (noSus !== quality && CHORD_INTERVALS[noSus] !== undefined) {
    return CHORD_INTERVALS[noSus]
  }

  // Strip add: madd9 -> m
  const noAdd = quality.replace(/add\d*$/, '')
  if (noAdd !== quality && CHORD_INTERVALS[noAdd] !== undefined) {
    return CHORD_INTERVALS[noAdd]
  }

  // If it starts with m, treat as minor
  if (quality.startsWith('m') && CHORD_INTERVALS['m'] !== undefined) {
    return CHORD_INTERVALS['m']
  }

  // Final fallback — plain major
  return CHORD_INTERVALS['']
}

// ─── Instrument Profiles ────────────────────────────────────────────────────
// The four instrument choices in the wizard used to all play through the
// exact same synth voice — picking "Bass" vs "Piano" changed nothing about
// the sound. Each instrument now gets its own timbre (oscillator blend,
// envelope shape, filter brightness) and, for bass, its own voicing logic
// below, since a bassist doesn't play a whole chord's extensions.

type InstrumentKey = 'piano' | 'guitarAcoustic' | 'guitarElectric' | 'bass' | 'ukulele'

interface InstrumentProfile {
  waveform: OscillatorType
  secondaryWaveform: OscillatorType | null
  secondaryGain: number
  detuneCents: number
  attack: number
  decayCurve: 'pluck' | 'sustain'
  filterCutoff: number
  fadeMultiplier: number // shortens/lengthens ring time relative to the chord's slot
}

const INSTRUMENT_PROFILES: Record<InstrumentKey, InstrumentProfile> = {
  piano: {
    waveform: 'triangle',
    secondaryWaveform: 'sine',
    secondaryGain: 0.5,
    detuneCents: 3,
    attack: 0.01,
    decayCurve: 'sustain',
    filterCutoff: 4500,
    fadeMultiplier: 1.0,
  },
  guitarAcoustic: {
    waveform: 'sawtooth',
    secondaryWaveform: 'triangle',
    secondaryGain: 0.35,
    detuneCents: 8,
    attack: 0.005,
    decayCurve: 'pluck',
    filterCutoff: 3000,
    fadeMultiplier: 0.75,
  },
  guitarElectric: {
    waveform: 'sawtooth',
    secondaryWaveform: 'square',
    secondaryGain: 0.25,
    detuneCents: 10,
    attack: 0.004,
    decayCurve: 'pluck',
    filterCutoff: 3800,
    fadeMultiplier: 0.95,
  },
  bass: {
    waveform: 'sine',
    secondaryWaveform: null,
    secondaryGain: 0,
    detuneCents: 0,
    attack: 0.015,
    decayCurve: 'sustain',
    filterCutoff: 1200, // no upper harmonics — kept dark/low on purpose
    fadeMultiplier: 1.05,
  },
  ukulele: {
    waveform: 'triangle',
    secondaryWaveform: 'sine',
    secondaryGain: 0.3,
    detuneCents: 6,
    attack: 0.004,
    decayCurve: 'pluck',
    filterCutoff: 5000,
    fadeMultiplier: 0.65, // decays fastest of all of them
  },
}

// The wizard's instrument labels (see StepInstrument.tsx) aren't the same
// strings as the profile keys above — this is the one place that mapping
// lives, so a label change there only needs a fix here.
function normalizeInstrument(instrument: string): InstrumentKey {
  const lower = instrument.toLowerCase()
  if (lower.includes('bass')) return 'bass'
  if (lower.includes('ukulele')) return 'ukulele'
  if (lower.includes('electric')) return 'guitarElectric'
  if (lower.includes('guitar')) return 'guitarAcoustic'
  return 'piano'
}

// ─── Chord -> Voicing ───────────────────────────────────────────────────────
// This is the one place chord theory gets interpreted, and it now reads
// straight off the structured `root`/`quality` fields the Worker returns —
// no re-parsing a display string like "F#m7" back apart.
//
// A "voice" is one note to actually sound, with its own relative loudness.
// CHORD_INTERVALS already spreads extensions (9ths/11ths/13ths) upward
// correctly, so most instruments just get a bass note added: one octave
// down from the root, a bit louder, so the ear has something to rest the
// chord on. Bass is the exception — a real bassist plays the root (and the
// fifth, if there is one), not a full 9th chord's worth of extensions, so
// it gets its own much sparser voicing instead of reusing the full stack.

interface Voice {
  freq: number
  gain: number
}

function voiceChord(chord: Chord, instrument: InstrumentKey): Voice[] {
  const rootSemitone = ROOT_SEMITONES[chord.root]
  if (rootSemitone === undefined) return []

  const intervals = findIntervals(chord.quality)

  if (instrument === 'bass') {
    const fifth = intervals.find(i => i % 12 === 7)
    const voices: Voice[] = [{ freq: semitoneToFreq(rootSemitone - 12), gain: 1.3 }]
    if (fifth !== undefined) {
      voices.push({ freq: semitoneToFreq(rootSemitone - 12 + fifth), gain: 0.9 })
    }
    return voices
  }

  const voices: Voice[] = [
    { freq: semitoneToFreq(rootSemitone - 12), gain: 1.3 },
  ]

  for (const interval of intervals) {
    voices.push({ freq: semitoneToFreq(rootSemitone + interval), gain: 1.0 })
  }

  return voices
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
let masterBus: DynamicsCompressorNode | null = null

function getContext(): AudioContext {
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AC()
    masterBus = null // a new context needs a new compressor node
  }
  return audioCtx
}

// Every oscillator used to connect straight to ctx.destination — fine for
// one note, but the more notes stacked in a chord (and now two oscillators
// per note, see playVoice), the more they sum toward clipping. Routing
// everything through one shared compressor keeps output controlled
// regardless of how big a chord gets, instead of it distorting.
function getMasterBus(ctx: AudioContext): DynamicsCompressorNode {
  if (!masterBus) {
    masterBus = ctx.createDynamicsCompressor()
    masterBus.threshold.setValueAtTime(-18, ctx.currentTime)
    masterBus.knee.setValueAtTime(24, ctx.currentTime)
    masterBus.ratio.setValueAtTime(4, ctx.currentTime)
    masterBus.attack.setValueAtTime(0.005, ctx.currentTime)
    masterBus.release.setValueAtTime(0.25, ctx.currentTime)
    masterBus.connect(ctx.destination)
  }
  return masterBus
}

function syncUnlock(ctx: AudioContext) {
  const buf = ctx.createBuffer(1, 1, ctx.sampleRate)
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(ctx.destination)
  src.start(0)
}

// ─── Voice Playback ─────────────────────────────────────────────────────────
// One note, two blended oscillators, both driven by the instrument's
// profile instead of a fixed sine+triangle blend: the primary waveform
// carries the fundamental, and a detuned secondary oscillator (its
// waveform, gain, and detune all instrument-specific — some instruments,
// like bass, have none) sits underneath for body/warmth. A lowpass filter
// tuned per instrument tames harshness (bright for ukulele, dark for bass).
//
// decayCurve shapes the envelope: 'pluck' instruments (guitars, ukulele)
// hit their peak fast and immediately start decaying — there's no sustain
// plateau, the string is already dying the moment it's struck. 'sustain'
// instruments (piano, bass) hold near peak level before the release fade,
// closer to how a sustained tone actually behaves.

function playVoice(
  ctx: AudioContext,
  bus: AudioNode,
  freq: number,
  peakGain: number,
  startTime: number,
  fadeDuration: number,
  profile: InstrumentProfile
) {
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(profile.filterCutoff, startTime)
  filter.connect(bus)

  const gain = ctx.createGain()
  gain.connect(filter)
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peakGain, startTime + profile.attack)

  if (profile.decayCurve === 'pluck') {
    // Decay begins immediately after the attack peak — no sustain plateau.
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + fadeDuration)
  } else {
    // Hold near peak, then fall away — a true sustain plateau before release.
    const sustainStart = startTime + profile.attack
    const sustainEnd = startTime + fadeDuration * 0.6
    gain.gain.setValueAtTime(peakGain, sustainStart)
    gain.gain.linearRampToValueAtTime(peakGain * 0.85, sustainEnd)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + fadeDuration)
  }

  const stopTime = startTime + fadeDuration + 0.1

  const primary = ctx.createOscillator()
  primary.type = profile.waveform
  primary.frequency.setValueAtTime(freq, startTime)
  primary.connect(gain)
  primary.start(startTime)
  primary.stop(stopTime)

  if (profile.secondaryWaveform && profile.secondaryGain > 0) {
    const secondary = ctx.createOscillator()
    secondary.type = profile.secondaryWaveform
    secondary.frequency.setValueAtTime(freq, startTime)
    secondary.detune.setValueAtTime(profile.detuneCents, startTime)
    const secondaryGain = ctx.createGain()
    secondaryGain.gain.setValueAtTime(profile.secondaryGain, startTime)
    secondary.connect(secondaryGain)
    secondaryGain.connect(gain)
    secondary.start(startTime)
    secondary.stop(stopTime)
  }
}

// ─── Chord Scheduling ─────────────────────────────────────────────────────────

function scheduleChords(ctx: AudioContext, chords: Chord[], instrument: InstrumentKey): number {
  const profile = INSTRUMENT_PROFILES[instrument]
  const chordDuration = 1.2
  const startOffset = 0.15
  const bus = getMasterBus(ctx)

  chords.forEach((chord, i) => {
    const voices = voiceChord(chord, instrument)
    if (voices.length === 0) return

    const chordStart = ctx.currentTime + startOffset + i * chordDuration

    // Let notes ring most of the way into the next chord instead of decaying
    // to silence with a gap before it starts. fadeMultiplier lets each
    // instrument ring for a different fraction of its slot — a plucked
    // ukulele string dies out faster than a sustained piano tone.
    const fadeDuration = chordDuration * 0.92 * profile.fadeMultiplier

    // Scale down as chords get bigger (sqrt, not linear, since summed
    // uncorrelated tones don't add loudness 1:1) so a 7-note chord isn't
    // just a louder, more clipped version of a triad.
    const levelScale = 0.6 / Math.sqrt(voices.length)

    voices.forEach((voice, vi) => {
      const strumOffset = vi * 0.012
      playVoice(ctx, bus, voice.freq, voice.gain * levelScale, chordStart + strumOffset, fadeDuration, profile)
    })
  })

  return (chords.length * chordDuration + startOffset + 1.5) * 1000
}

// ─── Browser-Specific Play Paths ──────────────────────────────────────────────

function playSafari(chords: Chord[], instrument: InstrumentKey): Promise<boolean> {
  const ctx = getContext()
  syncUnlock(ctx)

  const doPlay = (): Promise<boolean> => {
    const duration = scheduleChords(ctx, chords, instrument)
    return new Promise(resolve => setTimeout(() => resolve(true), duration))
  }

  if (ctx.state === 'suspended') {
    return ctx.resume().then(doPlay).catch(() => Promise.resolve(false))
  }
  return doPlay()
}

function playChrome(chords: Chord[], instrument: InstrumentKey): Promise<boolean> {
  const ctx = getContext()

  const doPlay = (): Promise<boolean> => {
    const duration = scheduleChords(ctx, chords, instrument)
    return new Promise(resolve => setTimeout(() => resolve(true), duration))
  }

  return ctx.resume().then(doPlay).catch(() => {
    try { return doPlay() } catch { return Promise.resolve(false) }
  })
}

function playStandard(chords: Chord[], instrument: InstrumentKey): Promise<boolean> {
  const ctx = getContext()

  const doPlay = (): Promise<boolean> => {
    const duration = scheduleChords(ctx, chords, instrument)
    return new Promise(resolve => setTimeout(() => resolve(true), duration))
  }

  if (ctx.state === 'suspended') {
    return ctx.resume().then(doPlay).catch(() => Promise.resolve(false))
  }
  return doPlay()
}

// ─── Public Hook ──────────────────────────────────────────────────────────────

export function useAudio() {
  function playProgression(chords: Chord[], instrumentLabel?: string): Promise<boolean> {
    if (!chords || chords.length === 0) return Promise.resolve(false)

    const instrument = normalizeInstrument(instrumentLabel || 'piano')

    try {
      if (isSafari()) return playSafari(chords, instrument)
      if (isChrome()) return playChrome(chords, instrument)
      return playStandard(chords, instrument)
    } catch {
      return Promise.resolve(false)
    }
  }

  return { playProgression }
}
