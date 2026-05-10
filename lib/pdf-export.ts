'use client'

import { Resume } from './store'
import { exportCoverLetterTemplatePDF, exportResumeTemplatePDF } from '@/lib/pdf-react'

export async function exportResumeToPDF(resume: Resume, elementId: string) {
  // `elementId` kept for backwards compat with callers.
  void elementId
  await exportResumeTemplatePDF(resume)
}

export async function exportCoverLetterToPDF(resume: Resume) {
  await exportCoverLetterTemplatePDF(resume)
}

export function generateResumeString(resume: Resume): string {
  const { personalInfo, experience, education, skills } = resume

  let resumeText = ''

  // Header
  resumeText += `${personalInfo.fullName}\n`
  if (personalInfo.email) resumeText += `${personalInfo.email} | `
  if (personalInfo.phone) resumeText += `${personalInfo.phone} | `
  if (personalInfo.location) resumeText += personalInfo.location
  resumeText += '\n\n'

  // Summary
  if (personalInfo.summary) {
    resumeText += `PROFESSIONAL SUMMARY\n${personalInfo.summary}\n\n`
  }

  // Experience
  if (experience.length > 0) {
    resumeText += 'PROFESSIONAL EXPERIENCE\n'
    experience.forEach((exp) => {
      resumeText += `${exp.jobTitle} - ${exp.company}\n`
      resumeText += `${exp.location}\n`
      resumeText += `${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate}\n`
      resumeText += `${exp.description}\n\n`
    })
  }

  // Education
  if (education.length > 0) {
    resumeText += 'EDUCATION\n'
    education.forEach((edu) => {
      resumeText += `${edu.degree} in ${edu.field}\n`
      resumeText += `${edu.school}\n`
      resumeText += `${edu.startDate} - ${edu.endDate}\n`
      if (edu.details) resumeText += `${edu.details}\n`
      resumeText += '\n'
    })
  }

  // Skills
  if (skills.length > 0) {
    resumeText += 'SKILLS\n'
    const skillsText = skills.map((s) => `${s.name} (${s.level})`).join(', ')
    resumeText += skillsText + '\n'
  }

  return resumeText
}
