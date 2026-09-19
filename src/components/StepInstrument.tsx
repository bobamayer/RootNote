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
          className={`p-4 rounded border text-left transition-all touch-manipulation
            ${form.instrument === inst.name
              ? 'border-teal bg-tag-teal-bg shadow-raised'
              : 'border-line-strong hover:border-teal/40'
            }`}
        >
          <span className="text-2xl block mb-1">{inst.emoji}</span>
          <span className={`text-sm font-medium block ${
            form.instrument === inst.name ? 'text-teal' : 'text-moss'
          }`}>
            {inst.name}
          </span>
        </button>
      ))}
    </div>
  )
}
