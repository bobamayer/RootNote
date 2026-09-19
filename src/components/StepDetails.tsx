import { FormData } from './Wizard'

const KEYS = [
  'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F',
  'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B',
]
const TIME_SIGS = ['4/4', '3/4', '6/8', '5/4', '7/8']
const TEMPOS = [
  'Very slow & brooding',
  'Slow & relaxed',
  'Medium & steady',
  'Upbeat & driving',
  'Fast & intense',
]
const BARS = ['2', '4', '8', '12', '16']

export default function StepDetails({
  form, update
}: {
  form: FormData
  update: (f: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-moss-muted mb-2">
          Key / Starting Note <span className="font-normal italic">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {KEYS.map(k => (
            <button
              key={k}
              onClick={() => update({ key: form.key === k ? '' : k })}
              className={`py-1.5 px-3 rounded text-sm border transition-all font-mono touch-manipulation
                ${form.key === k
                  ? 'border-teal bg-tag-teal-bg text-teal font-semibold'
                  : 'border-line-strong hover:border-teal/40'
                }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-moss-muted mb-2">
            Time Signature
          </label>
          <select
            value={form.timeSignature}
            onChange={e => update({ timeSignature: e.target.value })}
            className="w-full rounded border border-line-strong bg-paper text-moss p-2 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/25"
          >
            <option value="">4/4 (default)</option>
            {TIME_SIGS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-moss-muted mb-2">
            Progression Length
          </label>
          <select
            value={form.bars}
            onChange={e => update({ bars: e.target.value })}
            className="w-full rounded border border-line-strong bg-paper text-moss p-2 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/25"
          >
            <option value="">4 bars (default)</option>
            {BARS.map(b => (
              <option key={b} value={b}>{b} bars</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-moss-muted mb-2">
          Tempo / Energy
        </label>
        <div className="flex flex-col gap-2">
          {TEMPOS.map(t => (
            <button
              key={t}
              onClick={() => update({ tempo: form.tempo === t ? '' : t })}
              className={`py-2 px-4 rounded text-sm border text-left transition-all touch-manipulation
                ${form.tempo === t
                  ? 'border-teal bg-tag-teal-bg text-teal font-medium'
                  : 'border-line-strong hover:border-teal/40'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
