'use client'

import { Card } from '@/components/ui/card'

export default function PrivacyPage() {
  const COMPANY_NAME = 'GossipOffice'
  const CONTACT_EMAIL = 'privacy@example.com' // TODO: replace with your real email
  const JURISDICTION = 'South Africa' // TODO: replace
  const EFFECTIVE_DATE = '2026-05-08' // TODO: replace

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Privacy</h1>
          <p className="text-muted-foreground">
            How {COMPANY_NAME} handles your data. Effective {EFFECTIVE_DATE}. Jurisdiction: {JURISDICTION}.
          </p>
        </div>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Summary</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {COMPANY_NAME} is a local-first app. Most of your content (resumes, documents, slides, notes, diagrams) is stored
            in your browser on your device. We do not require accounts for basic use.
          </div>
          <div className="text-sm text-muted-foreground">
            If you clear site data / browser storage, your local files may be removed. Use Files → Export Backup and regular exports (PDF/DOCX/PPTX).
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">AI requests (Groq)</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            When you use AI features (GossipAI, generate resume, cover letter, summaries, reports, slides), the text you
            provide is sent to the configured AI provider (Groq) to generate an answer. Groq acts as a third-party processor
            for the text you submit. The server reads the <span className="font-medium">GROQ_API_KEY</span> from environment variables.
          </div>
          <div className="text-sm text-muted-foreground">
            Do not send highly sensitive personal data unless you understand and accept the risks of third‑party processing.
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">What we collect</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            This deployment may collect limited operational data for reliability and abuse prevention (e.g., server logs for API requests).
            We do not intentionally log your full document contents, but you should assume that prompts sent to AI endpoints can be present in server-side troubleshooting context if an error occurs.
          </div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Local content: stored on your device (your browser storage).</li>
            <li>AI prompts: sent to Groq when you use AI features.</li>
            <li>Operational logs: request metadata (route, timing, status, request id) for `/api/ai/*`.</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Your choices</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>You can avoid AI features entirely and use the app offline (except exports that require the UI).</li>
            <li>You can delete local data by clearing site data in your browser.</li>
            <li>You can export/import backups from the Files page.</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Contact</div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            Questions about this policy: <span className="font-medium">{CONTACT_EMAIL}</span>
          </div>
        </Card>
      </div>
    </main>
  )
}

