 import { useState } from 'react'
import StepInstrument from './StepInstrument'
import StepGenreMood from './StepGenreMood'
import StepDetails from './StepDetails'
import StepComplexity from './StepComplexity'
import Output from './Output'
import { ProgressionResponse } from '../types'

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
  complexity: 16,
}

const STEPS = ['Instrument', 'Genre & Mood', 'Details', 'Complexity']
const WORKER_URL = import.meta.env.VITE_WORKER_URL

export default function Wizard() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [result, setResult] = useState<ProgressionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (fields: Partial<FormData>) =>
    setForm(f => ({ ...f, ...fields }))

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
      setResult(data.progression as ProgressionResponse)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
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
    return (
      <Output
        result={result}
        form={form}
        onReset={reset}
        onRegenerate={generate}
        loading={loading}
      />
    )
  }

  return (
    <div className="bg-paper rounded-card shadow-rest border border-line p-5 sm:p-8">

      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
              ${i < step
                ? 'bg-plum text-paper'
                : i === step
                ? 'bg-teal text-paper'
                : 'bg-fog text-moss-muted'
              }`}>
              {i < step ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-12 mx-1 transition-colors
                ${i < step ? 'bg-plum' : 'bg-line'}`} />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-serif font-semibold text-teal mb-6">
        Step {step + 1}: {STEPS[step]}
      </h2>

      {step === 0 && <StepInstrument form={form} update={update} />}
      {step === 1 && <StepGenreMood form={form} update={update} />}
      {step === 2 && <StepDetails form={form} update={update} />}
      {step === 3 && <StepComplexity form={form} update={update} />}

      {error && (
        <p className="text-brick mt-4 text-sm">{error}</p>
      )}

      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-5 py-2 rounded border border-line-strong text-moss hover:bg-fog active:bg-fog transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/25 focus-visible:ring-offset-2"
          >
            Back
          </button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className="px-6 py-2 rounded bg-teal text-paper font-medium shadow-raised disabled:opacity-40 hover:bg-teal-hover active:shadow-rest transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/25 focus-visible:ring-offset-2"
          >
            Next
          </button>
        ) : (
          <button
            onClick={generate}
            disabled={loading}
            className="px-6 py-2 rounded bg-teal text-paper font-medium shadow-raised disabled:opacity-40 hover:bg-teal-hover active:shadow-rest transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/25 focus-visible:ring-offset-2"
          >
            {loading ? 'Generating…' : 'Generate Progression'}
          </button>
        )}
      </div>
    </div>
  )
}
