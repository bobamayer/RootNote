// ─── Types (mirror of src/types.ts — see note at bottom of that file) ─────────

interface Chord {
  name: string
  root: string
  quality: string
}

interface ProgressionSection {
  label: string
  chords: Chord[]
  tab: string
  explanation: string
}

interface ProgressionResponse {
  main: ProgressionSection
  variation: ProgressionSection
}

type Result<T> = { ok: true; value: T } | { ok: false; error: string; status: number }

// ─── CORS ──────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  })
}

function errorResponse(message: string, status = 500) {
  return jsonResponse({ error: message }, status)
}

// ─── Tool schema — the typed contract Claude must fill in ─────────────────
// This IS the source of truth for the shape of a chord and a section.
// If you change it, update the matching interfaces above and in src/types.ts.

function buildChordSchema() {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description:
          'Full chord symbol exactly as notated, e.g. "F#m7", "Cadd9", "Bbmaj7". Must follow the CHORD NOTATION RULES exactly.',
      },
      root: {
        type: 'string',
        description: 'Root note only, with # or b if needed, e.g. "F#", "Bb", "C".',
      },
      quality: {
        type: 'string',
        description:
          'Everything after the root, e.g. "m7", "add9", "sus4". Empty string for a plain major triad. "name" must equal root + quality.',
      },
    },
    required: ['name', 'root', 'quality'],
  }
}

function buildSectionSchema(barCount: number) {
  return {
    type: 'object',
    properties: {
      label: {
        type: 'string',
        description: 'Section title, e.g. "Main Progression" or "Variation".',
      },
      chords: {
        type: 'array',
        description: `Exactly ${barCount} chords, one per bar, in order.`,
        items: buildChordSchema(),
        minItems: barCount,
        maxItems: barCount,
      },
      tab: {
        type: 'string',
        description:
          'Instrument-specific tab/notation covering every bar, as plain text with newlines (no markdown code fences). Guitar: 6-string tab (e B G D A E). Bass: 4-string (G D A E). Piano: note names with fingering. Ukulele: 4-string (A E C G). Show each chord\'s name above its tab block. If the progression is longer than 4 bars, label subsections inline, e.g. a line reading "[Bars 1-4]" before that group\'s tab.',
      },
      explanation: {
        type: 'string',
        description:
          'For the main progression: 2-3 sentences on the music theory and emotional arc. For the variation: 1-2 sentences on what makes it different.',
      },
    },
    required: ['label', 'chords', 'tab', 'explanation'],
  }
}

function buildProgressionTool(barCount: number) {
  return {
    name: 'return_progression',
    description:
      'Return the generated chord progression and its variation as structured data. This is the only way to respond — never respond with plain text.',
    input_schema: {
      type: 'object',
      properties: {
        main: buildSectionSchema(barCount),
        variation: buildSectionSchema(barCount),
      },
      required: ['main', 'variation'],
    },
  }
}

// ─── Prompt ─────────────────────────────────────────────────────────────────

function buildPrompt(opts: {
  instrument: string
  genre: string
  moodTags: string[]
  moodText: string
  key: string
  tempo: string
  timeSignature: string
  barCount: number
  complexityLabel: string
}) {
  const { instrument, genre, moodTags, moodText, key, tempo, timeSignature, barCount, complexityLabel } = opts

  const variationGuidance =
    barCount > 4
      ? `
CRITICAL — ${barCount} bars means you MUST provide exactly ${barCount} distinct chords (one per bar) for BOTH the main progression AND the variation.
DO NOT repeat the same 4 chords. Evolve the progression across sections:
- Bars 1-4: Establish the main theme
- Bars 5-8: Contrasting section using substitutions, borrowed chords, or secondary dominants
- Bars 9-12 (if applicable): Development or modified return
- Bars 13-16 (if applicable): Climax or strong cadence
Each section must sound musically distinct. The variation must ALSO be ${barCount} bars with ${barCount} different chords.`
      : `
Provide exactly 4 chords for both the main progression and the variation.`

  const sectionLabels =
    barCount > 4 ? `Label sections clearly in the tab, e.g. a line reading "[Bars 1-4]", "[Bars 5-8]", etc.` : ''

  return `You are a music theory expert. Generate a chord progression strictly following these rules.

INPUTS:
- Instrument: ${instrument}
- Genre: ${genre}
- Mood/Feel: ${moodTags.join(', ')}${moodText ? ` — "${moodText}"` : ''}
- Key/Starting Note: ${key || 'choose what fits best'}
- Tempo/Energy: ${tempo || 'medium'}
- Time Signature: ${timeSignature || '4/4'}
- Progression Length: ${barCount} bars
- Complexity: ${complexityLabel}
${variationGuidance}

CHORD NOTATION RULES — you MUST follow these exactly for every chord's "name" field (and for "root"/"quality", which together must equal "name"):
- Only use these chord formats: C, Cm, C7, Cmaj7, Cm7, C9, Cm9, Cmaj9, C11, Cm11, C13, Cm13, Csus2, Csus4, C7sus4, Cdim, Cdim7, Caug, Cadd9, Cmadd9, C6, Cm6, C5, Cm7b5, C7b5, C7b9, C7s9, Cmaj7s11
- Replace # with the actual sharp symbol in chord names e.g. F#m7 Bb7 Ebmaj7
- NO slash chords like C/E or G/B — use the triad instead
- NO parentheses like C(add9) — write Cadd9 instead
- NO omit notation like Cmaj9omit3
- NO Roman numerals
- Accidentals: use # or b only e.g. C#m7 Bbmaj7 Ebsus2

TAB RULES:
- Guitar: 6-string (e B G D A E). Bass: 4-string (G D A E). Piano: note names with fingering. Ukulele: 4-string (A E C G).
- Show every chord's name above its tab block.
${sectionLabels}

Both the main progression AND the variation must have exactly ${barCount} chords — one per bar.

COMPLEXITY GUIDE:
- beginner: open chords, no barre chords, simple shapes
- intermediate: 7ths, sus chords, some barre chords
- advanced: extensions, jazz voicings, complex substitutions

Call the return_progression tool with your complete answer. Do not include any text outside the tool call.`
}

