'use client'

import { Resume } from '@/lib/store'
import { useCV } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Layout } from 'lucide-react'
import toast from 'react-hot-toast'
import { TEMPLATES, Template } from '@/lib/templates'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMemo, useState } from 'react'

function TemplateThumbnail({ template }: { template: Template }) {
  return (
    <div
      className="w-full h-full flex flex-col p-3 rounded-lg border border-border/50"
      style={{
        backgroundColor: template.colors.background,
        color: template.colors.text,
      }}
    >
      <div
        className="h-1.5 w-full rounded-full mb-3"
        style={{ backgroundColor: template.colors.primary }}
      />
      <div className="flex gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: template.colors.secondary }}
        />
        <div className="flex-1 space-y-1">
          <div
            className="h-2 w-3/4 rounded"
            style={{ backgroundColor: template.colors.primary }}
          />
          <div
            className="h-1.5 w-1/2 rounded opacity-60"
            style={{ backgroundColor: template.colors.text }}
          />
        </div>
      </div>
      <div className="space-y-2 flex-1">
        <div className="flex gap-1">
          <div className="h-1.5 w-2 rounded" style={{ backgroundColor: template.colors.accent }} />
          <div className="h-1.5 flex-1 rounded opacity-40" style={{ backgroundColor: template.colors.text }} />
        </div>
        <div className="h-1 w-5/6 rounded opacity-30" style={{ backgroundColor: template.colors.text }} />
        <div className="h-1 w-4/6 rounded opacity-30" style={{ backgroundColor: template.colors.text }} />
      </div>
    </div>
  )
}

export function TemplateSwitcher({ resume }: { resume: Resume }) {
  const { updateResume } = useCV()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleTemplateChange = (templateId: string) => {
    updateResume({
      ...resume,
      templateId,
      updatedAt: new Date(),
    })
    toast.success(`Switched to ${TEMPLATES.find((t) => t.id === templateId)?.name} template`)
  }

  const currentTemplateName =
    TEMPLATES.find((t) => t.id === resume.templateId)?.name || 'Template'

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TEMPLATES
    return TEMPLATES.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    })
  }, [query])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Layout className="w-4 h-4" />
          {currentTemplateName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Preview templates</DialogTitle>
          <DialogDescription>
            Choose a layout. Switching templates keeps your content but changes the visual design.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates (name, category, description)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-auto pr-1">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  handleTemplateChange(template.id)
                  setOpen(false)
                }}
                className={`text-left rounded-xl border transition-colors hover:bg-accent/40 ${
                  resume.templateId === template.id ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="h-36 p-3">
                  <TemplateThumbnail template={template} />
                </div>
                <div className="px-3 pb-3">
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
