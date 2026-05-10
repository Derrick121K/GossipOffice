'use client'

import { CustomSection, Resume } from '@/lib/store'
import { useCV } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-react'

export function CustomSectionsSection({ resume }: { resume: Resume }) {
  const { addCustomSection, updateCustomSection, deleteCustomSection } = useCV()

  const handleAdd = () => {
    addCustomSection({
      id: Date.now().toString(),
      title: 'Additional Information',
      content: '',
    })
  }

  const handleUpdate = (id: string, field: keyof CustomSection, value: string) => {
    updateCustomSection(id, { [field]: value } as Partial<CustomSection>)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Additional sections</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add your own sections with editable headers (e.g., “Additional Information”, “Volunteer Work”, “Awards”).
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      {resume.customSections.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No additional sections yet</p>
          <Button onClick={handleAdd} variant="outline">
            Add “Additional Information”
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {resume.customSections.map((section) => (
            <Card key={section.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor={`custom-title-${section.id}`}>Header</Label>
                    <Input
                      id={`custom-title-${section.id}`}
                      value={section.title}
                      onChange={(e) => handleUpdate(section.id, 'title', e.target.value)}
                      placeholder="Additional Information"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`custom-content-${section.id}`}>Content</Label>
                    <Textarea
                      id={`custom-content-${section.id}`}
                      value={section.content}
                      onChange={(e) => handleUpdate(section.id, 'content', e.target.value)}
                      placeholder={"Example:\n- Available to relocate\n- Driver’s license\n- Work permit\n- Publications: ..."}
                      className="min-h-28"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Tip: use bullet points starting with “- ” for best formatting.
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 mt-6"
                  onClick={() => deleteCustomSection(section.id)}
                  aria-label="Delete section"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

