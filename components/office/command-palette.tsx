import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FileText, Presentation, Shapes, Table2, Sparkles } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command'
import type { ToolId } from '@/components/tools/tool-types'
import type { OfficeDocument } from '@/lib/store'

function docIcon(type: string) {
  if (type === 'slides') return <Presentation className="w-4 h-4" />
  if (type === 'sheet') return <Table2 className="w-4 h-4" />
  if (type === 'diagram') return <Shapes className="w-4 h-4" />
  return <FileText className="w-4 h-4" />
}

const toolCommands: { id: ToolId; label: string }[] = [
  { id: 'summarize', label: 'Summarize' },
  { id: 'report', label: 'Reports' },
  { id: 'slides', label: 'Slides' },
  { id: 'sheet', label: 'Sheets' },
  { id: 'docx', label: 'DOCX' },
  { id: 'pdf', label: 'PDF' },
  { id: 'diagrams', label: 'Diagrams' },
]

export function CommandPalette({
  open,
  onOpenChange,
  onPickTool,
  documents,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onPickTool: (t: ToolId) => void
  documents: OfficeDocument[]
}) {
  const recent = useMemo(() => documents.slice(0, 10), [documents])
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!open) setValue('')
  }, [open])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Command Palette">
      <CommandInput
        placeholder="Search tools and files…"
        value={value}
        onValueChange={setValue}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Tools">
          {toolCommands.map((t) => (
            <CommandItem
              key={t.id}
              value={`tool:${t.label}`}
              onSelect={() => {
                onPickTool(t.id)
                onOpenChange(false)
              }}
            >
              <Sparkles className="w-4 h-4" />
              {t.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent files">
          {recent.map((d) => (
            <CommandItem
              key={d.id}
              value={`file:${d.title}:${d.type}`}
              onSelect={() => {
                onOpenChange(false)
              }}
            >
              {docIcon(d.type)}
              <Link href={`/tools?open=${encodeURIComponent(d.id)}`} className="flex-1">
                {d.title}
              </Link>
              <CommandShortcut>{d.type}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

