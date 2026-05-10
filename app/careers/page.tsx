'use client'

import { Card } from '@/components/ui/card'

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Careers</h1>
          <p className="text-muted-foreground">
            Help build a fast, local-first office suite with an Office-like UI and AI-assisted workflows.
          </p>
        </div>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Open roles</div>
          <div className="text-sm text-muted-foreground">
            We’re not actively hiring through this demo yet, but these are the roles we expect to open:
          </div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Frontend Engineer (Next.js, Tailwind, interaction polish)</li>
            <li>Full-stack Engineer (AI routes, exports, file workflows)</li>
            <li>Product Designer (Office-like UI/UX, accessibility, systems)</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="font-semibold">How to apply</div>
          <div className="text-sm text-muted-foreground">
            Add an email or application form on the Contact page when you’re ready. For now, this page is functional and
            ready to be connected.
          </div>
        </Card>
      </div>
    </main>
  )
}

