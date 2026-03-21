export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const env = request.env as any
    const body = await request.json() as any
    const { instrument, genre, moodTags, moodText, key, tempo, timeSignature, bars, complexity } = body

    const complexityLabel = complexity < 34 ? 'beginner' : complexity < 67 ? 'intermediate' : 'advanced'

    const prompt = `You are a music theory expert and guitar/piano teacher. Generate a chord progression for the following inputs:

- Instrument: ${instrument}
- Genre: ${genre}
- Mood/Feel: ${moodTags.join(', ')}${moodText ? ` — "${moodText}"` : ''}
- Key/Starting Note: ${key || 'not specified — choose what fits best'}
- Tempo/Energy: ${tempo || 'not specified'}
- Time Signature: ${timeSignature || '4/4'}
- Progression Length: ${bars || '4'} bars
- Complexity Level: ${complexityLabel}

Respond in this EXACT format:

## Main Progression

**Chord Names:** [list chord names in order]

**Tab:**
\`\`\`
[instrument-specific tab with chord names above each block and finger positions]
\`\`\`

**Why This Works:**
[2-3 sentences on the music theory and why it fits the mood/genre]

---

## Variation

**Chord Names:** [variation chord names]

**Tab:**
\`\`\`
[variation tab]
\`\`\`

**The Twist:**
[1-2 sentences on what makes this variation different]

Rules:
- Guitar: standard 6-string tab (e B G D A E strings, fret numbers)
- Bass: 4-string tab (G D A E)
- Piano: left hand chord voicings as note names with fingering numbers
- Ukulele: 4-string tab (A E C G)
- Always show chord name above its tab block
- Match complexity: beginner=open chords, intermediate=7ths/barre, advanced=extensions/jazz`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json() as any
    const text = data.content?.[0]?.text ?? ''

    return new Response(JSON.stringify({ result: text }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  },
}
