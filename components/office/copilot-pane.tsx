'use client'

import { useMemo, useState } from 'react'
import { Sparkles, Send, ClipboardPaste, Replace } from 'lucide-react'
import toast from 'react-hot-toast'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import type { ToolId } from '@/components/tools/tool-types'
import { aiPost } from '@/components/tools/ai-post'

type CopilotMsg = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function defaultPromptHint(tool: ToolId) {
  if (tool === 'summarize') return 'Example: Summarize these notes into 6 bullet points…'
  if (tool === 'report') return 'Example: Write a professional report using the inputs…'
  if (tool === 'slides') return 'Example: Turn this outline into a slide deck structure…'
  if (tool === 'sheet') return 'Example: Clean this CSV and add a totals column…'
  if (tool === 'docx') return 'Example: Rewrite this text in a more formal tone…'
  if (tool === 'pdf') return 'Example: Create a redaction plan for sensitive areas…'
  if (tool === 'diagrams') return 'Example: Describe a system architecture diagram for this app…'
  return 'Ask GossipAI…'
}

export function CopilotPane({
  tool,
  getContextText,
  onInsert,
  onReplace,
}: {
  tool: ToolId
  getContextText: () => string
  onInsert: (text: string) => void
  onReplace: (text: string) => void
}) {
  const [messages, setMessages] = useState<CopilotMsg[]>([
    {
      id: nowId(),
      role: 'assistant',
      content:
        'GossipAI is ready. Ask for edits, rewrites, structure, or exports. Use “Insert” or “Replace” to apply results.',
    },
  ])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const lastAssistant = useMemo(() => {
    return [...messages].reverse().find((m) => m.role === 'assistant')?.content ?? ''
  }, [messages])

  const run = async () => {
    const p = prompt.trim()
    if (!p) return
    setLoading(true)
    const ctx = getContextText()
    const userMsg: CopilotMsg = { id: nowId(), role: 'user', content: p }
    setMessages((m) => [...m, userMsg])
    setPrompt('')

    try {
      // Map tool -> best existing API. (We can expand later with a dedicated /api/ai/copilot route.)
      if (tool === 'summarize') {
        const data = await aiPost<{ result: string }>('/api/ai/summarize', { notes: `${p}\n\n${ctx}`, tone: 'detailed' })
        setMessages((m) => [...m, { id: nowId(), role: 'assistant', content: data.result }])
      } else if (tool === 'report') {
        const data = await aiPost<{ result: string }>('/api/ai/report', { topic: p, inputs: ctx })
        setMessages((m) => [...m, { id: nowId(), role: 'assistant', content: data.result }])
      } else if (tool === 'slides') {
        const data = await aiPost<{ result: { title: string; slides: { title: string; bullets: string[] }[] } }>(
          '/api/ai/slides',
          { title: p, outline: ctx }
        )
        const pretty = `Title: ${data.result.title}\n\n` + data.result.slides.map((s) => `- ${s.title}\n${s.bullets.map((b) => `  • ${b}`).join('\n')}`).join('\n\n')
        setMessages((m) => [...m, { id: nowId(), role: 'assistant', content: pretty }])
      } else {
        // Fallback: suggestion endpoint (summary/bullets/skills). Use as a general rewrite.
        const data = await aiPost<{ result: string }>('/api/ai/suggest', { type: 'summary', context: `${p}\n\n${ctx}` })
        setMessages((m) => [...m, { id: nowId(), role: 'assistant', content: data.result }])
      }
    } catch (e: any) {
      toast.error(e?.message || 'Copilot failed')
      setMessages((m) => [...m, { id: nowId(), role: 'assistant', content: 'Sorry — I could not complete that request.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">GossipAI</div>
          <div className="text-xs text-muted-foreground truncate">Tool-aware prompting and edits</div>
        </div>
      </div>

      <Card className="p-3 space-y-2">
        <div className="text-xs text-muted-foreground">Chat</div>
        <div className="max-h-[40vh] overflow-auto space-y-2 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border border-border p-2 text-xs whitespace-pre-wrap ${
                m.role === 'user' ? 'bg-accent/20' : 'bg-background'
              }`}
            >
              <div className="text-[10px] text-muted-foreground mb-1">
                {m.role === 'user' ? 'You' : 'GossipAI'}
              </div>
              {m.content}
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24"
            placeholder={defaultPromptHint(tool)}
          />
          <div className="flex gap-2">
            <Button onClick={() => void run()} disabled={loading || !prompt.trim()} className="gap-2">
              <Send className="w-4 h-4" />
              Send
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!lastAssistant) return
                onInsert(lastAssistant)
                toast.success('Inserted')
              }}
              disabled={!lastAssistant}
              className="gap-2"
            >
              <ClipboardPaste className="w-4 h-4" />
              Insert
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!lastAssistant) return
                onReplace(lastAssistant)
                toast.success('Replaced')
              }}
              disabled={!lastAssistant}
              className="gap-2"
            >
              <Replace className="w-4 h-4" />
              Replace
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

