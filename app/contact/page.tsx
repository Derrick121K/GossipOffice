'use client'

import { Card } from '@/components/ui/card'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-muted-foreground">Support, feedback, and feature requests.</p>
        </div>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Support</div>
          <div className="text-sm text-muted-foreground">
            If something is broken (exports, templates, AI), include what you clicked and the exact error message.
          </div>
          <div className="text-sm text-muted-foreground">
            Suggested support email: <span className="font-medium">support@gossipoffice.app</span> (replace with yours).
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Feedback</div>
          <div className="text-sm text-muted-foreground">
            Tell us what workflow you want to feel “exactly like Office” and what is missing (ribbon command, layout, shortcut).
          </div>
          <div className="text-sm text-muted-foreground">
            If you’re reporting an AI issue, also mention which tool you used (Notes/Word/PowerPoint/Excel/Visio) and whether
            Groq is configured.
          </div>
        </Card>
      </div>
    </main>
  )
}

