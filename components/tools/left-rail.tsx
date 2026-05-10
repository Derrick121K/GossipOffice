import Link from 'next/link'
import { useMemo } from 'react'
import { FileText, Presentation, Table2, FileDown, FileSignature, Shapes, Sparkles, ScrollText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { ToolId } from '@/components/tools/tool-types'
import type { OfficeDocument } from '@/lib/store'

const toolItems: { id: ToolId; label: string; icon: any; hint: string }[] = [
  { id: 'summarize', label: 'Notes', icon: Sparkles, hint: 'Turn notes into clean summaries' },
  { id: 'report', label: 'Word', icon: ScrollText, hint: 'Write structured documents and reports' },
  { id: 'slides', label: 'PowerPoint', icon: Presentation, hint: 'Create modern PPTX decks' },
  { id: 'sheet', label: 'Excel', icon: Table2, hint: 'Edit sheets with formulas' },
  { id: 'docx', label: 'DOCX', icon: FileSignature, hint: 'Import → edit → export' },
  { id: 'pdf', label: 'PDF', icon: FileDown, hint: 'Stamp, merge, split, redact' },
  { id: 'diagrams', label: 'Visio', icon: Shapes, hint: 'Create draw.io diagrams' },
]

function docIcon(type: string) {
  if (type === 'slides') return <Presentation className="w-4 h-4" />
  if (type === 'sheet') return <Table2 className="w-4 h-4" />
  if (type === 'diagram') return <Shapes className="w-4 h-4" />
  return <FileText className="w-4 h-4" />
}

export function ToolsLeftRail({
  activeTool,
  onToolChange,
  documents,
  query,
  onQueryChange,
}: {
  activeTool: ToolId
  onToolChange: (t: ToolId) => void
  documents: OfficeDocument[]
  query: string
  onQueryChange: (v: string) => void
}) {
  const q = query.trim().toLowerCase()
  const recent = useMemo(() => {
    if (!q) return documents.slice(0, 8)
    return documents
      .filter((d) => d.title.toLowerCase().includes(q) || d.type.toLowerCase().includes(q))
      .slice(0, 8)
  }, [documents, q])
  const activeHint = useMemo(() => toolItems.find((t) => t.id === activeTool)?.hint ?? '', [activeTool])
  const filteredTools = useMemo(() => {
    if (!q) return toolItems
    return toolItems.filter((t) => t.label.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q))
  }, [q])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">Office Tools</div>
          <div className="text-xs text-muted-foreground truncate">Office-style workspace</div>
        </div>
      </div>

      <Input
        placeholder="Search tools/files…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <Card className="p-2">
        <div className="text-xs text-muted-foreground px-2 py-1">Tools</div>
        <div className="space-y-1">
          {filteredTools.map((it) => {
            const Icon = it.icon
            const active = it.id === activeTool
            return (
              <Button
                key={it.id}
                type="button"
                variant={active ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => onToolChange(it.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{it.label}</span>
              </Button>
            )
          })}
          {filteredTools.length === 0 && (
            <div className="px-2 py-2 text-xs text-muted-foreground">
              No matching tools.
            </div>
          )}
        </div>
      </Card>

      {activeHint ? (
        <div className="text-xs text-muted-foreground px-1">
          {activeHint}
        </div>
      ) : null}

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Recent</div>
          <Link href="/files" className="text-xs text-primary hover:underline">
            Open Files
          </Link>
        </div>

        <div className="space-y-1">
          {recent.map((d) => (
            <Link
              key={d.id}
              href={`/tools?open=${encodeURIComponent(d.id)}`}
              className="block"
            >
              <div className="rounded-lg border border-border p-2 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-2">
                  {docIcon(d.type)}
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{d.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {d.type} • {new Date(d.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {documents.length === 0 && (
            <div className="text-xs text-muted-foreground">No files yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

