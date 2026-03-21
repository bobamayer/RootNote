import { FormData } from '../Wizard'

const INSTRUMENTS = ['Piano', 'Guitar (Acoustic)', 'Guitar (Electric)', 'Bass', 'Ukulele']

export default function StepInstrument({ form, update }: { form: FormData, update: (f: Partial<FormData>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {INSTRUMENTS.map(inst => (
        <button key={inst} onClick={() => update({ instrument: inst })}
          className={`p-4 rounded-xl border-2 text-left transition-all font-serif
            ${form.instrument === inst
              ? 'border-sienna dark:border-rust bg-sienna/10 dark:bg-rust/10 text-sienna dark:text-rust'
              : 'border-ink/15 dark:border-cream/15 hover:border-sienna/40 dark:hover:border-rust/40'}`}>
          <span className="text-2xl block mb-1">
            {inst === 'Piano' ? '🎹' : inst === 'Ukulele' ? '🪕' : '🎸'}
          </span>
          <span className="text-sm font-semibold">{inst}</span>
        </button>
      ))}
    </div>
  )
}
