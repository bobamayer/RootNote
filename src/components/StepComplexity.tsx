import { FormData } from './Wizard'

export default function StepComplexity({ form, update }: { form: FormData, update: (f: Partial<FormData>) => void }) {
  const label = form.complexity < 34 ? 'Beginner' : form.complexity < 67 ? 'Intermediate' : 'Advanced'
  const desc = form.complexity < 34
    ? 'Open chords, simple shapes, easy to play'
    : form.complexity < 67
    ? '7ths, sus chords, barre chords, moderate voicings'
    : 'Extensions, jazz voicings, substitutions, complex shapes'

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <label className="text-sm font-semibold text-ink/70 dark:text-cream/70">Complexity Level</label>
          <span className="text-lg font-serif font-bold text-sienna dark:text-rust">{label}</span>
        </div>
        <input type="range" min={0} max={100} value={form.complexity}
          onChange={e => update({ complexity: Number(e.target.value) })}
          className="w-full accent-sienna dark:accent-rust" />
        <div className="flex justify-between text-xs text-ink/40 dark:text-cream/40 mt-1">
          <span>Beginner</span>
          <span>Intermediate</span>
          <span>Advanced</span>
        </div>
        <p className="mt-4 text-sm italic text-ink/60 dark:text-cream/50 bg-ink/5 dark:bg-cream/5 rounded-lg p-3">
          {desc}
        </p>
      </div>

      <div className="border-t border-ink/10 dark:border-cream/10 pt-4">
        <h3 className="text-sm font-semibold text-ink/70 dark:text-cream/70 mb-3">Your progression summary:</h3>
        <dl className="space-y-1 text-sm">
          {[
            ['Instrument', form.instrument],
            ['Genre', form.genre],
            ['Mood', form.moodTags.join(', ')],
            ['Key', form.key || 'Auto'],
            ['Tempo', form.tempo || 'Auto'],
            ['Time Sig', form.timeSignature || '4/4'],
            ['Bars', form.bars || '4'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="text-ink/40 dark:text-cream/40 w-20 shrink-0">{k}:</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
