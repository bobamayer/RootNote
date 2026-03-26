import { useState } from 'react'
import { FormData } from './Wizard'
import { useAudio } from '../hooks/useAudio'

export default function Output({
  result, form, onReset, onRegenerate, loading
}: {
  result: string
  form: FormData
  onReset: () => void
  onRegenerate: () => void
  loading: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [playing, setPlaying] = useState(false)
  const { playProgression } = useAudio()

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePlay = async () => {
    setPlaying(true)
    await playProgression(result)
    setTimeout(() => setPlaying(false), 6000)
  }

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rootnote-${form.genre}-${form.instrument}.txt`.toLowerCase().replace(/\s/g, '-')
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    const text = `Check out this chord progression I made with RootNote!\n\n${result}`
    if (navigator.share) {
      navigator.share({ title: 'RootNote Progression', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard for sharing!')
    }
  }

  const renderOutput = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return (
        <h2 key={i} className="text-xl font-serif font-bold text-sienna dark:text-rust mt-6 mb-2">
          {line.replace('## ', '')}
        </h2>
      )
      if (line.includes(':**')) return (
        <p key={i} className="font-bold text-ink dark:text-cream mt-3">
          {line.replace(/\*\*/g, '')}
        </p>
      )
      if (line === '---') return <hr key={i} className="border-ink/10 dark:border-cream/10 my-4" />
      if (line.startsWith('```') || line === '```') return null
      const isTab = /^[eEBGDAd]\|/.test(line) || /^\|/.test(line)
      return (
        <p key={i} className={isTab
          ? 'font-mono text-sm text-ink dark:text-cream whitespace-pre block'
          : 'text-sm text-ink/80 dark:text-cream/80 whitespace-normal break-words leading-relaxed'
        }>
          {line || '\u00A0'}
        </p>
      )
    })
  }

  return (
    <div className="bg-cream dark:bg-darkcard rounded-2xl shadow-md border border-sienna/20 dark:border-rust/20 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-bold text-sienna dark:text-rust">Your Progression</h2>
        <span className="text-xs text-ink/40 dark:text-cream/40 italic">{form.genre} · {form.instrument}</span>
      </div>

      <div className="bg-parchment dark:bg-darkmuted rounded-xl p-5 mb-3 overflow-x-auto">
        {renderOutput(result)}
      </div>

      <div className="flex justify-center mb-5">
        <button onClick={handlePlay} disabled={playing}
          className="px-8 py-3 rounded-xl border-2 border-sage/60 text-sage text-base font-semibold hover:bg-sage/10 transition-colors disabled:opacity-40">
          {playing ? '♪ Playing…' : '▶ Play Chords'}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={handleCopy}
          className="px-4 py-2 rounded-lg border border-sienna/40 dark:border-rust/40 text-sienna dark:text-rust text-sm hover:bg-sienna/10 transition-colors">
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
        <button onClick={handleDownload}
          className="px-4 py-2 rounded-lg border border-sienna/40 dark:border-rust/40 text-sienna dark:text-rust text-sm hover:bg-sienna/10 transition-colors">
          Save as .txt
        </button>
        <button onClick={handleShare}
          className="px-4 py-2 rounded-lg border border-sienna/40 dark:border-rust/40 text-sienna dark:text-rust text-sm hover:bg-sienna/10 transition-colors">
          Share
        </button>
        <button onClick={onRegenerate} disabled={loading}
          className="px-4 py-2 rounded-lg border border-sage/60 text-sage text-sm hover:bg-sage/10 transition-colors disabled:opacity-40">
          {loading ? 'Regenerating…' : '↺ Regenerate'}
        </button>
        <button onClick={onReset}
          className="px-4 py-2 rounded-lg bg-sienna dark:bg-rust text-white text-sm hover:opacity-90 transition-opacity ml-auto">
          Start Over
        </button>
      </div>
    </div>
  )
}
