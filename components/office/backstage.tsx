'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Download, FileText, FolderOpen, Printer, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ToolId } from '@/components/tools/tool-types'

type BackstageTab = 'info' | 'open' | 'saveas' | 'export' | 'print'

export function Backstage({
  open,
  onOpenChange,
  tool,
  canSave,
  onSave,
  onExportPdf,
  onExportDocx,
  onExportPptx,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  tool: ToolId
  canSave: boolean
  onSave?: () => void
  onExportPdf?: () => void
  onExportDocx?: () => void
  onExportPptx?: () => void
}) {
  const [tab, setTab] = useState<BackstageTab>('info')

  const title = useMemo(() => {
    if (tool === 'slides') return 'PowerPoint'
    if (tool === 'sheet') return 'Excel'
    if (tool === 'report') return 'Word'
    if (tool === 'summarize') return 'Notes'
    if (tool === 'diagrams') return 'Visio'
    return 'Office Tools'
  }, [tool])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] p-0 sm:max-w-[calc(100vw-4rem)] sm:h-[calc(100vh-4rem)]"
        showCloseButton
      >
        <div className="h-full grid grid-cols-1 md:grid-cols-[240px_1fr]">
          <aside className="border-b md:border-b-0 md:border-r border-border bg-card/40 p-3">
            <div className="text-sm font-semibold mb-3">File</div>
            <div className="space-y-1">
              {[
                { id: 'info', label: 'Info', icon: FileText },
                { id: 'open', label: 'Open', icon: FolderOpen },
                { id: 'saveas', label: 'Save', icon: Save },
                { id: 'export', label: 'Export', icon: Download },
                { id: 'print', label: 'Print', icon: Printer },
              ].map((t) => {
                const Icon = t.icon
                const active = tab === (t.id as BackstageTab)
                return (
                  <Button
                    key={t.id}
                    type="button"
                    variant={active ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                    onClick={() => setTab(t.id as BackstageTab)}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </Button>
                )
              })}
            </div>

            <Separator className="my-3" />

            <Link href="/files">
              <Button type="button" variant="outline" className="w-full justify-start gap-2" onClick={() => onOpenChange(false)}>
                <FolderOpen className="w-4 h-4" />
                Browse Files
              </Button>
            </Link>
          </aside>

          <main className="p-4 sm:p-6 overflow-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                Use the left panel for File actions (Info, Open, Save, Export, Print). Press Escape to close.
              </DialogDescription>
            </DialogHeader>

            {tab === 'info' ? (
              <Card className="p-4 mt-4 space-y-2">
                <div className="font-semibold">Document info</div>
                <div className="text-sm text-muted-foreground">
                  Use the ribbon for commands. Use Copilot to prompt and apply changes.
                </div>
              </Card>
            ) : null}

            {tab === 'open' ? (
              <Card className="p-4 mt-4 space-y-2">
                <div className="font-semibold">Open</div>
                <div className="text-sm text-muted-foreground">
                  Open existing work from Files.
                </div>
                <Link href="/files">
                  <Button type="button" className="gap-2" onClick={() => onOpenChange(false)}>
                    <FolderOpen className="w-4 h-4" />
                    Open Files
                  </Button>
                </Link>
              </Card>
            ) : null}

            {tab === 'saveas' ? (
              <Card className="p-4 mt-4 space-y-2">
                <div className="font-semibold">Save</div>
                <div className="text-sm text-muted-foreground">
                  Saves to your local Files (browser storage).
                </div>
                <Button type="button" onClick={onSave} disabled={!canSave || !onSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </Card>
            ) : null}

            {tab === 'export' ? (
              <Card className="p-4 mt-4 space-y-3">
                <div className="font-semibold">Export</div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={onExportPdf} disabled={!onExportPdf}>
                    Export PDF
                  </Button>
                  <Button type="button" variant="outline" onClick={onExportDocx} disabled={!onExportDocx}>
                    Export DOCX
                  </Button>
                  <Button type="button" variant="outline" onClick={onExportPptx} disabled={!onExportPptx}>
                    Export PPTX
                  </Button>
                </div>
              </Card>
            ) : null}

            {tab === 'print' ? (
              <Card className="p-4 mt-4 space-y-2">
                <div className="font-semibold">Print</div>
                <div className="text-sm text-muted-foreground">
                  Printing support can be added next (preview + browser print).
                </div>
              </Card>
            ) : null}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}

