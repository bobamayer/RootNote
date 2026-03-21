import { FormData } from '../Wizard'

const KEYS = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B']
const TIME_SIGS = ['4/4', '3/4', '6/8', '5/4', '7/8']
const TEMPOS = ['Very slow & brooding', 'Slow & relaxed', 'Medium & steady', 'Upbeat & driving', 'Fast & intense']
const BARS = ['2', '4', '8', '12', '16']

export default function StepDetails({ form, update }: { form: FormData, update: (f: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-ink/70 dark:text-cream/70 mb-2">
          Key / Starting Note <span className="font-normal italic">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {KEYS.map(k => (
            <button key={k} onClick={() => update({ key: form.key === k ? '' : k })}
              className={`py-1.5 px-3 rounded-lg text-sm border transition-all font-mono
                ${form.key === k
                  ? 'border-sienna dark:border-rust bg-sienna/10 dark:bg-rust/10 text-sienna dark:text-rust font-bold'
                  : 'border-ink/15 dark:border-cream/15 hover:border-sienna/40 dark:hover:border-rust/40'}`}>
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-ink/70 dark:text-cream/70 mb-2">Time Signature</label>
          <select value={form.timeSignature} onChange={e => update({ timeSignature: e.target.value })}
            className="w-full rounded-lg border border-ink/15 dark:border-cream/15 bg-transparent p-2 text-sm focus:outline-none focus:border-sienna dark:focus:border-rust">
            <option value="">4/4 (default)</option>
            {TIME_SIGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink/70 dark:text-cream/70 mb-2">Progression Length</label>
          <select value={form.bars} onChange={e => update({ bars: e.target.value })}
            className="w-full rounded-lg border border-ink/15 dark:border-cream/15 bg-transparent p-2 text-sm focus:outline-none focus:border-sienna dark:focus:border-rust">
            <option value="">4 bars (default)</option>
            {BARS.map(b => <option key={b} value={b}>{b} bars</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink/70 dark:text-cream/70 mb-2">Tempo / Energy</label>
        <div className="flex flex-col gap-2">
          {TEMPOS.map(t => (
            <button key={t} onClick={() => update({ tempo: form.tempo === t ? '' : t })}
              className={`py-2 px-4 rounded-lg text-sm border text-left transition-all
                ${form.tempo === t
                  ? 'border-sienna dark:border-rust bg-sienna/10 dark:bg-rust/10 text-sienna dark:text-rust font-semibold'
                  : 'border-ink/15 dark:border-cream/15 hover:border-sienna/40 dark:hover:border-rust/40'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
