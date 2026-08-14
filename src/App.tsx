import { Button } from './components/Button'

export function App() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-24 bg-bg-subtle p-32">
      <h1 className="type-title-small text-text-primary">
        LG Electronics Practice
      </h1>
      <p className="type-body-small text-text-tertiary">
        Vite 6 · React 19 · TypeScript 5 · Tailwind CSS v4 · Storybook 8
      </p>
      <Button onClick={() => console.log('clicked')}>Get started</Button>
    </main>
  )
}
