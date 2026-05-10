'use client'

import { useState } from 'react'
import { Resume } from '@/lib/store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PersonalInfoSection } from './sections/personal-info'
import { ExperienceSection } from './sections/experience'
import { EducationSection } from './sections/education'
import { SkillsSection } from './sections/skills'
import { ReferencesSection } from './sections/references'
import { CustomSectionsSection } from './sections/custom-sections'
import { CoverLetterSection } from './sections/cover-letter'

export function BuilderForm({ resume }: { resume: Resume }) {
  const [activeTab, setActiveTab] = useState('personal')

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
          <TabsTrigger value="coverLetter">Cover Letter</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoSection resume={resume} />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <ExperienceSection resume={resume} />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationSection resume={resume} />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsSection resume={resume} />
          </TabsContent>

          <TabsContent value="references" className="space-y-4">
            <ReferencesSection resume={resume} />
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <CustomSectionsSection resume={resume} />
          </TabsContent>

          <TabsContent value="coverLetter" className="space-y-4">
            <CoverLetterSection resume={resume} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
