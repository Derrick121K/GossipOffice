'use client'

import { Resume, Education } from '@/lib/store'
import { useCV } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'

export function EducationSection({ resume }: { resume: Resume }) {
  const { addEducation, updateEducation, deleteEducation } = useCV()

  const handleAddEducation = () => {
    addEducation({
      id: Date.now().toString(),
      degree: '',
      school: '',
      field: '',
      startDate: '',
      endDate: '',
      details: '',
    })
  }

  const handleUpdateEducation = (id: string, field: string, value: any) => {
    updateEducation(id, { [field]: value } as any)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Education</h2>
        <Button
          onClick={handleAddEducation}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      {resume.education.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No education added yet
          </p>
          <Button
            onClick={handleAddEducation}
            variant="outline"
          >
            Add Your Education
          </Button>
        </Card>
      ) : (
        resume.education.map((edu) => (
          <EducationCard
            key={edu.id}
            education={edu}
            onUpdate={handleUpdateEducation}
            onDelete={deleteEducation}
          />
        ))
      )}
    </div>
  )
}

function EducationCard({
  education,
  onUpdate,
  onDelete,
}: {
  education: Education
  onUpdate: (id: string, field: string, value: any) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {education.degree || 'Degree'} - {education.school || 'School'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={() => onDelete(education.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`degree-${education.id}`}>Degree</Label>
          <Input
            id={`degree-${education.id}`}
            value={education.degree}
            onChange={(e) =>
              onUpdate(education.id, 'degree', e.target.value)
            }
            placeholder="Bachelor of Science"
          />
        </div>

        <div>
          <Label htmlFor={`school-${education.id}`}>School/University</Label>
          <Input
            id={`school-${education.id}`}
            value={education.school}
            onChange={(e) =>
              onUpdate(education.id, 'school', e.target.value)
            }
            placeholder="University Name"
          />
        </div>

        <div>
          <Label htmlFor={`field-${education.id}`}>Field of Study</Label>
          <Input
            id={`field-${education.id}`}
            value={education.field}
            onChange={(e) =>
              onUpdate(education.id, 'field', e.target.value)
            }
            placeholder="Computer Science"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`start-date-${education.id}`}>Start Date</Label>
            <Input
              id={`start-date-${education.id}`}
              type="month"
              value={education.startDate}
              onChange={(e) =>
                onUpdate(education.id, 'startDate', e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor={`end-date-${education.id}`}>End Date</Label>
            <Input
              id={`end-date-${education.id}`}
              type="month"
              value={education.endDate}
              onChange={(e) =>
                onUpdate(education.id, 'endDate', e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor={`details-${education.id}`}>
          Additional Details (Optional)
        </Label>
        <Textarea
          id={`details-${education.id}`}
          value={education.details}
          onChange={(e) =>
            onUpdate(education.id, 'details', e.target.value)
          }
          placeholder="GPA, honors, relevant coursework, etc."
          className="min-h-16"
        />
      </div>
    </Card>
  )
}
