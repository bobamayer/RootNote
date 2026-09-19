import Wizard from './components/Wizard'

export default function App() {
  return (
    <div className="min-h-screen bg-fog text-moss">
      <main className="flex flex-col items-center justify-start py-8 sm:py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-teal mb-2">
              RootNote
            </h1>
            <p className="text-moss-muted text-base sm:text-lg">
              Start with a feeling, end with a chord.
            </p>
          </div>
          <Wizard />
        </div>
      </main>
    </div>
  )
}
