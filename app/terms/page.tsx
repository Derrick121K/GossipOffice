'use client'

import { Card } from '@/components/ui/card'

export default function TermsPage() {
  const COMPANY_NAME = 'GossipOffice'
  const CONTACT_EMAIL = 'legal@example.com' // TODO: replace
  const JURISDICTION = 'South Africa' // TODO: replace
  const EFFECTIVE_DATE = '2026-05-08' // TODO: replace

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Terms</h1>
          <p className="text-muted-foreground">
            Terms of use for {COMPANY_NAME}. Effective {EFFECTIVE_DATE}. Jurisdiction: {JURISDICTION}.
          </p>
        </div>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Use at your own risk</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {COMPANY_NAME} is provided “as-is” without warranties. You are responsible for reviewing, editing, and verifying
            any content you generate, import, or export.
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">AI-generated content</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            AI outputs may be inaccurate or incomplete. Do not submit AI-generated work without checking facts, dates,
            employers, and claims. Avoid pasting sensitive personal or confidential information into AI prompts.
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Acceptable use</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Do not use the app to generate harmful, illegal, or deceptive content.</li>
            <li>Do not attempt to abuse AI endpoints or automate excessive requests.</li>
            <li>Respect copyright when importing or copying text into documents.</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Local storage & backups</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            Files are stored in your browser. Clearing site data can delete your files. You are responsible for maintaining your own backups
            using Files → Export Backup and document exports.
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Contact</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            Legal questions: <span className="font-medium">{CONTACT_EMAIL}</span>
          </div>
        </Card>
      </div>
    </main>
  )
}

