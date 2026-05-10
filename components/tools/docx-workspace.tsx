import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Download } from 'lucide-react'
import { exportTextToDocx, exportTextToPdf } from '@/lib/tools-docs'

export function DocxWorkspace({
  text,
  setText,
  loading,
  onImportClick,
  onFilePicked,
}: {
  text: string
  setText: (v: string) => void
  loading: boolean
  onImportClick: () => void
  onFilePicked: (f: File) => void
}) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div>
          <div className="font-semibold">DOCX editor (simple)</div>
          <div className="text-sm text-muted-foreground">Import DOCX → edit text → export DOCX/PDF.</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" disabled={loading} onClick={onImportClick}>
            <Upload className="w-4 h-4" /> Import DOCX
          </Button>
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-72"
        placeholder="Imported DOCX text will appear here…"
      />

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2" onClick={() => exportTextToDocx(text, 'edited.docx')} disabled={!text}>
          <Download className="w-4 h-4" /> Export DOCX
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => exportTextToPdf(text, 'edited.pdf')} disabled={!text}>
          <Download className="w-4 h-4" /> Export PDF
        </Button>
      </div>

      <input
        id="docx-input"
        type="file"
        accept=".docx"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFilePicked(f)
        }}
      />
    </Card>
  )
}

