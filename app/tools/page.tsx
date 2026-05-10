'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Download, FileDown, Menu, Save, Sparkles } from 'lucide-react'

import { exportTextToDocx, exportTextToPdf, extractDocxToText, editPdfAddText, mergePdfs, splitPdf, redactPdf } from '@/lib/tools-docs'
import { exportSlidesPptx, SlideTheme } from '@/lib/tools-slides'
import { useCV } from '@/lib/store'

import { OfficeShell } from '@/components/office/office-shell'
import { Ribbon, RibbonTab } from '@/components/office/ribbon'
import { CommandPalette } from '@/components/office/command-palette'
import { OfficeStatusBar, OfficeTopChrome } from '@/components/office/office-chrome'
import { CopilotPane } from '@/components/office/copilot-pane'
import { Backstage } from '@/components/office/backstage'
import { ToolsLeftRail } from '@/components/tools/left-rail'
import type { ToolId, Tone } from '@/components/tools/tool-types'
import { aiPost } from '@/components/tools/ai-post'
import { SummarizeWorkspace } from '@/components/tools/summarize-workspace'
import { ReportWorkspace } from '@/components/tools/report-workspace'
import { SlidesWorkspace } from '@/components/tools/slides-workspace'
import { SheetWorkspace } from '@/components/tools/sheet-workspace'
import { DocxWorkspace } from '@/components/tools/docx-workspace'
import { PdfWorkspace } from '@/components/tools/pdf-workspace'
import { DiagramsWorkspace, DiagramsWorkspaceHandle } from '@/components/tools/diagrams-workspace'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function ToolsPage() {
  const [tool, setTool] = useState<ToolId>('summarize')
  const [ribbonTab, setRibbonTab] = useState<string>('home')
  const [ribbonDensity, setRibbonDensity] = useState<'compact' | 'comfortable'>('comfortable')
  const [railQuery, setRailQuery] = useState('')
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [mobileRailOpen, setMobileRailOpen] = useState(false)
  const [backstageOpen, setBackstageOpen] = useState(false)
  const { createDocument, updateDocument } = useCV()
  const { documents } = useCV()

  // Summarize
  const [notes, setNotes] = useState('')
  const [tone, setTone] = useState<Tone>('short')
  const [summary, setSummary] = useState('')
  const [loadingSum, setLoadingSum] = useState(false)
  const [summaryDocId, setSummaryDocId] = useState<string | null>(null)

  // Report
  const [reportTopic, setReportTopic] = useState('')
  const [reportInputs, setReportInputs] = useState('')
  const [report, setReport] = useState('')
  const [loadingReport, setLoadingReport] = useState(false)
  const [reportDocId, setReportDocId] = useState<string | null>(null)

  // Slides
  const [slidesTitle, setSlidesTitle] = useState('')
  const [slidesOutline, setSlidesOutline] = useState('')
  const [loadingSlides, setLoadingSlides] = useState(false)
  const [slidesDocId, setSlidesDocId] = useState<string | null>(null)
  const [slidesTheme, setSlidesTheme] = useState<SlideTheme>('modernBlue')

  // DOCX editor
  const [docxText, setDocxText] = useState('')
  const [loadingDocx, setLoadingDocx] = useState(false)
  const [docxDocId, setDocxDocId] = useState<string | null>(null)

  // PDF basic edit
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfTextToAdd, setPdfTextToAdd] = useState('Edited with AI Tools')
  const [pdfMergeFiles, setPdfMergeFiles] = useState<FileList | null>(null)
  const [pdfSplitFile, setPdfSplitFile] = useState<File | null>(null)
  const [pdfRedactFile, setPdfRedactFile] = useState<File | null>(null)

  // Sheets (CSV-based MVP)
  const [sheetTitle, setSheetTitle] = useState('Untitled Sheet')
  const [sheetCsv, setSheetCsv] = useState('Name,Value\nA,1\nB,2')
  const [sheetDocId, setSheetDocId] = useState<string | null>(null)

  // Diagrams (draw.io XML)
  const [diagramTitle, setDiagramTitle] = useState('Untitled Diagram')
  const [diagramXml, setDiagramXml] = useState('')
  const [diagramDocId, setDiagramDocId] = useState<string | null>(null)
  const diagramsRef = useRef<DiagramsWorkspaceHandle | null>(null)

  const slideBullets = useMemo(() => {
    return slidesOutline
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 30)
  }, [slidesOutline])

  const resetRibbon = () => setRibbonTab('home')

  const handleSummarize = async () => {
    setLoadingSum(true)
    try {
      const data = await aiPost<{ result: string }>('/api/ai/summarize', { notes, tone })
      setSummary(data.result)
      const title = `Summary (${new Date().toLocaleDateString()})`
      const id = summaryDocId ?? createDocument('summary', title, data.result, { tone })
      if (!summaryDocId) setSummaryDocId(id)
      else updateDocument(id, { content: data.result, meta: { tone } })
      toast.success('Summary created')
    } catch (e: any) {
      toast.error(e.message || 'Failed to summarize')
    } finally {
      setLoadingSum(false)
    }
  }

  const handleReport = async () => {
    setLoadingReport(true)
    try {
      const data = await aiPost<{ result: string }>('/api/ai/report', { topic: reportTopic, inputs: reportInputs })
      setReport(data.result)
      const title = reportTopic?.trim() ? `Report: ${reportTopic.trim()}` : `Report (${new Date().toLocaleDateString()})`
      const id = reportDocId ?? createDocument('report', title, data.result, { topic: reportTopic })
      if (!reportDocId) setReportDocId(id)
      else updateDocument(id, { content: data.result, meta: { topic: reportTopic } })
      toast.success('Report created')
    } catch (e: any) {
      toast.error(e.message || 'Failed to create report')
    } finally {
      setLoadingReport(false)
    }
  }

  const handleSlides = async () => {
    setLoadingSlides(true)
    try {
      // optional AI: turn outline into structured slides
      const data = await aiPost<{ result: { title: string; slides: { title: string; bullets: string[] }[] } }>(
        '/api/ai/slides',
        { title: slidesTitle, outline: slidesOutline }
      )
      const id =
        slidesDocId ??
        createDocument('slides', data.result.title, JSON.stringify(data.result, null, 2), { outline: slidesOutline })
      if (!slidesDocId) setSlidesDocId(id)
      else updateDocument(id, { title: data.result.title, content: JSON.stringify(data.result, null, 2), meta: { outline: slidesOutline } })
      await exportSlidesPptx(data.result.title, data.result.slides, slidesTheme)
      toast.success('PPTX downloaded')
    } catch (e: any) {
      // fallback: simple 1-deck from lines
      try {
        await exportSlidesPptx(slidesTitle, [
          { title: slidesTitle, bullets: slideBullets.slice(0, 8) },
          { title: 'Key points', bullets: slideBullets.slice(8, 16) },
          { title: 'More', bullets: slideBullets.slice(16, 24) },
        ], slidesTheme)
        toast.success('PPTX downloaded')
      } catch {
        toast.error(e.message || 'Failed to create slides')
      }
    } finally {
      setLoadingSlides(false)
    }
  }

  const handleDocxUpload = async (file: File) => {
    setLoadingDocx(true)
    try {
      const text = await extractDocxToText(file)
      setDocxText(text)
      const id = docxDocId ?? createDocument('doc', file.name.replace(/\.docx$/i, ''), text, { source: 'docx-import' })
      if (!docxDocId) setDocxDocId(id)
      else updateDocument(id, { content: text })
      toast.success('DOCX imported')
    } catch (e) {
      console.error(e)
      toast.error('Failed to import DOCX')
    } finally {
      setLoadingDocx(false)
    }
  }

  const handlePdfEdit = async () => {
    if (!pdfFile) return
    try {
      const bytes = await pdfFile.arrayBuffer()
      const out = await editPdfAddText(bytes, pdfTextToAdd)
      const blob = new Blob([out], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'edited.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Edited PDF downloaded')
    } catch (e) {
      console.error(e)
      toast.error('Failed to edit PDF')
    }
  }

  const handlePdfMerge = async () => {
    if (!pdfMergeFiles || pdfMergeFiles.length < 2) return
    try {
      const buffers = await Promise.all(Array.from(pdfMergeFiles).map((f) => f.arrayBuffer()))
      const out = await mergePdfs(buffers)
      const blob = new Blob([out], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Merged PDF downloaded')
    } catch (e) {
      console.error(e)
      toast.error('Failed to merge PDFs')
    }
  }

  const handlePdfSplit = async () => {
    if (!pdfSplitFile) return
    try {
      const pages = await splitPdf(await pdfSplitFile.arrayBuffer())
      // Download first 5 pages to avoid too many downloads in MVP
      for (let i = 0; i < Math.min(5, pages.length); i++) {
        const blob = new Blob([pages[i]], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `split-page-${i + 1}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      }
      toast.success('Split PDFs downloaded (first pages)')
    } catch (e) {
      console.error(e)
      toast.error('Failed to split PDF')
    }
  }

  const handlePdfRedact = async () => {
    if (!pdfRedactFile) return
    try {
      // Simple MVP: black bar at top of page 1
      const out = await redactPdf(await pdfRedactFile.arrayBuffer(), [{ x: 36, y: 760, w: 520, h: 22 }])
      const blob = new Blob([out], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'redacted.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Redacted PDF downloaded')
    } catch (e) {
      console.error(e)
      toast.error('Failed to redact PDF')
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const openId = params.get('open')
    if (!openId) return
    const doc = documents.find((d) => d.id === openId)
    if (!doc) return

    if (doc.type === 'report') {
      setTool('report')
      resetRibbon()
      setReport(doc.content)
      setReportDocId(doc.id)
      setReportTopic(doc.meta?.topic ?? '')
    } else if (doc.type === 'summary' || doc.type === 'notes') {
      setTool('summarize')
      resetRibbon()
      setSummary(doc.content)
      setSummaryDocId(doc.id)
    } else if (doc.type === 'slides') {
      setTool('slides')
      resetRibbon()
      setSlidesTitle(doc.title)
      setSlidesDocId(doc.id)
      setSlidesOutline(doc.meta?.outline ?? '')
    } else if (doc.type === 'doc') {
      setTool('docx')
      resetRibbon()
      setDocxText(doc.content)
      setDocxDocId(doc.id)
    } else if (doc.type === 'sheet') {
      setTool('sheet')
      resetRibbon()
      setSheetTitle(doc.title)
      setSheetCsv(doc.content)
      setSheetDocId(doc.id)
    } else if (doc.type === 'pdf') {
      setTool('pdf')
      resetRibbon()
    } else if (doc.type === 'diagram') {
      setTool('diagrams')
      resetRibbon()
      setDiagramTitle(doc.title || 'Untitled Diagram')
      setDiagramXml(doc.content || '')
      setDiagramDocId(doc.id)
    }
  }, [documents])

  const handleToolChange = (t: ToolId) => {
    setTool(t)
    resetRibbon()
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k'
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault()
        setCmdkOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const saveSheet = () => {
    const id = sheetDocId ?? createDocument('sheet', sheetTitle, sheetCsv)
    if (!sheetDocId) setSheetDocId(id)
    else updateDocument(id, { title: sheetTitle, content: sheetCsv })
  }

  const saveDiagram = () => {
    const title = diagramTitle.trim() || 'Untitled Diagram'
    const content = diagramXml || ''
    const id = diagramDocId ?? createDocument('diagram', title, content, { format: 'drawio-xml' })
    if (!diagramDocId) setDiagramDocId(id)
    else updateDocument(id, { title, content, meta: { format: 'drawio-xml' } })

    const url = new URL(window.location.href)
    url.searchParams.set('open', id)
    window.history.replaceState({}, '', url.toString())
    toast.success('Saved to Files')
  }

  // Autosave diagrams when already saved once (debounced)
  useEffect(() => {
    if (tool !== 'diagrams') return
    if (!diagramDocId) return
    const t = setTimeout(() => {
      updateDocument(diagramDocId, {
        title: diagramTitle.trim() || 'Untitled Diagram',
        content: diagramXml || '',
        meta: { format: 'drawio-xml', autosaved: true },
      })
    }, 1200)
    return () => clearTimeout(t)
  }, [tool, diagramDocId, diagramTitle, diagramXml, updateDocument])

  const ribbonTabs: RibbonTab[] = useMemo(() => {
    if (tool === 'summarize') {
      return [
        {
          id: 'home',
          label: 'Home',
          groups: [
            {
              id: 'ai',
              label: 'AI',
              commands: [
                {
                  id: 'run',
                  label: `Summarize (${tone})`,
                  icon: <Sparkles className="w-4 h-4" />,
                  onClick: () => void handleSummarize(),
                  disabled: loadingSum || notes.trim().length <= 5,
                  variant: 'default',
                  size: 'lg',
                  layout: 'iconAbove',
                },
                {
                  id: 'tone',
                  label: 'Toggle tone',
                  onClick: () => setTone((t) => (t === 'short' ? 'detailed' : 'short')),
                },
              ],
            },
            {
              id: 'export',
              label: 'Export',
              commands: [
                {
                  id: 'pdf',
                  label: 'PDF',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void exportTextToPdf(summary || notes, 'summary.pdf'),
                  disabled: !(summary || notes),
                },
                {
                  id: 'docx',
                  label: 'DOCX',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void exportTextToDocx(summary || notes, 'summary.docx'),
                  disabled: !(summary || notes),
                },
              ],
            },
          ],
        },
        {
          id: 'insert',
          label: 'Insert',
          groups: [
            {
              id: 'placeholders',
              label: 'Insert',
              commands: [
                { id: 'insert-date', label: 'Date', disabled: true },
                { id: 'insert-template', label: 'Template', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'review',
          label: 'Review',
          groups: [
            {
              id: 'copilot',
              label: 'Copilot',
              commands: [
                { id: 'open-copilot', label: 'Use Copilot →', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'view',
          label: 'View',
          groups: [
            {
              id: 'density',
              label: 'Ribbon',
              commands: [
                { id: 'dense', label: 'Compact', onClick: () => setRibbonDensity('compact') },
                { id: 'roomy', label: 'Comfortable', onClick: () => setRibbonDensity('comfortable') },
              ],
            },
          ],
        },
      ]
    }

    if (tool === 'report') {
      return [
        {
          id: 'home',
          label: 'Home',
          groups: [
            {
              id: 'ai',
              label: 'AI',
              commands: [
                {
                  id: 'run',
                  label: 'Create report',
                  icon: <Sparkles className="w-4 h-4" />,
                  onClick: () => void handleReport(),
                  disabled: loadingReport || !(reportTopic.trim().length > 2 || reportInputs.trim().length > 5),
                  variant: 'default',
                  size: 'lg',
                  layout: 'iconAbove',
                },
              ],
            },
            {
              id: 'export',
              label: 'Export',
              commands: [
                {
                  id: 'pdf',
                  label: 'PDF',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void exportTextToPdf(report, 'report.pdf'),
                  disabled: !report,
                },
                {
                  id: 'docx',
                  label: 'DOCX',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void exportTextToDocx(report, 'report.docx'),
                  disabled: !report,
                },
              ],
            },
          ],
        },
        {
          id: 'insert',
          label: 'Insert',
          groups: [
            {
              id: 'insert',
              label: 'Insert',
              commands: [
                { id: 'table', label: 'Table', disabled: true },
                { id: 'picture', label: 'Picture', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'layout',
          label: 'Layout',
          groups: [
            {
              id: 'layout',
              label: 'Page',
              commands: [
                { id: 'margins', label: 'Margins', disabled: true },
                { id: 'spacing', label: 'Spacing', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'review',
          label: 'Review',
          groups: [
            {
              id: 'review',
              label: 'Review',
              commands: [
                { id: 'spelling', label: 'Spelling', disabled: true },
                { id: 'rewrite', label: 'Rewrite (Copilot)', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'view',
          label: 'View',
          groups: [
            {
              id: 'density',
              label: 'Ribbon',
              commands: [
                { id: 'dense', label: 'Compact', onClick: () => setRibbonDensity('compact') },
                { id: 'roomy', label: 'Comfortable', onClick: () => setRibbonDensity('comfortable') },
              ],
            },
          ],
        },
      ]
    }

    if (tool === 'slides') {
      return [
        {
          id: 'home',
          label: 'Home',
          groups: [
            {
              id: 'ai',
              label: 'AI',
              commands: [
                {
                  id: 'run',
                  label: 'Generate PPTX',
                  icon: <Sparkles className="w-4 h-4" />,
                  onClick: () => void handleSlides(),
                  disabled: loadingSlides || !(slidesTitle.trim().length > 1 && slidesOutline.trim().length > 5),
                  variant: 'default',
                  size: 'lg',
                  layout: 'iconAbove',
                },
              ],
            },
            {
              id: 'design',
              label: 'Design',
              commands: [
                {
                  id: 'theme-modern',
                  label: 'Modern Blue',
                  onClick: () => setSlidesTheme('modernBlue'),
                  variant: slidesTheme === 'modernBlue' ? 'secondary' : 'outline',
                },
                {
                  id: 'theme-dark',
                  label: 'Dark Pro',
                  onClick: () => setSlidesTheme('darkPro'),
                  variant: slidesTheme === 'darkPro' ? 'secondary' : 'outline',
                },
                {
                  id: 'theme-min',
                  label: 'Minimal',
                  onClick: () => setSlidesTheme('minimalLight'),
                  variant: slidesTheme === 'minimalLight' ? 'secondary' : 'outline',
                },
              ],
            },
          ],
        },
        {
          id: 'insert',
          label: 'Insert',
          groups: [
            {
              id: 'insert',
              label: 'Insert',
              commands: [
                { id: 'new-slide', label: 'New slide', disabled: true },
                { id: 'shapes', label: 'Shapes', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'transitions',
          label: 'Transitions',
          groups: [
            {
              id: 'trans',
              label: 'Transitions',
              commands: [
                { id: 'fade', label: 'Fade', disabled: true },
                { id: 'push', label: 'Push', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'view',
          label: 'View',
          groups: [
            {
              id: 'density',
              label: 'Ribbon',
              commands: [
                { id: 'dense', label: 'Compact', onClick: () => setRibbonDensity('compact') },
                { id: 'roomy', label: 'Comfortable', onClick: () => setRibbonDensity('comfortable') },
              ],
            },
          ],
        },
      ]
    }

    if (tool === 'sheet') {
      return [
        {
          id: 'home',
          label: 'Home',
          groups: [
            {
              id: 'save',
              label: 'Save',
              commands: [
                {
                  id: 'save',
                  label: 'Save to Files',
                  icon: <Save className="w-4 h-4" />,
                  onClick: () => saveSheet(),
                  disabled: sheetCsv.trim().length === 0,
                  variant: 'default',
                  size: 'lg',
                  layout: 'iconAbove',
                },
              ],
            },
            {
              id: 'export',
              label: 'Export',
              commands: [
                {
                  id: 'pdf',
                  label: 'PDF',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void exportTextToPdf(sheetCsv, 'sheet.pdf'),
                  disabled: sheetCsv.trim().length === 0,
                },
                {
                  id: 'docx',
                  label: 'DOCX',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void exportTextToDocx(sheetCsv, 'sheet.docx'),
                  disabled: sheetCsv.trim().length === 0,
                },
              ],
            },
          ],
        },
        {
          id: 'insert',
          label: 'Insert',
          groups: [
            {
              id: 'insert',
              label: 'Insert',
              commands: [
                { id: 'insert-row', label: 'Row', disabled: true },
                { id: 'insert-col', label: 'Column', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'formulas',
          label: 'Formulas',
          groups: [
            {
              id: 'fx',
              label: 'Functions',
              commands: [
                { id: 'sum', label: 'SUM()', disabled: true },
                { id: 'avg', label: 'AVERAGE()', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'view',
          label: 'View',
          groups: [
            {
              id: 'density',
              label: 'Ribbon',
              commands: [
                { id: 'dense', label: 'Compact', onClick: () => setRibbonDensity('compact') },
                { id: 'roomy', label: 'Comfortable', onClick: () => setRibbonDensity('comfortable') },
              ],
            },
          ],
        },
      ]
    }

    if (tool === 'docx') {
      return [
        {
          id: 'home',
          label: 'Home',
          groups: [
            {
              id: 'import',
              label: 'Import',
              commands: [
                {
                  id: 'import',
                  label: 'Import DOCX',
                  icon: <FileDown className="w-4 h-4" />,
                  onClick: () => document.getElementById('docx-input')?.click(),
                  disabled: loadingDocx,
                  variant: 'default',
                  size: 'lg',
                  layout: 'iconAbove',
                },
              ],
            },
            {
              id: 'export',
              label: 'Export',
              commands: [
                {
                  id: 'docx',
                  label: 'Export DOCX',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void exportTextToDocx(docxText, 'edited.docx'),
                  disabled: !docxText,
                },
                {
                  id: 'pdf',
                  label: 'Export PDF',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void exportTextToPdf(docxText, 'edited.pdf'),
                  disabled: !docxText,
                },
              ],
            },
          ],
        },
        {
          id: 'insert',
          label: 'Insert',
          groups: [
            {
              id: 'insert',
              label: 'Insert',
              commands: [
                { id: 'header', label: 'Header', disabled: true },
                { id: 'footer', label: 'Footer', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'review',
          label: 'Review',
          groups: [
            {
              id: 'review',
              label: 'Review',
              commands: [
                { id: 'rewrite', label: 'Rewrite (Copilot)', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'view',
          label: 'View',
          groups: [
            {
              id: 'density',
              label: 'Ribbon',
              commands: [
                { id: 'dense', label: 'Compact', onClick: () => setRibbonDensity('compact') },
                { id: 'roomy', label: 'Comfortable', onClick: () => setRibbonDensity('comfortable') },
              ],
            },
          ],
        },
      ]
    }

    if (tool === 'pdf') {
      return [
        {
          id: 'home',
          label: 'Home',
          groups: [
            {
              id: 'stamp',
              label: 'Edit',
              commands: [
                {
                  id: 'stamp',
                  label: 'Stamp & download',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => void handlePdfEdit(),
                  disabled: !pdfFile,
                  variant: 'default',
                  size: 'lg',
                  layout: 'iconAbove',
                },
              ],
            },
            {
              id: 'organize',
              label: 'Organize',
              commands: [
                {
                  id: 'merge',
                  label: 'Merge',
                  onClick: () => void handlePdfMerge(),
                  disabled: !pdfMergeFiles || pdfMergeFiles.length < 2,
                },
                {
                  id: 'split',
                  label: 'Split',
                  onClick: () => void handlePdfSplit(),
                  disabled: !pdfSplitFile,
                },
              ],
            },
            {
              id: 'redact',
              label: 'Redact',
              commands: [
                {
                  id: 'redact',
                  label: 'Redact',
                  onClick: () => void handlePdfRedact(),
                  disabled: !pdfRedactFile,
                },
              ],
            },
          ],
        },
        {
          id: 'organize',
          label: 'Organize',
          groups: [
            {
              id: 'organize',
              label: 'Pages',
              commands: [
                { id: 'merge', label: 'Merge', onClick: () => void handlePdfMerge(), disabled: !pdfMergeFiles || pdfMergeFiles.length < 2 },
                { id: 'split', label: 'Split', onClick: () => void handlePdfSplit(), disabled: !pdfSplitFile },
              ],
            },
          ],
        },
        {
          id: 'protect',
          label: 'Protect',
          groups: [
            {
              id: 'protect',
              label: 'Protect',
              commands: [
                { id: 'redact', label: 'Redact', onClick: () => void handlePdfRedact(), disabled: !pdfRedactFile },
              ],
            },
          ],
        },
        {
          id: 'view',
          label: 'View',
          groups: [
            {
              id: 'density',
              label: 'Ribbon',
              commands: [
                { id: 'dense', label: 'Compact', onClick: () => setRibbonDensity('compact') },
                { id: 'roomy', label: 'Comfortable', onClick: () => setRibbonDensity('comfortable') },
              ],
            },
          ],
        },
      ]
    }

    if (tool === 'diagrams') {
      return [
        {
          id: 'home',
          label: 'Home',
          groups: [
            {
              id: 'file',
              label: 'File',
              commands: [
                {
                  id: 'new',
                  label: 'New',
                  onClick: () => {
                    setDiagramTitle('Untitled Diagram')
                    setDiagramXml('')
                    setDiagramDocId(null)
                    diagramsRef.current?.newDiagram()
                    toast.success('New diagram')
                  },
                  variant: 'outline',
                },
                {
                  id: 'save',
                  label: 'Save',
                  icon: <Save className="w-4 h-4" />,
                  onClick: () => saveDiagram(),
                  variant: 'default',
                  size: 'lg',
                  layout: 'iconAbove',
                },
              ],
            },
            {
              id: 'export',
              label: 'Export',
              commands: [
                {
                  id: 'xml',
                  label: 'Download XML',
                  icon: <Download className="w-4 h-4" />,
                  onClick: () => {
                    const blob = new Blob([diagramXml || ''], { type: 'application/xml' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${(diagramTitle || 'diagram').replace(/[\\/:*?\"<>|]+/g, '-').slice(0, 64)}.drawio`
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    URL.revokeObjectURL(url)
                  },
                  disabled: !diagramXml,
                },
                {
                  id: 'png',
                  label: 'PNG',
                  onClick: () => diagramsRef.current?.exportPng(),
                  disabled: false,
                },
                {
                  id: 'svg',
                  label: 'SVG',
                  onClick: () => diagramsRef.current?.exportSvg(),
                  disabled: false,
                },
              ],
            },
          ],
        },
        {
          id: 'insert',
          label: 'Insert',
          groups: [
            {
              id: 'insert',
              label: 'Shapes',
              commands: [
                { id: 'shapes', label: 'Shapes', disabled: true },
                { id: 'connectors', label: 'Connectors', disabled: true },
              ],
            },
          ],
        },
        {
          id: 'view',
          label: 'View',
          groups: [
            {
              id: 'density',
              label: 'Ribbon',
              commands: [
                { id: 'dense', label: 'Compact', onClick: () => setRibbonDensity('compact') },
                { id: 'roomy', label: 'Comfortable', onClick: () => setRibbonDensity('comfortable') },
              ],
            },
          ],
        },
      ]
    }

    // fallback
    return [
      {
        id: 'home',
        label: 'Home',
        groups: [
          {
            id: 'coming',
            label: 'Diagrams',
            commands: [
              { id: 'soon', label: 'Coming next', disabled: true },
            ],
          },
        ],
      },
    ]
  }, [
    tool,
    tone,
    loadingSum,
    notes,
    summary,
    report,
    reportInputs,
    reportTopic,
    loadingReport,
    slidesTitle,
    slidesOutline,
    loadingSlides,
    sheetTitle,
    sheetCsv,
    sheetDocId,
    docxText,
    loadingDocx,
    pdfFile,
    pdfMergeFiles,
    pdfSplitFile,
    pdfRedactFile,
  ])

  const main = (() => {
    if (tool === 'summarize') {
      return (
        <SummarizeWorkspace
          notes={notes}
          setNotes={setNotes}
          summary={summary}
          setSummary={setSummary}
          tone={tone}
          setTone={setTone}
          loading={loadingSum}
          onRun={() => void handleSummarize()}
        />
      )
    }
    if (tool === 'report') {
      return (
        <ReportWorkspace
          topic={reportTopic}
          setTopic={setReportTopic}
          inputs={reportInputs}
          setInputs={setReportInputs}
          report={report}
          setReport={setReport}
          loading={loadingReport}
          onRun={() => void handleReport()}
        />
      )
    }
    if (tool === 'slides') {
      return (
        <SlidesWorkspace
          title={slidesTitle}
          setTitle={setSlidesTitle}
          outline={slidesOutline}
          setOutline={setSlidesOutline}
          theme={slidesTheme}
          setTheme={setSlidesTheme}
          loading={loadingSlides}
          onRun={() => void handleSlides()}
        />
      )
    }
    if (tool === 'sheet') {
      return (
        <SheetWorkspace
          title={sheetTitle}
          setTitle={setSheetTitle}
          csv={sheetCsv}
          setCsv={setSheetCsv}
          onSave={saveSheet}
        />
      )
    }
    if (tool === 'docx') {
      return (
        <DocxWorkspace
          text={docxText}
          setText={setDocxText}
          loading={loadingDocx}
          onImportClick={() => document.getElementById('docx-input')?.click()}
          onFilePicked={(f) => void handleDocxUpload(f)}
        />
      )
    }
    if (tool === 'pdf') {
      return (
        <PdfWorkspace
          pdfFile={pdfFile}
          setPdfFile={setPdfFile}
          textToAdd={pdfTextToAdd}
          setTextToAdd={setPdfTextToAdd}
          mergeFiles={pdfMergeFiles}
          setMergeFiles={setPdfMergeFiles}
          splitFile={pdfSplitFile}
          setSplitFile={setPdfSplitFile}
          redactFile={pdfRedactFile}
          setRedactFile={setPdfRedactFile}
          onStamp={() => void handlePdfEdit()}
          onMerge={() => void handlePdfMerge()}
          onSplit={() => void handlePdfSplit()}
          onRedact={() => void handlePdfRedact()}
        />
      )
    }
    if (tool === 'diagrams') {
      return (
        <DiagramsWorkspace
          ref={diagramsRef}
          title={diagramTitle}
          setTitle={setDiagramTitle}
          xml={diagramXml}
          setXml={setDiagramXml}
          onRequestSaveToFiles={saveDiagram}
          onExportAsset={(format, dataUri) => {
            const a = document.createElement('a')
            a.href = dataUri
            a.download = `${(diagramTitle || 'diagram').replace(/[\\/:*?\"<>|]+/g, '-').slice(0, 64)}.${format}`
            document.body.appendChild(a)
            a.click()
            a.remove()
            toast.success(`${format.toUpperCase()} downloaded`)
          }}
        />
      )
    }
    return null
  })()

  return (
    <main className="min-h-screen bg-background">
      <Backstage
        open={backstageOpen}
        onOpenChange={setBackstageOpen}
        tool={tool}
        canSave={tool === 'sheet' || tool === 'diagrams'}
        onSave={
          tool === 'sheet'
            ? () => saveSheet()
            : tool === 'diagrams'
              ? () => saveDiagram()
              : undefined
        }
        onExportPdf={() => {
          if (tool === 'summarize') void exportTextToPdf(summary || notes, 'notes.pdf')
          else if (tool === 'report') void exportTextToPdf(report, 'document.pdf')
          else if (tool === 'docx') void exportTextToPdf(docxText, 'document.pdf')
          else if (tool === 'sheet') void exportTextToPdf(sheetCsv, 'sheet.pdf')
        }}
        onExportDocx={() => {
          if (tool === 'summarize') void exportTextToDocx(summary || notes, 'notes.docx')
          else if (tool === 'report') void exportTextToDocx(report, 'document.docx')
          else if (tool === 'docx') void exportTextToDocx(docxText, 'document.docx')
          else if (tool === 'sheet') void exportTextToDocx(sheetCsv, 'sheet.docx')
        }}
        onExportPptx={
          tool === 'slides'
            ? () =>
                void exportSlidesPptx(
                  slidesTitle || 'Slides',
                  [
                    { title: slidesTitle || 'Slides', bullets: slideBullets.slice(0, 8) },
                    { title: 'Key points', bullets: slideBullets.slice(8, 16) },
                  ],
                  slidesTheme,
                )
            : undefined
        }
      />
      <CommandPalette
        open={cmdkOpen}
        onOpenChange={setCmdkOpen}
        onPickTool={(t) => handleToolChange(t)}
        documents={documents}
      />
      <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
        <OfficeShell
          topChrome={
            <OfficeTopChrome
              appName="Office Tools"
              onOpenFiles={() => (window.location.href = '/files')}
              onOpenBackstage={() => setBackstageOpen(true)}
              onSave={
                tool === 'sheet'
                  ? () => saveSheet()
                  : tool === 'diagrams'
                    ? () => saveDiagram()
                    : undefined
              }
              extra={
                <Button type="button" variant="outline" size="sm" onClick={() => setCmdkOpen(true)}>
                  Ctrl+K
                </Button>
              }
            />
          }
          mobileTopBar={
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setMobileRailOpen(true)}
              >
                <Menu className="w-4 h-4" />
                Tools
              </Button>
              <div className="text-sm font-semibold">Office Tools</div>
              <Button type="button" variant="outline" size="sm" onClick={() => setCmdkOpen(true)}>
                Ctrl+K
              </Button>

              <Sheet open={mobileRailOpen} onOpenChange={setMobileRailOpen}>
                <SheetContent side="left" className="p-0">
                  <SheetHeader>
                    <SheetTitle>Office Tools</SheetTitle>
                    <SheetDescription>Pick a tool, then use the ribbon.</SheetDescription>
                  </SheetHeader>
                  <div className="px-4 pb-4">
                    <ToolsLeftRail
                      activeTool={tool}
                      onToolChange={(t) => {
                        handleToolChange(t)
                        setMobileRailOpen(false)
                      }}
                      documents={documents}
                      query={railQuery}
                      onQueryChange={setRailQuery}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          }
          leftRail={
            <ToolsLeftRail
              activeTool={tool}
              onToolChange={handleToolChange}
              documents={documents}
              query={railQuery}
              onQueryChange={setRailQuery}
            />
          }
          ribbon={<Ribbon tabs={ribbonTabs} activeTabId={ribbonTab} onActiveTabChange={setRibbonTab} density={ribbonDensity} />}
          main={main}
          rightPanel={
            <div className="space-y-3">
              <CopilotPane
                tool={tool}
                getContextText={() => {
                  if (tool === 'summarize') return notes || summary
                  if (tool === 'report') return reportInputs || report
                  if (tool === 'slides') return slidesOutline
                  if (tool === 'sheet') return sheetCsv
                  if (tool === 'docx') return docxText
                  if (tool === 'diagrams') return diagramXml
                  return ''
                }}
                onInsert={(text) => {
                  if (tool === 'summarize') setSummary((prev) => (prev ? `${prev}\n\n${text}` : text))
                  else if (tool === 'report') setReport((prev) => (prev ? `${prev}\n\n${text}` : text))
                  else if (tool === 'slides') setSlidesOutline((prev) => (prev ? `${prev}\n${text}` : text))
                  else if (tool === 'sheet') setSheetCsv((prev) => (prev ? `${prev}\n${text}` : text))
                  else if (tool === 'docx') setDocxText((prev) => (prev ? `${prev}\n\n${text}` : text))
                  else if (tool === 'diagrams') setDiagramXml(text)
                }}
                onReplace={(text) => {
                  if (tool === 'summarize') setSummary(text)
                  else if (tool === 'report') setReport(text)
                  else if (tool === 'slides') setSlidesOutline(text)
                  else if (tool === 'sheet') setSheetCsv(text)
                  else if (tool === 'docx') setDocxText(text)
                  else if (tool === 'diagrams') setDiagramXml(text)
                }}
              />
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-xs font-medium mb-2">Ribbon density</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRibbonDensity('comfortable')}
                    className={`text-xs rounded-md border px-2 py-1 ${
                      ribbonDensity === 'comfortable' ? 'bg-accent border-border' : 'border-border hover:bg-accent/30'
                    }`}
                  >
                    Comfortable
                  </button>
                  <button
                    type="button"
                    onClick={() => setRibbonDensity('compact')}
                    className={`text-xs rounded-md border px-2 py-1 ${
                      ribbonDensity === 'compact' ? 'bg-accent border-border' : 'border-border hover:bg-accent/30'
                    }`}
                  >
                    Compact
                  </button>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
                Files are saved locally in your browser. Use <span className="font-medium">Files</span> to manage everything.
              </div>
            </div>
          }
          statusBar={
            <OfficeStatusBar
              left={
                <>
                  Tool: <span className="font-medium">{tool}</span>
                  {tool === 'sheet' && sheetDocId ? <> • Saved</> : null}
                  {tool === 'diagrams' && diagramDocId ? <> • Autosave on</> : null}
                </>
              }
              right={
                <>
                  <span className="hidden sm:inline">Ctrl+K</span>
                </>
              }
            />
          }
        />
      </div>
    </main>
  )
}

