import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'

export function PdfWorkspace({
  pdfFile,
  setPdfFile,
  textToAdd,
  setTextToAdd,
  mergeFiles,
  setMergeFiles,
  splitFile,
  setSplitFile,
  redactFile,
  setRedactFile,
  onStamp,
  onMerge,
  onSplit,
  onRedact,
}: {
  pdfFile: File | null
  setPdfFile: (f: File | null) => void
  textToAdd: string
  setTextToAdd: (v: string) => void
  mergeFiles: FileList | null
  setMergeFiles: (v: FileList | null) => void
  splitFile: File | null
  setSplitFile: (v: File | null) => void
  redactFile: File | null
  setRedactFile: (v: File | null) => void
  onStamp: () => void
  onMerge: () => void
  onSplit: () => void
  onRedact: () => void
}) {
  return (
    <Card className="p-6 space-y-4">
      <div className="font-semibold">PDF editor (basic)</div>
      <div className="text-sm text-muted-foreground">
        This MVP supports stamp text, merge, split, and a simple redact block on page 1.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Upload PDF</Label>
          <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
        </div>
        <div className="space-y-2">
          <Label>Text to add</Label>
          <Input value={textToAdd} onChange={(e) => setTextToAdd(e.target.value)} />
        </div>
      </div>

      <Button onClick={onStamp} disabled={!pdfFile} className="gap-2">
        <Download className="w-4 h-4" />
        Download edited PDF
      </Button>

      <Separator />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Merge PDFs (choose 2+)</Label>
          <Input type="file" multiple accept="application/pdf" onChange={(e) => setMergeFiles(e.target.files)} />
          <Button variant="outline" onClick={onMerge} disabled={!mergeFiles || mergeFiles.length < 2}>
            Merge and download
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Split PDF (download first 5 pages)</Label>
          <Input type="file" accept="application/pdf" onChange={(e) => setSplitFile(e.target.files?.[0] ?? null)} />
          <Button variant="outline" onClick={onSplit} disabled={!splitFile}>
            Split and download
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Redact PDF (simple top-bar on page 1)</Label>
        <Input type="file" accept="application/pdf" onChange={(e) => setRedactFile(e.target.files?.[0] ?? null)} />
        <Button variant="outline" onClick={onRedact} disabled={!redactFile}>
          Redact and download
        </Button>
      </div>
    </Card>
  )
}