// ─── Validation ─────────────────────────────────────────────────────────────

function isValidChord(value: unknown): value is Chord {
  if (!value || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  return typeof c.name === 'string' && typeof c.root === 'string' && typeof c.quality === 'string'
}

function isValidSection(value: unknown, barCount: number): value is ProgressionSection {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.label === 'string' &&
    Array.isArray(s.chords) &&
    s.chords.length === barCount &&
    s.chords.every(isValidChord) &&
    typeof s.tab === 'string' &&
    typeof s.explanation === 'string'
  )
}

function isValidProgression(value: unknown, barCount: number): value is ProgressionResponse {
  if (!value || typeof value !== 'object') return false
  const p = value as Record<string, unknown>
  return isValidSection(p.main, barCount) && isValidSection(p.variation, barCount)
}

// ─── Stage 1: talk to Claude ────────────────────────────────────────────────
// This is the ONLY function in the file that knows the Anthropic API exists —
// its job stops at "call the model, hand back the raw response or an error."
// It doesn't know what a chord is. That's the point: when Phase 2 adds a
// Python service, this function is untouched, and a new callPythonService()
// sits next to it doing the equivalent job for that call.

async function callClaude(prompt: string, tool: unknown, apiKey: string): Promise<Result<any>> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
      tools: [tool],
      tool_choice: { type: 'tool', name: 'return_progression' },
    }),
  })

  if (!response.ok) {
    return { ok: false, error: `Claude API error (${response.status})`, status: 502 }
  }

  const data = await response.json()
  return { ok: true, value: data }
}

// ─── Stage 2: interpret Claude's response ──────────────────────────────────
// Pulls the forced tool call out of Claude's raw response and validates it
// against the same shape the schema demanded. This is separate from
// callClaude() on purpose: "did the HTTP call succeed" and "was the payload
// actually well-formed" are two different failure modes, and Phase 2's
// music-theory validation step will live right after this one, not inside it.

function extractProgression(claudeData: any, barCount: number): Result<ProgressionResponse> {
  const toolUse = claudeData.content?.find(
    (block: any) => block.type === 'tool_use' && block.name === 'return_progression'
  )

  if (!toolUse) {
    return { ok: false, error: 'Claude did not return a structured progression', status: 502 }
  }

  const progression = toolUse.input

  if (!isValidProgression(progression, barCount)) {
    return { ok: false, error: 'Claude returned malformed progression data', status: 502 }
  }

  return { ok: true, value: progression }
}

// ─── Stage 3: shape the client-facing payload ──────────────────────────────
// Right now this is a straight passthrough. It exists as its own function
// because it's the seam where Phase 2+ will merge in the Python service's
// validated/normalized chords, and later a MIDI download URL, without
// touching how Claude is called or how its output is parsed.

function buildResponse(progression: ProgressionResponse) {
  return { progression }
}

// ─── Worker ─────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: { ANTHROPIC_API_KEY: string }): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return errorResponse('Invalid JSON body', 400)
    }

    const { instrument, genre, moodTags, moodText, key, tempo, timeSignature, bars, complexity } = body

    if (!instrument || !genre || !Array.isArray(moodTags) || moodTags.length === 0) {
      return errorResponse('Missing required fields: instrument, genre, moodTags', 400)
    }

    const complexityLabel = complexity <= 16 ? 'beginner' : complexity <= 50 ? 'intermediate' : 'advanced'
    const barCount = parseInt(bars, 10) || 4

    const prompt = buildPrompt({
      instrument,
      genre,
      moodTags,
      moodText,
      key,
      tempo,
      timeSignature,
      barCount,
      complexityLabel,
    })
    const tool = buildProgressionTool(barCount)

    const claudeResult = await callClaude(prompt, tool, env.ANTHROPIC_API_KEY)
    if (!claudeResult.ok) {
      return errorResponse(claudeResult.error, claudeResult.status)
    }

    const extracted = extractProgression(claudeResult.value, barCount)
    if (!extracted.ok) {
      return errorResponse(extracted.error, extracted.status)
    }

    return jsonResponse(buildResponse(extracted.value))
  },
}
