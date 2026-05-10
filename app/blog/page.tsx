'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const posts = [
  {
    slug: 'welcome-to-gossipoffice',
    title: 'Welcome to GossipOffice',
    date: '2026-05-08',
    summary: 'What GossipOffice is, what it replaces, and what we’re building next.',
  },
  {
    slug: 'office-tools-gossipai',
    title: 'Office Tools + GossipAI',
    date: '2026-05-08',
    summary: 'How the Office-style ribbon, Backstage, and GossipAI prompting work together.',
  },
  {
    slug: 'local-first-files',
    title: 'Local-first Files (no accounts)',
    date: '2026-05-08',
    summary: 'Why keeping your documents in your browser is fast and privacy-friendly.',
  },
] as const

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">Updates, tips, and release notes.</p>
        </div>

        <div className="space-y-4">
          {posts.map((p) => (
            <Card key={p.slug} className="p-6 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.date}</div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Read
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{p.summary}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6 text-sm text-muted-foreground">
          Want real posts here (with full pages per article)? Tell me and I’ll add a simple blog routing structure.
          For now, these are release-note style summaries.
        </Card>

        <div className="flex gap-2">
          <Link href="/tools"><Button>Open Office Tools</Button></Link>
          <Link href="/files"><Button variant="outline">Open Files</Button></Link>
        </div>
      </div>
    </main>
  )
}

