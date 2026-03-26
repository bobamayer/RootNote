import { FormData } from './Wizard'

const LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',
    emoji: '🌱',
    desc: 'Open chords, simple shapes, easy to play',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    emoji: '🎸',
    desc: '7ths, sus chords, barre chords, moderate voicings',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    emoji: '🎓',
    desc: 'Extensions, jazz voicings, substitutions, complex shapes',
  },
]

export default function StepComplexity({
  form,
  update,
}: {
  form: FormData
  update: (f: Partial<FormData>) => void
}) {
  const selected = form.complexity < 34
    ? 'beginner'
    : form.complexity < 67
    ? 'intermediate'
    : 'advanced'

  const select = (value: string) => {
    update({
      complexity: value === 'beginner' ? 16 : value === 'intermediate' ? 50 : 84,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => select(level.value)}
            className={`p-4 rounded-xl border-2 text-left transition-all touch-manipulation
              ${selected === level.value
                ? 'border-sienna dark:border-rust bg-sienna/10 dark:bg-rust/10'
                : 'border-ink/15 dark:border-cream/15 hover:border-sienna/40 dark:hover:border-rust/40'
              }`}
          >
            <span className="text-2xl block mb-2">{level.emoji}</span>
            <span className={`block font-serif font-bold text-base mb-1 ${
              selected === level.value
                ? 'text-sienna dark:text-rust'
                : 'text-ink dark:text-cream'
            }`}>
              {level.label}
            </span>
            <span className="block text-xs text-ink/60 dark:text-cream/50 leading-snug">
              {level.desc}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-ink/10 dark:border-cream/10 pt-4">
        <h3 className="text-sm font-semibold text-ink/70 dark:text-cream/70 mb-3">
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
            ['Complexity', selected.charAt(0).toUpperCase() + selected.slice(1)],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="text-ink/40 dark:text-cream/40 w-24 shrink-0">{k}:</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
