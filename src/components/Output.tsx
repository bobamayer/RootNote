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
  const [playingMain, setPlayingMain] = useState(false)
  const [playingVariation, setPlayingVariation] = useState(false)
  const [playErrorMain, setPlayErrorMain] = useState(false)
  const [playErrorVariation, setPlayErrorVariation] = useState(false)
  const { playProgression } = useAudio()

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePlayMain = () => {
    setPlayingMain(true)
    setPlayErrorMain(false)
    const mainSection = result.split(/\n---\n/)[0] || result
    playProgression(mainSection).then(success => {
      if (!success) setPlayErrorMain(true)
      setPlayingMain(false)
    })
  }

  const handlePlayVariation = () => {
    setPlayingVariation(true)
    setPlayErrorVariation(false)
    const parts = result.split(/\n---\n/)
    const variationSection = parts.length > 1
      ? parts.slice(1).join('\n---\n')
      : parts[0]
    playProgression(variationSection).then(success => {
      if (!success) setPlayErrorVariation(true)
      setPlayingVariation(false)
    })
  }

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rootnote-${form.genre}-${form.instrument}.txt`
      .toLowerCase().replace(/\s/g, '-')
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
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let isInVariation = false
    let mainPlayShown = false
    let variationPlayShown = false

    lines.forEach((line, i) => {

      if (line.startsWith('## ')) {
        if (line.toLowerCase().includes('variation')) isInVariation = true
        elements.push(
          <h2 key={i} className="text-lg sm:text-xl font-serif font-bold text-sienna dark:text-rust mt-6 mb-2">
            {line.replace('## ', '')}
          </h2>
        )
        return
      }

      if (line.includes('Chord Names:')) {
        const showMain = !isInVariation && !mainPlayShown
        const showVariation = isInVariation && !variationPlayShown
        if (showMain) mainPlayShown = true
        if (showVariation) variationPlayShown = true
        const showButton = showMain || showVariation
        const isPlaying = isInVariation ? playingVariation : playingMain
        const hasError = isInVariation ? playErrorVariation : playErrorMain
        const handlePlay = isInVariation ? handlePlayVariation : handlePlayMain

        elements.push(
          <div key={i}>
            <p className="font-bold text-ink dark:text-cream mt-3 text-sm sm:text-base break-words">
              {line.replace(/\*\*/g, '')}
            </p>
            {showButton && (
              <div className="flex items-center gap-3 mt-3 mb-2 flex-wrap">
                <button
                  onClick={handlePlay}
                  disabled={isPlaying}
                  className="px-5 py-2 rounded-xl border-2 border-sage/70 text-sage font-semibold text-sm hover:bg-sage/10 active:bg-sage/20 transition-colors disabled:opacity-40 touch-manipulation select-none"
                >
                  {isPlaying ? '♪ Playing…' : '▶ Play Chords'}
                </button>
                {hasError && (
                  <span className="text-xs text-rust/70">
                    Tap again to unlock audio
                  </span>
                )}
              </div>
            )}
          </div>
        )
        return
      }

      if (line.includes(':**')) {
        elements.push(
          <p key={i} className="font-bold text-ink dark:text-cream mt-4 text-sm sm:text-base">
            {line.replace(/\*\*/g, '')}
          </p>
        )
        return
      }

      if (line === '---') {
        elements.push(
          <hr key={i} className="border-ink/10 dark:border-cream/10 my-5" />
        )
        return
      }

      if (line.startsWith('```') || line === '```') return

      if (/^\[Bars/.test(line)) {
        elements.push(
          <p key={i} className="text-xs font-semibold text-sienna/60 dark:text-rust/60 mt-3 mb-1 uppercase tracking-wide">
            {line}
          </p>
        )
        return
      }

      const isTab = /^[eEBGDAd]\|/.test(line) || /^\|/.test(line)
      if (isTab) {
        elements.push(
          <p key={i} className="font-mono text-xs sm:text-sm text-ink dark:text-cream whitespace-pre leading-relaxed">
            {line}
          </p>
        )
        return
      }

      elements.push(
        <p key={i} className="text-sm sm:text-base text-ink/80 dark:text-cream/80 whitespace-normal break-words leading-relaxed">
          {line || '\u00A0'}
        </p>
      )
    })

    return elements
  }

  return (
    <div className="bg-cream dark:bg-darkcard rounded-2xl shadow-md border border-sienna/20 dark:border-rust/20 p-4 sm:p-8 w-full">

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-sienna dark:text-rust">
          Your Progression
        </h2>
        <span className="text-xs text-ink/40 dark:text-cream/40 italic truncate ml-2 max-w-[45%]">
          {form.genre} · {form.instrument}
        </span>
      </div>

      <div className="bg-parchment dark:bg-darkmuted rounded-xl p-3 sm:p-5 mb-5 w-full overflow-x-auto">
        {renderOutput(result)}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={handleCopy}
          className="px-3 sm:px-4 py-2 rounded-lg border border-sienna/40 dark:border-rust/40 text-sienna dark:text-rust text-xs sm:text-sm hover:bg-sienna/10 active:bg-sienna/20 transition-colors touch-manipulation"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="px-3 sm:px-4 py-2 rounded-lg border border-sienna/40 dark:border-rust/40 text-sienna dark:text-rust text-xs sm:text-sm hover:bg-sienna/10 active:bg-sienna/20 transition-colors touch-manipulation"
        >
          Save as .txt
        </button>
        <button
          onClick={handleShare}
          className="px-3 sm:px-4 py-2 rounded-lg border border-sienna/40 dark:border-rust/40 text-sienna dark:text-rust text-xs sm:text-sm hover:bg-sienna/10 active:bg-sienna/20 transition-colors touch-manipulation"
        >
          Share
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="px-3 sm:px-4 py-2 rounded-lg border border-sage/60 text-sage text-xs sm:text-sm hover:bg-sage/10 active:bg-sage/20 transition-colors disabled:opacity-40 touch-manipulation"
        >
          {loading ? 'Regenerating…' : '↺ Regenerate'}
        </button>
        <button
          onClick={onReset}
          className="px-3 sm:px-4 py-2 rounded-lg bg-sienna dark:bg-rust text-white text-xs sm:text-sm hover:opacity-90 active:opacity-80 transition-opacity ml-auto touch-manipulation"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}
