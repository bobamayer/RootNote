import { FormData } from '../Wizard'

const GENRES = ['Rock', 'Blues', 'Jazz', 'Folk', 'Pop', 'Country', 'R&B', 'Classical', 'Metal', 'Indie', 'Funk', 'Latin']
const MOODS = ['Melancholic', 'Uplifting', 'Tense', 'Dreamy', 'Gritty', 'Hopeful', 'Dark', 'Peaceful', 'Energetic', 'Bittersweet', 'Romantic', 'Mysterious']

export default function StepGenreMood({ form, update }: { form: FormData, update: (f: Partial<FormData>) => void }) {
  const toggleMood = (mood: string) => {
    const tags = form.moodTags.includes(mood)
      ? form.moodTags.filter(m => m !== mood)
      : [...form.moodTags, mood]
    update({ moodTags: tags })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-ink/70 dark:text-cream/70 mb-2">Genre *</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {GENRES.map(g => (
            <button key={g} onClick={() => update({ genre: g })}
              className={`py-2 px-3 rounded-lg text-sm border transition-all
                ${form.genre === g
                  ? 'border-sienna dark:border-rust bg-sienna/10 dark:bg-rust/10 text-sienna dark:text-rust font-semibold'
                  : 'border-ink/15 dark:border-cream/15 hover:border-sienna/40 dark:hover:border-rust/40'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink/70 dark:text-cream/70 mb-2">Mood/Feel * (pick one or more)</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button key={m} onClick={() => toggleMood(m)}
              className={`py-1.5 px-3 rounded-full text-sm border transition-all
                ${form.moodTags.includes(m)
                  ? 'border-sage bg-sage/20 text-sage font-semibold'
                  : 'border-ink/15 dark:border-cream/15 hover:border-sage/50'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink/70 dark:text-cream/70 mb-2">
          Describe the vibe further <span className="font-normal italic">(optional)</span>
        </label>
        <textarea value={form.moodText} onChange={e => update({ moodText: e.target.value })}
          placeholder="e.g. 'Like a rainy afternoon coffee shop'…"
          rows={2}
          className="w-full rounded-lg border border-ink/15 dark:border-cream/15 bg-transparent p-3 text-sm focus:outline-none focus:border-sienna dark:focus:border-rust resize-none" />
      </div>
    </div>
  )
}
