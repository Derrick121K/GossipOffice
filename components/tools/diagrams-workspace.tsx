import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

type DrawIoMsg =
  | { event: 'init' }
  | { event: 'load' }
  | { event: 'save'; xml: string }
  | { event: 'export'; data: string; format?: string }
  | { event: 'exit' }
  | { event: string; [k: string]: any }

function safeParseMessage(data: any): DrawIoMsg | null {
  if (typeof data !== 'string') return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

function defaultBlankDiagramXml() {
  // Minimal blank draw.io document
  return [
    '<mxfile host="app.diagrams.net" modified="2026-01-01T00:00:00.000Z" agent="GossipOffice" version="22.1.0">',
    '  <diagram id="diagram-1" name="Page-1">',
    '    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">',
    '      <root>',
    '        <mxCell id="0" />',
    '        <mxCell id="1" parent="0" />',
    '      </root>',
    '    </mxGraphModel>',
    '  </diagram>',
    '</mxfile>',
  ].join('\n')
}

export type DiagramsWorkspaceHandle = {
  syncXml: () => void
  exportPng: () => void
  exportSvg: () => void
  newDiagram: () => void
  loadXml: (xml: string) => void
}

type DiagramsWorkspaceProps = {
  title: string
  setTitle: (v: string) => void
  xml: string
  setXml: (v: string) => void
  onRequestSaveToFiles: () => void
  onExportAsset?: (format: 'png' | 'svg', dataUri: string) => void
}

export const DiagramsWorkspace = forwardRef<DiagramsWorkspaceHandle, DiagramsWorkspaceProps>(function DiagramsWorkspaceInner({
  title,
  setTitle,
  xml,
  setXml,
  onRequestSaveToFiles,
  onExportAsset,
}, ref) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [ready, setReady] = useState(false)
  const [lastExportXml, setLastExportXml] = useState<string | null>(null)

  const src = useMemo(() => {
    // diagrams.net embed mode (proto=json enables postMessage JSON)
    const url = new URL('https://embed.diagrams.net/')
    url.searchParams.set('embed', '1')
    url.searchParams.set('spin', '1')
    url.searchParams.set('proto', 'json')
    url.searchParams.set('ui', 'atlas')
    url.searchParams.set('libraries', '1')
    url.searchParams.set('noExitBtn', '1')
    return url.toString()
  }, [])

  const post = (payload: any) => {
    const w = iframeRef.current?.contentWindow
    if (!w) return
    w.postMessage(JSON.stringify(payload), '*')
  }

  const loadIntoEditor = (xmlToLoad: string) => {
    post({ action: 'load', xml: xmlToLoad || defaultBlankDiagramXml() })
  }

  const requestExportXml = () => {
    // Ask editor to export current diagram. We prefer xml.
    post({ action: 'export', format: 'xml', spin: '1' })
  }

  const requestExportPng = () => post({ action: 'export', format: 'png', spin: '1', bg: 'transparent' })
  const requestExportSvg = () => post({ action: 'export', format: 'svg', spin: '1' })

  const requestNew = () => loadIntoEditor(defaultBlankDiagramXml())

  useImperativeHandle(ref, () => ({
    syncXml: requestExportXml,
    exportPng: requestExportPng,
    exportSvg: requestExportSvg,
    newDiagram: requestNew,
    loadXml: (x: string) => loadIntoEditor(x || defaultBlankDiagramXml()),
  }), [])

  useEffect(() => {
    const onMessage = (evt: MessageEvent) => {
      const msg = safeParseMessage(evt.data)
      if (!msg) return

      if (msg.event === 'init') {
        setReady(true)
        loadIntoEditor(xml)
        return
      }

      if (msg.event === 'save' && typeof (msg as any).xml === 'string') {
        setXml((msg as any).xml)
        setLastExportXml((msg as any).xml)
        return
      }

      if (msg.event === 'export') {
        const data = (msg as any).data
        const format = String((msg as any).format || '').toLowerCase()
        if (typeof data !== 'string' || !data.trim()) return

        // For xml exports, data is plain xml. For png/svg, it's usually a data URI.
        if (data.trim().startsWith('<mxfile')) {
          setXml(data)
          setLastExportXml(data)
          return
        }

        if ((format === 'png' || format === 'svg') && data.startsWith('data:')) {
          onExportAsset?.(format as 'png' | 'svg', data)
        }
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [xml])

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
          <div className="space-y-2">
            <Label>Diagram title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., System architecture" />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => {
                requestExportXml()
              }}
              disabled={!ready}
            >
              <RefreshCw className="w-4 h-4" />
              Sync from editor
            </Button>
            <Button
              type="button"
              className="gap-2"
              onClick={() => {
                // ensure we pull the latest from the editor before saving
                requestExportXml()
                // save current xml (or last export if provided a moment later)
                setTimeout(() => onRequestSaveToFiles(), 150)
              }}
              disabled={!ready}
            >
              Save to Files
            </Button>
          </div>
        </div>
        {lastExportXml ? (
          <div className="mt-3 text-xs text-muted-foreground">
            Latest sync captured. You can save any time.
          </div>
        ) : (
          <div className="mt-3 text-xs text-muted-foreground">
            Tip: Use “Sync from editor” before saving if you’ve made changes.
          </div>
        )}
      </Card>

      <div className="rounded-xl overflow-hidden border border-border bg-card">
        <div className="h-[70vh] min-h-[520px]">
          <iframe
            ref={iframeRef}
            src={src}
            title="Diagrams"
            className="w-full h-full"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </div>
  )
})

