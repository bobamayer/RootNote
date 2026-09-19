import { FormData } from './Wizard'

const GENRES = [
  'Rock', 'Blues', 'Jazz', 'Folk', 'Pop', 'Country',
  'R&B', 'Classical', 'Metal', 'Indie', 'Funk', 'Latin',
]

const MOODS = [
  'Melancholic', 'Uplifting', 'Tense', 'Dreamy', 'Gritty',
  'Hopeful', 'Dark', 'Peaceful', 'Energetic', 'Bittersweet',
  'Romantic', 'Mysterious',
]

export default function StepGenreMood({
  form, update
}: {
  form: FormData
  update: (f: Partial<FormData>) => void
}) {
  const toggleMood = (mood: string) => {
    const tags = form.moodTags.includes(mood)
      ? form.moodTags.filter(m => m !== mood)
      : [...form.moodTags, mood]
    update({ moodTags: tags })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-moss-muted mb-2">
          Genre *
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => update({ genre: g })}
              className={`py-2 px-2 rounded text-sm border transition-all touch-manipulation
                ${form.genre === g
                  ? 'border-teal bg-tag-teal-bg text-teal font-medium'
                  : 'border-line-strong hover:border-teal/40'
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-moss-muted mb-2">
          Mood / Feel * <span className="font-normal">(pick one or more)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button
              key={m}
              onClick={() => toggleMood(m)}
              className={`py-1.5 px-3 rounded-full text-sm border transition-all touch-manipulation
                ${form.moodTags.includes(m)
                  ? 'border-plum bg-tag-plum-bg text-plum font-medium'
                  : 'border-line-strong hover:border-plum/50'
                }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-moss-muted mb-2">
          Describe the vibe <span className="font-normal italic">(optional)</span>
        </label>
        <textarea
          value={form.moodText}
          onChange={e => update({ moodText: e.target.value })}
          placeholder="e.g. 'Like a rainy afternoon coffee shop' or 'Driving at night on empty roads'…"
          rows={2}
          className="w-full rounded border border-line-strong bg-paper text-moss placeholder:text-moss-muted p-3 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/25 resize-none"
        />
      </div>
    </div>
  )
}
