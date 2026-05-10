'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('route_error', { message: error.message, digest: error.digest })
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center gap-4 px-6 py-12">
      <h1 className="text-balance text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        An unexpected error occurred while rendering this page. You can try again or return to the home page.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => reset()}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          Go home
        </a>
      </div>
    </div>
  )
}

