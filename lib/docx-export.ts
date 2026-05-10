'use client'

import { Packer, Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx'
import type { Resume } from './store'
import { getTemplateById } from '@/lib/templates'
import { getLayoutConfig } from '@/lib/template-layouts'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function sanitizeFilenameFromResume(resume: Resume) {
  const preferred =
    resume.personalInfo?.fullName?.trim() ||
    resume.title?.trim() ||
    'Resume'

  const cleaned = preferred
    .replace(/^New Resume\s*-\s*/i, '')
    .replace(/^Untitled Resume\s*$/i, 'Resume')
    .trim()

  return (cleaned || 'Resume')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function bulletsFromText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•]\s*/, '').trim())
    .filter(Boolean)
}

function sectionHeading(title: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: title, bold: true })],
  })
}

function paragraph(text: string) {
  return new Paragraph({ children: [new TextRun(text || ' ')] })
}

function bullet(text: string) {
  return new Paragraph({ text, bullet: { level: 0 } })
}

function buildHeader(resume: any) {
  const { personalInfo } = resume
  const contact = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.homeAddress,
    personalInfo.governmentId ? `ID: ${personalInfo.governmentId}` : '',
  ]
    .filter(Boolean)
    .join(' | ')

  return [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: personalInfo.fullName || resume.title || 'Resume', bold: true })],
    }),
    contact ? paragraph(contact) : paragraph(''),
  ]
}

function buildSkillsBlock(resume: any) {
  const skills = Array.isArray(resume.skills) ? resume.skills : []
  if (!skills.length) return []
  return [sectionHeading('Skills'), paragraph(skills.map((s: any) => s.name).filter(Boolean).join(', '))]
}

function buildSimpleList(title: string, items: string[]) {
  if (!items?.length) return []
  return [sectionHeading(title), ...items.map((t) => bullet(t))]
}

