'use client'

import { Resume } from '@/lib/store'
import { useCV } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { useRef } from 'react'
import { AISuggestionsPanel } from '@/components/builder/ai-suggestions'
import { Switch } from '@/components/ui/switch'

export function PersonalInfoSection({ resume }: { resume: Resume }) {
  const { updatePersonalInfo } = useCV()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value } as any)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        updatePersonalInfo({ profileImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

        {/* Profile Image */}
        <div className="mb-6">
          <Label className="block mb-3">Profile Photo</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {resume.personalInfo.profileImage ? (
                <img
                  src={resume.personalInfo.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border p-3">
            <div>
              <div className="text-sm font-medium">Show photo on resume</div>
              <div className="text-xs text-muted-foreground">
                Optional. Turn off for ATS-friendly resumes.
              </div>
            </div>
            <Switch
              checked={Boolean(resume.personalInfo.showPhoto)}
              onCheckedChange={(checked) => updatePersonalInfo({ showPhoto: Boolean(checked) })}
            />
          </div>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={resume.personalInfo.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={resume.personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={resume.personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={resume.personalInfo.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="New York, NY"
          />
        </div>

        {/* Home Address */}
        <div className="mb-4">
          <Label htmlFor="homeAddress">Home Address</Label>
          <Input
            id="homeAddress"
            value={resume.personalInfo.homeAddress}
            onChange={(e) => handleInputChange('homeAddress', e.target.value)}
            placeholder="Street, Suburb, City, Postal code"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Optional. Include only if relevant in your country/industry.
          </p>
        </div>

        {/* Government ID */}
        <div className="mb-4">
          <Label htmlFor="governmentId">Government ID / National ID</Label>
          <Input
            id="governmentId"
            value={resume.personalInfo.governmentId}
            onChange={(e) => handleInputChange('governmentId', e.target.value)}
            placeholder="Optional"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Optional. Only add if required by the job or local norms.
          </p>
        </div>

        {/* Professional Summary */}
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={resume.personalInfo.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            placeholder="Brief overview of your professional background and goals..."
            className="min-h-24"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Keep it concise and impactful (2-3 sentences)
          </p>
        </div>

        <AISuggestionsPanel
          type="summary"
          onSelect={(value) => handleInputChange('summary', value as string)}
        />
      </Card>
    </div>
  )
}
