'use client'

import { Reference, Resume } from '@/lib/store'
import { useCV } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'

export function ReferencesSection({ resume }: { resume: Resume }) {
  const { addReference, updateReference, deleteReference } = useCV()

  const handleAdd = () => {
    addReference({
      id: Date.now().toString(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
    })
  }

  const handleUpdate = (id: string, field: keyof Reference, value: string) => {
    updateReference(id, { [field]: value } as Partial<Reference>)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">References</h2>
        <Button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Reference
        </Button>
      </div>

      {resume.references.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No references added yet</p>
          <Button onClick={handleAdd} variant="outline">
            Add Your First Reference
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            {resume.references.map((ref) => (
              <div key={ref.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label htmlFor={`ref-name-${ref.id}`}>Name</Label>
                      <Input
                        id={`ref-name-${ref.id}`}
                        value={ref.name}
                        onChange={(e) => handleUpdate(ref.id, 'name', e.target.value)}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ref-relationship-${ref.id}`}>Relationship (optional)</Label>
                      <Input
                        id={`ref-relationship-${ref.id}`}
                        value={ref.relationship ?? ''}
                        onChange={(e) => handleUpdate(ref.id, 'relationship', e.target.value)}
                        placeholder="Former manager"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ref-title-${ref.id}`}>Title (optional)</Label>
                      <Input
                        id={`ref-title-${ref.id}`}
                        value={ref.title ?? ''}
                        onChange={(e) => handleUpdate(ref.id, 'title', e.target.value)}
                        placeholder="Engineering Manager"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ref-company-${ref.id}`}>Company (optional)</Label>
                      <Input
                        id={`ref-company-${ref.id}`}
                        value={ref.company ?? ''}
                        onChange={(e) => handleUpdate(ref.id, 'company', e.target.value)}
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ref-email-${ref.id}`}>Email (optional)</Label>
                      <Input
                        id={`ref-email-${ref.id}`}
                        value={ref.email ?? ''}
                        onChange={(e) => handleUpdate(ref.id, 'email', e.target.value)}
                        placeholder="jane@acme.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ref-phone-${ref.id}`}>Phone (optional)</Label>
                      <Input
                        id={`ref-phone-${ref.id}`}
                        value={ref.phone ?? ''}
                        onChange={(e) => handleUpdate(ref.id, 'phone', e.target.value)}
                        placeholder="+27 00 000 0000"
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 mt-6"
                    onClick={() => deleteReference(ref.id)}
                    aria-label="Delete reference"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

