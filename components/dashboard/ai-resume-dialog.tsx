'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Sparkles, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCV } from '@/lib/store'

export function AIResumeDialog() {
  const router = useRouter()
  const { createResumeWithData } = useCV()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [profession, setProfession] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [jobAd, setJobAd] = useState('')

  const canGenerate = profession.trim().length >= 2 && skills.trim().length >= 2

  const handleGenerate = async () => {
    if (!canGenerate) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession,
          skills,
          experience,
          jobAd,
        }),
      })

      const data = (await res.json().catch(() => null)) as any
      if (!res.ok) {
        console.error(data)
        toast.error(data?.error || 'Failed to generate CV')
        return
      }

      const result = data?.result
      if (!result) {
        toast.error('Invalid AI response')
        return
      }

      const newId = createResumeWithData(result.title, result.templateId || 'johannesburg', {
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: result.personalInfo?.summary || '',
        },
        experience: result.experience || [],
        education: result.education || [],
        projects: result.projects || [],
        skills: result.skills || [],
        certifications: result.certifications || [],
        languages: result.languages || [],
        references: result.references || [],
        customSections: result.customSections || [],
      })

      toast.success('Created a new resume from Groq!')
      setOpen(false)
      router.push(`/builder/${newId}`)
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate CV')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Sparkles className="w-5 h-5" />
          AI Generate CV (Groq)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate a CV from your profession & skills</DialogTitle>
          <DialogDescription>
            Provide a profession and a few key skills. You can optionally paste experience notes and a job advert for better tailoring.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai-profession">Profession</Label>
              <Input
                id="ai-profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g., Software Engineer, Teacher, Electrician"
              />
            </div>
            <div>
              <Label htmlFor="ai-skills">Key skills</Label>
              <Input
                id="ai-skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, TypeScript, REST APIs, SQL"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ai-experience">Experience notes (optional)</Label>
            <Textarea
              id="ai-experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Paste rough notes: achievements, responsibilities, metrics…"
              className="min-h-24"
            />
          </div>

          <div>
            <Label htmlFor="ai-jobad">Job advert (optional)</Label>
            <Textarea
              id="ai-jobad"
              value={jobAd}
              onChange={(e) => setJobAd(e.target.value)}
              placeholder="Paste the job description to tailor the summary/skills…"
              className="min-h-24"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="w-full gap-2 bg-primary hover:bg-primary/90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Generating…' : 'Generate CV'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

