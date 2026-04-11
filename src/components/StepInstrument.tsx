import { FormData } from './Wizard'

const INSTRUMENTS = [
  { name: 'Piano', emoji: '🎹' },
  { name: 'Guitar (Acoustic)', emoji: '🎸' },
  { name: 'Guitar (Electric)', emoji: '🎸' },
  { name: 'Bass', emoji: '🎸' },
  { name: 'Ukulele', emoji: '🪕' },
]

export default function StepInstrument({
  form, update
}: {
  form: FormData
  update: (f: Partial<FormData>) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {INSTRUMENTS.map(inst => (
        <button
          key={inst.name}
          onClick={() => update({ instrument: inst.name })}
          className={`p-4 rounded-xl border-2 text-left transition-all touch-manipulation
            ${form.instrument === inst.name
              ? 'border-sienna dark:border-rust bg-sienna/10 dark:bg-rust/10'
              : 'border-ink/15 dark:border-cream/15 hover:border-sienna/40 dark:hover:border-rust/40'
            }`}
        >
          <span className="text-2xl block mb-1">{inst.emoji}</span>
          <span className={`text-sm font-semibold block ${
            form.instrument === inst.name
              ? 'text-sienna dark:text-rust'
              : 'text-ink dark:text-cream'
          }`}>
            {inst.name}
          </span>
        </button>
      ))}
    </div>
  )
}
