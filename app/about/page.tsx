'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">About GossipOffice</h1>
          <p className="text-muted-foreground">
            GossipOffice is a free, local-first office suite for resumes, documents, reports, slides, sheets, and diagrams —
            with AI help when you want it.
          </p>
        </div>

        <Card className="p-6 space-y-3">
          <div className="font-semibold">Why GossipOffice exists</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most “office” tools are either too heavy, too expensive, or require accounts and cloud storage. GossipOffice is
            designed to feel familiar like Office, but stay fast and simple — and keep your files on your device by default.
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 space-y-2">
            <div className="font-semibold">What you can do</div>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Build a CV and cover letter (PDF/DOCX exports)</li>
              <li>Write documents and generate reports</li>
              <li>Create modern slide decks (PPTX)</li>
              <li>Edit sheets (CSV + basic formulas)</li>
              <li>Draw diagrams (draw.io / diagrams.net embed)</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="font-semibold">How your data is handled</div>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Saved locally in your browser (Files page)</li>
              <li>No account required</li>
              <li>AI runs only when you click it</li>
              <li>AI requests send only the text you provide to the configured provider</li>
            </ul>
          </Card>
        </div>

        <div className="flex gap-2">
          <Link href="/files"><Button>Open Files</Button></Link>
          <Link href="/tools"><Button variant="outline">Open Office Tools</Button></Link>
        </div>
      </div>
    </main>
  )
}

