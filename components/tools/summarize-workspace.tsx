import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles, Download } from 'lucide-react'
import { exportTextToDocx, exportTextToPdf } from '@/lib/tools-docs'
import type { Tone } from '@/components/tools/tool-types'

export function SummarizeWorkspace({
  notes,
  setNotes,
  summary,
  setSummary,
  tone,
  setTone,
  loading,
  onRun,
}: {
  notes: string
  setNotes: (v: string) => void
  summary: string
  setSummary: (v: string) => void
  tone: Tone
  setTone: (t: Tone) => void
  loading: boolean
  onRun: () => void
}) {
  const canRun = notes.trim().length > 5

  return (
    <Card className="p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-56"
            placeholder="Paste meeting notes, brainstorms, research…"
          />
        </div>
        <div>
          <Label>Summary</Label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-h-56"
            placeholder="Your summary will appear here…"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onRun} disabled={!canRun || loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Summarize ({tone})
        </Button>
        <Button
          variant="outline"
          onClick={() => setTone(tone === 'short' ? 'detailed' : 'short')}
        >
          Toggle tone
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => exportTextToPdf(summary || notes, 'summary.pdf')}
          disabled={!(summary || notes)}
        >
          <Download className="w-4 h-4" /> PDF
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => exportTextToDocx(summary || notes, 'summary.docx')}
          disabled={!(summary || notes)}
        >
          <Download className="w-4 h-4" /> DOCX
        </Button>
      </div>
    </Card>
  )
}

