import { useState } from 'react'
import StepInstrument from './steps/StepInstrument'
import StepGenreMood from './steps/StepGenreMood'
import StepDetails from './steps/StepDetails'
import StepComplexity from './steps/StepComplexity'
import Output from './Output'

export type FormData = {
  instrument: string
  genre: string
  moodTags: string[]
  moodText: string
  key: string
  tempo: string
  timeSignature: string
  bars: string
  complexity: number
}

const INITIAL: FormData = {
  instrument: '',
  genre: '',
  moodTags: [],
  moodText: '',
  key: '',
  tempo: '',
  timeSignature: '',
  bars: '',
  complexity: 33,
}

const STEPS = ['Instrument', 'Genre & Mood', 'Details', 'Complexity']

const WORKER_URL = String(import.meta.env['https://rootnote-worker.bob-a-mayer.workers.dev'] || '')

export default function Wizard() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (fields: Partial<FormData>) => setForm(f => ({ ...f, ...fields }))

  const canProceed = () => {
    if (step === 0) return !!form.instrument
    if (step === 1) return !!form.genre && form.moodTags.length > 0
    return true
  }

  const generate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setForm(INITIAL)
    setStep(0)
    setError(null)
  }

  if (result) {
    return <Output result={result} form={form} onReset={reset} onRegenerate={generate} loading={loading} />
  }

  return (
    <div className="bg-cream dark:bg-darkcard rounded-2xl shadow-md border border-sienna/20 dark:border-rust/20 p-8">
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
              ${i < step ? 'bg-sage text-white' : i === step ? 'bg-sienna dark:bg-rust text-white' : 'bg-ink/10 dark:bg-cream/10 text-ink/40 dark:text-cream/40'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 mx-1 transition-colors ${i < step ? 'bg-sage' : 'bg-ink/10 dark:bg-cream/10'}`} />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-serif font-bold text-sienna dark:text-rust mb-6">
        Step {step + 1}: {STEPS[step]}
      </h2>

      {step === 0 && <StepInstrument form={form} update={update} />}
      {step === 1 && <StepGenreMood form={form} update={update} />}
      {step === 2 && <StepDetails form={form} update={update} />}
      {step === 3 && <StepComplexity form={form} update={update} />}

      {error && <p className="text-rust mt-4 text-sm">{error}</p>}

      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)}
            className="px-5 py-2 rounded-lg border border-sienna/40 dark:border-rust/40 text-sienna dark:text-rust hover:bg-sienna/10 transition-colors">
            Back
          </button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
            className="px-6 py-2 rounded-lg bg-sienna dark:bg-rust text-white font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity">
            Next
          </button>
        ) : (
          <button onClick={generate} disabled={loading}
            className="px-6 py-2 rounded-lg bg-sienna dark:bg-rust text-white font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity">
            {loading ? 'Generating…' : 'Generate Progression'}
          </button>
        )}
      </div>
    </div>
  )
}
