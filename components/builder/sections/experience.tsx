'use client'

import { Resume, Experience } from '@/lib/store'
import { useCV } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'

export function ExperienceSection({ resume }: { resume: Resume }) {
  const { addExperience, updateExperience, deleteExperience } = useCV()

  const handleAddExperience = () => {
    addExperience({
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    })
  }

  const handleUpdateExperience = (id: string, field: string, value: any) => {
    updateExperience(id, { [field]: value } as any)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <Button
          onClick={handleAddExperience}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {resume.experience.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No work experience added yet
          </p>
          <Button
            onClick={handleAddExperience}
            variant="outline"
          >
            Add Your First Job
          </Button>
        </Card>
      ) : (
        resume.experience.map((exp) => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            onUpdate={handleUpdateExperience}
            onDelete={deleteExperience}
          />
        ))
      )}
    </div>
  )
}

function ExperienceCard({
  experience,
  onUpdate,
  onDelete,
}: {
  experience: Experience
  onUpdate: (id: string, field: string, value: any) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {experience.jobTitle || 'Job Title'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={() => onDelete(experience.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`job-title-${experience.id}`}>Job Title</Label>
          <Input
            id={`job-title-${experience.id}`}
            value={experience.jobTitle}
            onChange={(e) =>
              onUpdate(experience.id, 'jobTitle', e.target.value)
            }
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <Label htmlFor={`company-${experience.id}`}>Company</Label>
          <Input
            id={`company-${experience.id}`}
            value={experience.company}
            onChange={(e) =>
              onUpdate(experience.id, 'company', e.target.value)
            }
            placeholder="Tech Company"
          />
        </div>

        <div>
          <Label htmlFor={`location-${experience.id}`}>Location</Label>
          <Input
            id={`location-${experience.id}`}
            value={experience.location}
            onChange={(e) =>
              onUpdate(experience.id, 'location', e.target.value)
            }
            placeholder="New York, NY"
          />
        </div>

        <div>
          <Label htmlFor={`start-date-${experience.id}`}>Start Date</Label>
          <Input
            id={`start-date-${experience.id}`}
            type="month"
            value={experience.startDate}
            onChange={(e) =>
              onUpdate(experience.id, 'startDate', e.target.value)
            }
          />
        </div>

        {!experience.currentlyWorking && (
          <div>
            <Label htmlFor={`end-date-${experience.id}`}>End Date</Label>
            <Input
              id={`end-date-${experience.id}`}
              type="month"
              value={experience.endDate}
              onChange={(e) =>
                onUpdate(experience.id, 'endDate', e.target.value)
              }
            />
          </div>
        )}

        <div className="flex items-end h-10">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`currently-working-${experience.id}`}
              checked={experience.currentlyWorking}
              onCheckedChange={(checked) =>
                onUpdate(experience.id, 'currentlyWorking', checked)
              }
            />
            <Label
              htmlFor={`currently-working-${experience.id}`}
              className="font-normal cursor-pointer"
            >
              Currently working here
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor={`description-${experience.id}`}>
          Job Description
        </Label>
        <Textarea
          id={`description-${experience.id}`}
          value={experience.description}
          onChange={(e) =>
            onUpdate(experience.id, 'description', e.target.value)
          }
          placeholder="Describe your responsibilities and achievements..."
          className="min-h-20"
        />
      </div>
    </Card>
  )
}
