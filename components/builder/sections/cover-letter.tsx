'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2, Sparkles, Download } from 'lucide-react'

import type { Resume } from '@/lib/store'
import { useCV } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { exportCoverLetterToDOCX } from '@/lib/docx-export'
import { exportCoverLetterToPDF } from '@/lib/pdf-export'

export function CoverLetterSection({ resume }: { resume: Resume }) {
  const { updateCoverLetter } = useCV()
  const [loading, setLoading] = useState(false)
  const letter =
    (resume as any).coverLetter ?? {
      jobTitle: '',
      company: '',
      body: '',
      updatedAt: new Date(),
    }

  const skillsText = useMemo(() => {
    const skills = Array.isArray((resume as any).skills) ? (resume as any).skills : []
    return skills.map((s: any) => s.name).filter(Boolean).join(', ')
  }, [resume])

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: (resume as any).title || 'Professional',
          jobTitle: letter.jobTitle,
          company: letter.company,
          skills: skillsText,
          experience: (resume as any).personalInfo?.summary || '',
        }),
      })
      const data = (await res.json().catch(() => null)) as any
      if (!res.ok) {
        console.error(data)
        toast.error(data?.error || 'Failed to generate cover letter')
        return
      }
      updateCoverLetter({ body: data?.result || '' })
      toast.success('Cover letter generated')
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate cover letter')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      await exportCoverLetterToDOCX(resume)
      toast.success('Cover letter DOCX downloaded')
    } catch (e) {
      console.error(e)
      toast.error('Failed to export cover letter')
    }
  }

  const handleDownloadPDF = async () => {
    try {
      await exportCoverLetterToPDF(resume)
      toast.success('Cover letter PDF downloaded')
    } catch (e) {
      console.error(e)
      toast.error('Failed to export cover letter PDF')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cover Letter</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Write your own cover letter, or generate one with AI, then download as DOCX.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cl-jobTitle">Job Title</Label>
            <Input
              id="cl-jobTitle"
              value={letter.jobTitle ?? ''}
              onChange={(e) => updateCoverLetter({ jobTitle: e.target.value })}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div>
            <Label htmlFor="cl-company">Company</Label>
            <Input
              id="cl-company"
              value={letter.company ?? ''}
              onChange={(e) => updateCoverLetter({ company: e.target.value })}
              placeholder="e.g., Acme Inc."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cl-body">Letter</Label>
          <Textarea
            id="cl-body"
            value={letter.body ?? ''}
            onChange={(e) => updateCoverLetter({ body: e.target.value })}
            placeholder="Write your cover letter here…"
            className="min-h-56"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleGenerate} disabled={loading} className="gap-2 bg-primary hover:bg-primary/90">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Generating…' : 'Generate with AI'}
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download DOCX
          </Button>
        </div>
      </Card>
    </div>
  )
}