export async function exportResumeToDOCX(resume: Resume) {
  const {
    personalInfo,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
    customSections = [],
  } = resume as any

  const template = getTemplateById(resume.templateId)
  const cfg = template ? getLayoutConfig(template) : null
  const variant = cfg?.variant ?? 'single'

  const mainSections: Paragraph[] = []

  if (personalInfo.summary) {
    mainSections.push(sectionHeading('Professional Summary'))
    mainSections.push(paragraph(personalInfo.summary))
    mainSections.push(paragraph(''))
  }

  if (experience.length) {
    mainSections.push(sectionHeading('Work Experience'))
    experience.forEach((exp: any) => {
      mainSections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: `${exp.jobTitle || ''}${exp.company ? ` — ${exp.company}` : ''}`.trim(), bold: true })] }))
      const meta = [exp.location, exp.startDate ? `${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate || ''}`.trim() : ''].filter(Boolean).join(' | ')
      if (meta) mainSections.push(paragraph(meta))
      bulletsFromText(exp.description || '').forEach((b) => mainSections.push(bullet(b)))
      mainSections.push(paragraph(''))
    })
  }

  if (projects.length) {
    mainSections.push(sectionHeading('Projects'))
    projects.forEach((proj: any) => {
      mainSections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: `${proj.jobTitle || 'Project'}${proj.company ? ` — ${proj.company}` : ''}`.trim(), bold: true })] }))
      const meta = [proj.location, proj.startDate ? `${proj.startDate} - ${proj.currentlyWorking ? 'Present' : proj.endDate || ''}`.trim() : ''].filter(Boolean).join(' | ')
      if (meta) mainSections.push(paragraph(meta))
      bulletsFromText(proj.description || '').forEach((b) => mainSections.push(bullet(b)))
      mainSections.push(paragraph(''))
    })
  }

  if (education.length) {
    mainSections.push(sectionHeading('Education'))
    education.forEach((edu: any) => {
      mainSections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(), bold: true })] }))
      const meta = [edu.school, edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ''].filter(Boolean).join(' | ')
      if (meta) mainSections.push(paragraph(meta))
      if (edu.details) mainSections.push(paragraph(String(edu.details)))
      mainSections.push(paragraph(''))
    })
  }

  // Non-sidebar variants: include skills + lists in main flow
  const skillsBlock = buildSkillsBlock({ skills })
  const certsBlock = buildSimpleList('Certifications', certifications)
  const langsBlock = buildSimpleList('Languages', languages)

  if (variant !== 'sidebar-left' && variant !== 'sidebar-right') {
    mainSections.push(...skillsBlock)
    if (skillsBlock.length) mainSections.push(paragraph(''))
    mainSections.push(...certsBlock)
    if (certsBlock.length) mainSections.push(paragraph(''))
    mainSections.push(...langsBlock)
    if (langsBlock.length) mainSections.push(paragraph(''))
  }

  if (references.length) {
    mainSections.push(sectionHeading('References'))
    references.forEach((r: any) => {
      mainSections.push(new Paragraph({ children: [new TextRun({ text: r.name || 'Reference', bold: true })] }))
      const extra = [r.title, r.company, r.relationship, r.email, r.phone].filter(Boolean).join(' • ')
      if (extra) mainSections.push(paragraph(extra))
    })
    mainSections.push(paragraph(''))
  }

  customSections.forEach((s: any) => {
    if (!s?.title || !s?.content) return
    mainSections.push(sectionHeading(String(s.title)))
    bulletsFromText(String(s.content)).forEach((b) => mainSections.push(bullet(b)))
    mainSections.push(paragraph(''))
  })

  const sidebarContent: Paragraph[] = [
    ...buildHeader(resume as any),
    paragraph(''),
    ...buildSkillsBlock(resume as any),
    paragraph(''),
    ...buildSimpleList('Certifications', certifications),
    paragraph(''),
    ...buildSimpleList('Languages', languages),
  ].filter(Boolean) as any

  const doc = new Document({
    sections: [
      {
        properties: {},
        children:
          variant === 'sidebar-left' || variant === 'sidebar-right'
            ? [
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    new TableRow({
                      children:
                        variant === 'sidebar-left'
                          ? [
                              new TableCell({
                                width: { size: 32, type: WidthType.PERCENTAGE },
                                children: sidebarContent,
                              }),
                              new TableCell({
                                width: { size: 68, type: WidthType.PERCENTAGE },
                                children: mainSections,
                              }),
                            ]
                          : [
                              new TableCell({
                                width: { size: 68, type: WidthType.PERCENTAGE },
                                children: mainSections,
                              }),
                              new TableCell({
                                width: { size: 32, type: WidthType.PERCENTAGE },
                                children: sidebarContent,
                              }),
                            ],
                    }),
                  ],
                }),
              ]
            : [...buildHeader(resume as any), paragraph(''), ...mainSections],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, `${sanitizeFilenameFromResume(resume)}-resume.docx`)
}

export async function exportCoverLetterToDOCX(resume: Resume) {
  const name = resume.personalInfo?.fullName || ''
  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
    resume.personalInfo?.homeAddress,
  ]
    .filter(Boolean)
    .join(' | ')

  const jobLine = [resume.coverLetter?.jobTitle, resume.coverLetter?.company].filter(Boolean).join(' — ')

  const body = String(resume.coverLetter?.body || '').trim()
  const paragraphs = body
    ? body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : []

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: name || 'Cover Letter', bold: true })] }),
          contact ? new Paragraph({ children: [new TextRun({ text: contact })] }) : new Paragraph({ text: '' }),
          jobLine ? new Paragraph({ children: [new TextRun({ text: jobLine })] }) : new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          ...(paragraphs.length
            ? paragraphs.map((p) => new Paragraph({ children: [new TextRun({ text: p })] }))
            : [new Paragraph({ children: [new TextRun({ text: ' ' })] })]),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, `${sanitizeFilenameFromResume(resume)}-cover-letter.docx`)
}

