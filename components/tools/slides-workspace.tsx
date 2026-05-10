import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles } from 'lucide-react'
import type { SlideTheme } from '@/lib/tools-slides'

export function SlidesWorkspace({
  title,
  setTitle,
  outline,
  setOutline,
  theme,
  setTheme,
  loading,
  onRun,
}: {
  title: string
  setTitle: (v: string) => void
  outline: string
  setOutline: (v: string) => void
  theme: SlideTheme
  setTheme: (t: SlideTheme) => void
  loading: boolean
  onRun: () => void
}) {
  const canRun = title.trim().length > 1 && outline.trim().length > 5

  const previewLines = outline
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 12)

  return (
    <Card className="p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <Label>Deck title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Q2 Strategy Update" />
          </div>
          <div>
            <Label>Theme</Label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant={theme === 'modernBlue' ? 'default' : 'outline'} onClick={() => setTheme('modernBlue')}>Modern Blue</Button>
              <Button type="button" size="sm" variant={theme === 'darkPro' ? 'default' : 'outline'} onClick={() => setTheme('darkPro')}>Dark Pro</Button>
              <Button type="button" size="sm" variant={theme === 'minimalLight' ? 'default' : 'outline'} onClick={() => setTheme('minimalLight')}>Minimal</Button>
            </div>
          </div>
          <div>
            <Label>Outline / notes</Label>
            <Textarea value={outline} onChange={(e) => setOutline(e.target.value)} className="min-h-56" placeholder="- Problem\n- Solution\n- Timeline\n- Metrics…" />
          </div>
          <Button onClick={onRun} disabled={!canRun || loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Create modern slides (PPTX)
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Preview (first lines)</Label>
          <Card className="p-4 text-sm text-muted-foreground">
            {previewLines.length ? previewLines.map((l, i) => <div key={i}>{l}</div>) : 'Add an outline to preview.'}
          </Card>
        </div>
      </div>
    </Card>
  )
}

