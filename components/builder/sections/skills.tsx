'use client'

import { Resume, Skill } from '@/lib/store'
import { useCV } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X } from 'lucide-react'

export function SkillsSection({ resume }: { resume: Resume }) {
  const { addSkill, updateSkill, deleteSkill } = useCV()

  const handleAddSkill = () => {
    addSkill({
      id: Date.now().toString(),
      name: '',
      level: 'intermediate',
    })
  }

  const handleUpdateSkill = (id: string, field: string, value: any) => {
    updateSkill(id, { [field]: value } as any)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Skills</h2>
        <Button
          onClick={handleAddSkill}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      {resume.skills.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No skills added yet
          </p>
          <Button
            onClick={handleAddSkill}
            variant="outline"
          >
            Add Your First Skill
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            {resume.skills.map((skill) => (
              <SkillItem
                key={skill.id}
                skill={skill}
                onUpdate={handleUpdateSkill}
                onDelete={deleteSkill}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function SkillItem({
  skill,
  onUpdate,
  onDelete,
}: {
  skill: Skill
  onUpdate: (id: string, field: string, value: any) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex items-end gap-4">
      <div className="flex-grow">
        <Label htmlFor={`skill-name-${skill.id}`}>Skill</Label>
        <Input
          id={`skill-name-${skill.id}`}
          value={skill.name}
          onChange={(e) => onUpdate(skill.id, 'name', e.target.value)}
          placeholder="e.g., JavaScript, Project Management"
        />
      </div>

      <div className="w-40">
        <Label htmlFor={`skill-level-${skill.id}`}>Level</Label>
        <Select
          value={skill.level}
          onValueChange={(value) =>
            onUpdate(skill.id, 'level', value as Skill['level'])
          }
        >
          <SelectTrigger id={`skill-level-${skill.id}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        onClick={() => onDelete(skill.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
