'use client'

interface ErrorProps {
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="container mx-auto p-8">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
