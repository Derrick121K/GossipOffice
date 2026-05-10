import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { exportTextToDocx, exportTextToPdf } from '@/lib/tools-docs'
import { SheetGrid } from '@/components/tools/sheet-grid'
import toast from 'react-hot-toast'

export function SheetWorkspace({
  title,
  setTitle,
  csv,
  setCsv,
  onSave,
}: {
  title: string
  setTitle: (v: string) => void
  csv: string
  setCsv: (v: string) => void
  onSave: () => void
}) {
  const canSheet = csv.trim().length > 0

  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="font-semibold">Sheets (CSV-based MVP)</div>
          <div className="text-sm text-muted-foreground">Paste or edit CSV, then export or save to Files.</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => {
              onSave()
              toast.success('Saved to Files')
            }}
            disabled={!canSheet}
          >
            Save
          </Button>
          <Button variant="outline" onClick={() => exportTextToDocx(csv, 'sheet.docx')} disabled={!canSheet}>
            Export DOCX
          </Button>
          <Button variant="outline" onClick={() => exportTextToPdf(csv, 'sheet.pdf')} disabled={!canSheet}>
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sheet title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Label>CSV</Label>
          <Textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            className="min-h-72 font-mono text-sm"
            placeholder="Header1,Header2\nA,1\nB,2"
          />
        </div>
        <div className="space-y-2">
          <Label>Grid (editable)</Label>
          <SheetGrid csv={csv} onCsvChange={setCsv} />
          <div className="text-xs text-muted-foreground">
            Tip: You can type formulas like <span className="font-medium">=A2+B2</span> or <span className="font-medium">SUM(B2:B10)</span>.
          </div>
        </div>
      </div>
    </Card>
  )
}

