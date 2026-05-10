'use client'

import { Card } from '@/components/ui/card'

export default function CookiesPage() {
  const COMPANY_NAME = 'GossipOffice'
  const EFFECTIVE_DATE = '2026-05-08' // TODO: replace

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Cookies</h1>
          <p className="text-muted-foreground">
            Cookie and local storage usage for {COMPANY_NAME}. Effective {EFFECTIVE_DATE}.
          </p>
        </div>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Storage used by GossipOffice</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            GossipOffice uses browser storage (local storage / indexed storage via your app state persistence) to save your
            Files locally. We don’t require third-party tracking cookies to use the app.
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Clearing site data</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            If you clear cookies/site data for GossipOffice, your locally saved documents may be removed. If you want backups,
            export important files as PDF/DOCX/PPTX.
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Third‑party cookies</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {COMPANY_NAME} does not intentionally set third‑party tracking cookies. Embedded tools (such as diagrams.net) may
            set their own cookies depending on their policies and your browser settings.
          </div>
        </Card>
      </div>
    </main>
  )
}

