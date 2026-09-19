import { FormData } from './Wizard'

const LEVELS = [
  { value: 16, label: 'Beginner', emoji: '🌱', desc: 'Open chords, simple shapes, easy to play' },
  { value: 50, label: 'Intermediate', emoji: '🎸', desc: '7ths, sus chords, barre chords, moderate voicings' },
  { value: 84, label: 'Advanced', emoji: '🎓', desc: 'Extensions, jazz voicings, substitutions, complex shapes' },
]

export default function StepComplexity({
  form, update
}: {
  form: FormData
  update: (f: Partial<FormData>) => void
}) {
  const selectedLabel = form.complexity <= 16
    ? 'Beginner'
    : form.complexity <= 50
    ? 'Intermediate'
    : 'Advanced'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {LEVELS.map(level => (
          <button
            key={level.value}
            onClick={() => update({ complexity: level.value })}
            className={`p-4 rounded border text-left transition-all touch-manipulation
              ${form.complexity === level.value
                ? 'border-teal bg-tag-teal-bg shadow-raised'
                : 'border-line-strong hover:border-teal/40'
              }`}
          >
            <span className="text-2xl block mb-2">{level.emoji}</span>
            <span className={`block font-serif font-semibold text-base mb-1 ${
              form.complexity === level.value ? 'text-teal' : 'text-moss'
            }`}>
              {level.label}
            </span>
            <span className="block text-xs text-moss-muted leading-snug">
              {level.desc}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-line pt-4">
        <h3 className="text-sm font-medium text-moss-muted mb-3">
          Your progression summary:
        </h3>
        <dl className="space-y-1 text-sm">
          {[
            ['Instrument', form.instrument],
            ['Genre', form.genre],
            ['Mood', form.moodTags.join(', ')],
            ['Key', form.key || 'Auto'],
            ['Tempo', form.tempo || 'Auto'],
            ['Time Sig', form.timeSignature || '4/4'],
            ['Bars', form.bars || '4'],
            ['Complexity', selectedLabel],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="text-moss-muted w-24 shrink-0">{k}:</dt>
              <dd className="font-medium text-moss">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
