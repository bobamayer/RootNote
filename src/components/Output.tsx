import { useState } from 'react'
import { FormData } from './Wizard'
import { useAudio } from '../hooks/useAudio'
import { ProgressionResponse, ProgressionSection } from '../types'

function formatSectionAsText(section: ProgressionSection, isVariation: boolean): string {
  return [
    `## ${section.label}`,
    '',
    `**Chord Names:** ${section.chords.map(c => c.name).join(' - ')}`,
    '',
    '**Tab:**',
    section.tab,
    '',
    `**${isVariation ? 'The Twist' : 'Why This Works'}:**`,
    section.explanation,
  ].join('\n')
}

function formatProgressionAsText(result: ProgressionResponse): string {
  return [formatSectionAsText(result.main, false), '---', formatSectionAsText(result.variation, true)].join('\n\n')
}

export default function Output({
  result, form, onReset, onRegenerate, loading
}: {
  result: ProgressionResponse
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

  const isValid = result?.main?.chords?.length > 0 && result?.variation?.chords?.length > 0

  if (!isValid) {
    return (
      <div className="bg-paper rounded-card shadow-rest border border-line p-8 text-center">
        <p className="text-moss-muted italic mb-4">
          Something went wrong generating your progression. Please try again.
        </p>
        <button
          onClick={onReset}
          className="px-6 py-2 rounded bg-teal text-paper text-sm hover:bg-teal-hover touch-manipulation"
        >
          Start Over
        </button>
      </div>
    )
  }

  const plainText = formatProgressionAsText(result)

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePlayMain = () => {
    setPlayingMain(true)
    setPlayErrorMain(false)
    playProgression(result.main.chords, form.instrument).then(success => {
      if (!success) setPlayErrorMain(true)
      setPlayingMain(false)
    })
  }

  const handlePlayVariation = () => {
    setPlayingVariation(true)
    setPlayErrorVariation(false)
    playProgression(result.variation.chords, form.instrument).then(success => {
      if (!success) setPlayErrorVariation(true)
      setPlayingVariation(false)
    })
  }

  const handleDownload = () => {
    const blob = new Blob([plainText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rootnote-${form.genre}-${form.instrument}.txt`
      .toLowerCase().replace(/\s/g, '-')
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    const text = `Check out this chord progression I made with RootNote!\n\n${plainText}`
    if (navigator.share) {
      navigator.share({ title: 'RootNote Progression', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard for sharing!')
    }
  }

  const renderSection = (
    section: ProgressionSection,
    kind: 'main' | 'variation',
    isFirst: boolean
  ) => {
    const isPlaying = kind === 'main' ? playingMain : playingVariation
    const hasError = kind === 'main' ? playErrorMain : playErrorVariation
    const handlePlay = kind === 'main' ? handlePlayMain : handlePlayVariation

    return (
      <div key={kind}>
        <h2 className={`text-lg sm:text-xl font-serif font-semibold text-teal mb-2 ${isFirst ? '' : 'mt-6'}`}>
          {section.label}
        </h2>

        <p className="font-semibold text-moss mt-3 text-sm sm:text-base break-words">
          Chord Names: {section.chords.map(c => c.name).join(' - ')}
        </p>

        <div className="flex items-center gap-3 mt-3 mb-2 flex-wrap">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-5 py-2 rounded border-[1.5px] border-plum text-plum font-medium text-sm hover:bg-tag-plum-bg transition-colors disabled:opacity-40 touch-manipulation select-none"
          >
            {isPlaying ? '♪ Playing…' : '▶ Play Chords'}
          </button>
          {hasError && (
            <span className="text-xs text-brick">
              Tap again to unlock audio
            </span>
          )}
        </div>

        <p className="font-semibold text-moss mt-4 text-sm sm:text-base">Tab:</p>
        <pre className="font-mono text-xs sm:text-sm text-moss whitespace-pre leading-relaxed overflow-x-auto mt-1">
          {section.tab}
        </pre>

        <p className="font-semibold text-moss mt-4 text-sm sm:text-base">
          {kind === 'main' ? 'Why This Works:' : 'The Twist:'}
        </p>
        <p className="text-sm sm:text-base text-moss-muted whitespace-normal break-words leading-relaxed">
          {section.explanation}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-paper rounded-card shadow-rest border border-line p-4 sm:p-8 w-full">

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-serif font-semibold text-teal">
          Your Progression
        </h2>
        <span className="text-xs text-moss-muted italic truncate ml-2 max-w-[45%]">
          {form.genre} · {form.instrument}
        </span>
      </div>

      <div className="bg-fog rounded p-3 sm:p-5 mb-5 w-full overflow-x-auto">
        {renderSection(result.main, 'main', true)}
        <hr className="border-line my-5" />
        {renderSection(result.variation, 'variation', false)}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={handleCopy}
          className="px-3 sm:px-4 py-2 rounded border border-line-strong text-moss text-xs sm:text-sm hover:bg-fog transition-colors touch-manipulation"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="px-3 sm:px-4 py-2 rounded border border-line-strong text-moss text-xs sm:text-sm hover:bg-fog transition-colors touch-manipulation"
        >
          Save as .txt
        </button>
        <button
          onClick={handleShare}
          className="px-3 sm:px-4 py-2 rounded border border-line-strong text-moss text-xs sm:text-sm hover:bg-fog transition-colors touch-manipulation"
        >
          Share
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="px-3 sm:px-4 py-2 rounded border-[1.5px] border-plum text-plum text-xs sm:text-sm hover:bg-tag-plum-bg transition-colors disabled:opacity-40 touch-manipulation"
        >
          {loading ? 'Regenerating…' : '↺ Regenerate'}
        </button>
        <button
          onClick={onReset}
          className="px-3 sm:px-4 py-2 rounded bg-teal text-paper text-xs sm:text-sm hover:bg-teal-hover transition-colors ml-auto touch-manipulation"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

