'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('global_error', { message: error.message, digest: error.digest })
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-12">
          <h1 className="text-balance text-2xl font-semibold">GossipOffice crashed</h1>
          <p className="text-sm text-muted-foreground">Try reloading. If it keeps happening, clear the site data or import a backup.</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => reset()}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Reload
            </button>
            <a
              href="/files"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Go to Files
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}

