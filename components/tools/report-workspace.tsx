import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Download, FileText, Loader2 } from 'lucide-react'
import { exportTextToDocx, exportTextToPdf } from '@/lib/tools-docs'

export function ReportWorkspace({
  topic,
  setTopic,
  inputs,
  setInputs,
  report,
  setReport,
  loading,
  onRun,
}: {
  topic: string
  setTopic: (v: string) => void
  inputs: string
  setInputs: (v: string) => void
  report: string
  setReport: (v: string) => void
  loading: boolean
  onRun: () => void
}) {
  const canRun = topic.trim().length > 2 || inputs.trim().length > 5

  return (
    <Card className="p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <Label>Topic</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Monthly sales performance"
            />
          </div>
          <div>
            <Label>Inputs / data</Label>
            <Textarea
              value={inputs}
              onChange={(e) => setInputs(e.target.value)}
              className="min-h-48"
              placeholder="Paste facts, numbers, constraints…"
            />
          </div>
          <Button onClick={onRun} disabled={!canRun || loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Create report
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Report</Label>
          <Textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
            className="min-h-[22rem]"
            placeholder="Generated report…"
          />
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => exportTextToPdf(report, 'report.pdf')} disabled={!report}>
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => exportTextToDocx(report, 'report.docx')} disabled={!report}>
              <Download className="w-4 h-4" /> DOCX
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

