import Wizard from './components/Wizard'

export default function App() {
  return (
    <div className="min-h-screen bg-parchment dark:bg-darkbg text-ink dark:text-cream transition-colors">
      <main className="flex flex-col items-center justify-start py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-sienna dark:text-rust mb-2">
              RootNote
            </h1>
            <p className="text-ink/60 dark:text-cream/50 italic text-lg">
              Start with a feeling, end with a chord.
            </p>
          </div>
          <Wizard />
        </div>
      </main>
    </div>
  )
}
