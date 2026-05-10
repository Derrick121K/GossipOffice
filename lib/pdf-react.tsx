'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer'
import type { Resume } from '@/lib/store'
import { getTemplateById } from '@/lib/templates'
import { getLayoutConfig } from '@/lib/template-layouts'

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

type Colors = {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = String(hex || '').replace('#', '').trim()
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    if ([r, g, b].some((x) => Number.isNaN(x))) return null
    return { r, g, b }
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    if ([r, g, b].some((x) => Number.isNaN(x))) return null
    return { r, g, b }
  }
  return null
}

function rgba(hex: string, a: number) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const alpha = Math.max(0, Math.min(1, a))
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

function estimateResumeContentScore(resume: Resume) {
  const pi: any = (resume as any).personalInfo ?? {}
  const summary = String(pi.summary || '')
  const skills = Array.isArray((resume as any).skills) ? (resume as any).skills : []
  const skillNames = skills.map((s: any) => s?.name).filter(Boolean).join(', ')
  const experience = Array.isArray((resume as any).experience) ? (resume as any).experience : []
  const projects = Array.isArray((resume as any).projects) ? (resume as any).projects : []
  const education = Array.isArray((resume as any).education) ? (resume as any).education : []
  const refs = Array.isArray((resume as any).references) ? (resume as any).references : []
  const custom = Array.isArray((resume as any).customSections) ? (resume as any).customSections : []

  const descLen = (items: any[]) =>
    items.reduce((acc, it) => acc + String(it?.description || it?.details || '').length, 0)

  const refLen = refs.reduce((acc, r: any) => {
    return acc + String(r?.name || '').length + String(r?.title || '').length + String(r?.company || '').length + String(r?.relationship || '').length
  }, 0)

  const customLen = custom.reduce((acc, s: any) => acc + String(s?.title || '').length + String(s?.content || '').length, 0)

  // Rough “how much stuff is on the page” estimate.
  return (
    summary.length +
    skillNames.length +
    descLen(experience) +
    descLen(projects) +
    descLen(education) +
    refLen +
    customLen
  )
}

function getAutoScaleForResume(resume: Resume) {
  const score = estimateResumeContentScore(resume)
  // Short CVs: enlarge typography slightly to reduce large empty bottom space.
  if (score < 650) return 1.32
  if (score < 900) return 1.24
  if (score < 1300) return 1.16
  if (score < 1900) return 1.08
  if (score < 2600) return 1.03
  return 1.0
}

function bulletsFromText(text: string): string[] {
  return String(text || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•]\s*/, '').trim())
    .filter(Boolean)
}

function SectionTitle({ title, colors, headingStyle, scale }: { title: string; colors: Colors; headingStyle: string; scale: number }) {
  if (headingStyle === 'caps') {
    return <Text style={{ fontSize: 9 * scale, letterSpacing: 1.2, color: colors.secondary, marginBottom: 6 * scale }}>{title.toUpperCase()}</Text>
  }
  if (headingStyle === 'pill') {
    return (
      <View style={{ backgroundColor: colors.accent, paddingHorizontal: 10 * scale, paddingVertical: 4 * scale, borderRadius: 999, alignSelf: 'flex-start', marginBottom: 8 * scale }}>
        <Text style={{ fontSize: 10 * scale, fontWeight: 700 as any, color: colors.text }}>{title}</Text>
      </View>
    )
  }
  if (headingStyle === 'bar') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 * scale }}>
        <View style={{ width: 6 * scale, height: 6 * scale, borderRadius: 3 * scale, backgroundColor: colors.primary, marginRight: 8 * scale }} />
        <Text style={{ fontSize: 11 * scale, fontWeight: 700 as any, color: colors.text }}>{title}</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.accent, marginLeft: 10 * scale }} />
      </View>
    )
  }
  if (headingStyle === 'minimal') {
    return <Text style={{ fontSize: 11 * scale, fontWeight: 600 as any, color: colors.text, marginBottom: 6 * scale }}>{title}</Text>
  }
  // underline
  return (
    <View style={{ marginBottom: 8 * scale }}>
      <Text style={{ fontSize: 11 * scale, fontWeight: 700 as any, color: colors.text }}>{title}</Text>
      <View style={{ width: 30 * scale, height: 2 * scale, backgroundColor: colors.primary, marginTop: 3 * scale }} />
    </View>
  )
}

function HeaderBlock({ resume, colors, headerAlign, scale }: { resume: any; colors: Colors; headerAlign: string; scale: number }) {
  const name = resume.personalInfo?.fullName || resume.title || 'Resume'
  const subtitle = resume.title || ''
  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
    resume.personalInfo?.homeAddress,
    resume.personalInfo?.governmentId ? `ID: ${resume.personalInfo.governmentId}` : null,
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <View style={{ alignItems: headerAlign === 'center' ? 'center' : 'flex-start' }}>
      <Text style={{ fontSize: 20 * scale, fontWeight: 800 as any, color: colors.text }}>{name}</Text>
      {subtitle ? <Text style={{ fontSize: 10 * scale, color: colors.secondary, marginTop: 2 * scale }}>{subtitle}</Text> : null}
      {contact ? <Text style={{ fontSize: 9 * scale, color: colors.secondary, marginTop: 6 * scale }}>{contact}</Text> : null}
    </View>
  )
}

function Summary({ resume, colors, headingStyle, scale }: { resume: any; colors: Colors; headingStyle: string; scale: number }) {
  const summary = resume.personalInfo?.summary
  if (!summary) return null
  return (
    <View>
      <SectionTitle title="Professional Summary" colors={colors} headingStyle={headingStyle} scale={scale} />
      <Text style={{ fontSize: 10.8 * scale, color: colors.secondary, lineHeight: 1.35 * scale }}>{summary}</Text>
    </View>
  )
}

function ExperienceLike({
  title,
  items,
  colors,
  headingStyle,
  scale,
}: {
  title: string
  items: any[]
  colors: Colors
  headingStyle: string
  scale: number
}) {
  if (!items?.length) return null
  return (
    <View>
      <SectionTitle title={title} colors={colors} headingStyle={headingStyle} scale={scale} />
      <View style={{ gap: 10.5 * scale }}>
        {items.map((it) => {
          const meta = [it.company, it.location].filter(Boolean).join(' • ')
          const dates = it.startDate ? `${it.startDate} - ${it.currentlyWorking ? 'Present' : it.endDate || ''}` : ''
          const bullets = bulletsFromText(it.description || '')
          return (
            <View key={it.id ?? `${it.jobTitle}-${it.company}`}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 * scale }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11 * scale, fontWeight: 700 as any, color: colors.text }}>{it.jobTitle || 'Role'}</Text>
                  {meta ? <Text style={{ fontSize: 9.5 * scale, color: colors.secondary, marginTop: 2 * scale }}>{meta}</Text> : null}
                </View>
                {dates ? <Text style={{ fontSize: 9 * scale, color: colors.secondary }}>{dates}</Text> : null}
              </View>
              {bullets.length ? (
                <View style={{ marginTop: 5 * scale, paddingLeft: 10 * scale, gap: 2 * scale }}>
                  {bullets.map((b, idx) => (
                    <Text key={idx} style={{ fontSize: 10 * scale, color: colors.secondary, lineHeight: 1.3 * scale }}>
                      • {b}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          )
        })}
      </View>
    </View>
  )
}

function Skills({ resume, colors, headingStyle, scale }: { resume: any; colors: Colors; headingStyle: string; scale: number }) {
  const skills = Array.isArray(resume.skills) ? resume.skills : []
  if (!skills.length) return null
  return (
    <View>
      <SectionTitle title="Skills" colors={colors} headingStyle={headingStyle} scale={scale} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 * scale }}>
        {skills
          .map((s: any) => s?.name)
          .filter(Boolean)
          .map((name: string, idx: number) => (
            <View
              key={`${name}-${idx}`}
              style={{
                backgroundColor: colors.accent,
                borderRadius: 4 * scale,
                paddingHorizontal: 7 * scale,
                paddingVertical: 3 * scale,
              }}
            >
              <Text style={{ fontSize: 9.5 * scale, color: colors.text }}>{name}</Text>
            </View>
          ))}
      </View>
    </View>
  )
}

function SimpleList({ title, items, colors, headingStyle, scale }: { title: string; items: string[]; colors: Colors; headingStyle: string; scale: number }) {
  if (!items?.length) return null
  return (
    <View>
      <SectionTitle title={title} colors={colors} headingStyle={headingStyle} scale={scale} />
      <Text style={{ fontSize: 10.2 * scale, color: colors.secondary, lineHeight: 1.25 * scale }}>{items.join(', ')}</Text>
    </View>
  )
}

function References({ resume, colors, headingStyle, scale }: { resume: any; colors: Colors; headingStyle: string; scale: number }) {
  const refs = Array.isArray(resume.references) ? resume.references : []
  if (!refs.length) return null
  return (
    <View>
      <SectionTitle title="References" colors={colors} headingStyle={headingStyle} scale={scale} />
      <View style={{ gap: 7 * scale }}>
        {refs.map((r: any) => (
          <View key={r.id ?? r.name}>
            <Text style={{ fontSize: 10.5 * scale, fontWeight: 700 as any, color: colors.text }}>{r.name || 'Reference'}</Text>
            <Text style={{ fontSize: 9.7 * scale, color: colors.secondary, lineHeight: 1.25 * scale }}>
              {[r.title, r.company, r.relationship, r.email, r.phone].filter(Boolean).join(' • ')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function CustomSections({ resume, colors, headingStyle, scale }: { resume: any; colors: Colors; headingStyle: string; scale: number }) {
  const sections = Array.isArray(resume.customSections) ? resume.customSections : []
  if (!sections.length) return null
  return (
    <View style={{ gap: 10 * scale }}>
      {sections.map((s: any) => {
        const bullets = bulletsFromText(s.content || '')
        return (
          <View key={s.id ?? s.title}>
            <SectionTitle title={s.title || 'Additional Information'} colors={colors} headingStyle={headingStyle} scale={scale} />
            {bullets.length ? (
              <View style={{ paddingLeft: 10 * scale, gap: 2 * scale }}>
                {bullets.map((b, idx) => (
                  <Text key={idx} style={{ fontSize: 10 * scale, color: colors.secondary, lineHeight: 1.25 * scale }}>
                    • {b}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={{ fontSize: 10 * scale, color: colors.secondary, lineHeight: 1.25 * scale }}>{String(s.content || '')}</Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

function renderSection(key: string, resume: any, colors: Colors, headingStyle: string, scale: number) {
  switch (key) {
    case 'summary':
      return <Summary resume={resume} colors={colors} headingStyle={headingStyle} scale={scale} />
    case 'experience':
      return <ExperienceLike title="Work Experience" items={resume.experience || []} colors={colors} headingStyle={headingStyle} scale={scale} />
    case 'projects':
      return <ExperienceLike title="Projects" items={resume.projects || []} colors={colors} headingStyle={headingStyle} scale={scale} />
    case 'education':
      return (
        <ExperienceLike
          title="Education"
          items={(resume.education || []).map((e: any) => ({
            ...e,
            jobTitle: [e.degree, e.field].filter(Boolean).join(' — '),
            company: e.school,
            description: e.details,
            currentlyWorking: false,
          }))}
          colors={colors}
          headingStyle={headingStyle}
          scale={scale}
        />
      )
    case 'skills':
      return <Skills resume={resume} colors={colors} headingStyle={headingStyle} scale={scale} />
    case 'certifications':
      return <SimpleList title="Certifications" items={resume.certifications || []} colors={colors} headingStyle={headingStyle} scale={scale} />
    case 'languages':
      return <SimpleList title="Languages" items={resume.languages || []} colors={colors} headingStyle={headingStyle} scale={scale} />
    case 'references':
      return <References resume={resume} colors={colors} headingStyle={headingStyle} scale={scale} />
    case 'custom':
      return <CustomSections resume={resume} colors={colors} headingStyle={headingStyle} scale={scale} />
    default:
      return null
  }
}

function ResumePdfDoc({ resume }: { resume: Resume }) {
  const template = getTemplateById(resume.templateId)
  const colors: Colors = template?.colors ?? {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#e2e8f0',
    background: '#ffffff',
    text: '#0f172a',
  }
  const cfg = template ? getLayoutConfig(template) : null
  const variant = cfg?.variant ?? 'single'
  const headingStyle = cfg?.headingStyle ?? 'underline'
  const order = cfg?.sectionOrder ?? ['summary','experience','projects','education','skills','certifications','languages','references','custom']
  const headerAlign = cfg?.headerAlign ?? 'left'
  const scale = getAutoScaleForResume(resume)
  const showPhoto =
    Boolean((resume as any)?.personalInfo?.showPhoto) &&
    Boolean(cfg?.showPhoto ?? true) &&
    Boolean((resume as any)?.personalInfo?.profileImage)

  const styles = StyleSheet.create({
    page: {
      // Reduce margins so content fills page better.
      paddingTop: 16,
      paddingBottom: 10,
      paddingHorizontal: 14,
      backgroundColor: colors.background || '#ffffff',
      color: colors.text || '#000000',
      fontFamily: 'Helvetica',
      fontSize: 11 * scale,
    },
  })

  const header = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10 * scale,
        justifyContent: headerAlign === 'center' ? 'center' : 'flex-start',
      }}
    >
      {showPhoto ? (
        <Image
          src={(resume as any).personalInfo.profileImage}
          style={{
            width: 48 * scale,
            height: 48 * scale,
            borderRadius: 10 * scale,
            objectFit: 'cover',
            borderWidth: 2,
            borderColor: colors.accent,
          }}
        />
      ) : null}
      <HeaderBlock resume={resume as any} colors={colors} headerAlign={headerAlign} scale={scale} />
    </View>
  )

  if (variant === 'ats') {
    const name = (resume as any).personalInfo?.fullName || resume.title || 'Resume'
    const contact = [
      (resume as any).personalInfo?.email,
      (resume as any).personalInfo?.phone,
      (resume as any).personalInfo?.location,
    ]
      .filter(Boolean)
      .join(' | ')

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ paddingTop: 2 * scale }}>
            <Text style={{ fontSize: 18 * scale, fontWeight: 800 as any, color: colors.text }}>{name}</Text>
            {contact ? <Text style={{ fontSize: 9.5 * scale, color: colors.secondary, marginTop: 4 * scale }}>{contact}</Text> : null}
            <View style={{ height: 1, backgroundColor: colors.accent, marginTop: 10 * scale, marginBottom: 10 * scale }} />
            <View style={{ gap: 11.5 * scale }}>
              {order.map((k) => (
                <View key={k}>{renderSection(k, resume as any, colors, headingStyle, scale)}</View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  if (variant === 'sidebar-left' || variant === 'sidebar-right') {
    const sidebar = (
      <View style={{ width: '32%', padding: 12 * scale, backgroundColor: rgba(colors.accent, 0.13) }}>
        {header}
        <View style={{ marginTop: 12 * scale, gap: 10 * scale }}>
          <Skills resume={resume as any} colors={colors} headingStyle={headingStyle} scale={scale} />
          <SimpleList title="Certifications" items={(resume as any).certifications || []} colors={colors} headingStyle={headingStyle} scale={scale} />
          <SimpleList title="Languages" items={(resume as any).languages || []} colors={colors} headingStyle={headingStyle} scale={scale} />
        </View>
      </View>
    )

    const main = (
      <View style={{ width: '68%', padding: 14 * scale, gap: 11 * scale }}>
        {variant === 'sidebar-right' ? (
          <View style={{ marginBottom: 10 * scale }}>
            {header}
            <View style={{ height: 1, backgroundColor: colors.accent, marginTop: 10 * scale }} />
          </View>
        ) : null}
        {order
          .filter((k) => !['skills', 'certifications', 'languages'].includes(k))
          .map((k) => (
            <View key={k}>{renderSection(k, resume as any, colors, headingStyle, scale)}</View>
          ))}
      </View>
    )

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ flexDirection: 'row' }}>
            {variant === 'sidebar-left' ? (
              <>
                {sidebar}
                {main}
              </>
            ) : (
              <>
                {main}
                {sidebar}
              </>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {variant === 'top-banner' ? (
          <View style={{ borderTopWidth: 10, borderTopColor: colors.primary, paddingTop: 10 * scale }}>
            {header}
            <View style={{ height: 1, backgroundColor: colors.accent, marginTop: 10 * scale, marginBottom: 10 * scale }} />
            <View style={{ gap: 12.5 * scale }}>
              {order.map((k) => (
                <View key={k}>{renderSection(k, resume as any, colors, headingStyle, scale)}</View>
              ))}
            </View>
          </View>
        ) : variant === 'centered' ? (
          <View style={{ marginTop: 4 * scale }}>
            {header}
            <View style={{ height: 1, backgroundColor: colors.accent, marginTop: 10 * scale, marginBottom: 10 * scale }} />
            <View style={{ gap: 12.5 * scale }}>
              {order.map((k) => (
                <View key={k}>{renderSection(k, resume as any, colors, headingStyle, scale)}</View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ marginTop: 4 * scale }}>
            {header}
            <View style={{ height: 1, backgroundColor: colors.accent, marginTop: 10 * scale, marginBottom: 10 * scale }} />
            <View style={{ gap: 12.5 * scale }}>
              {order.map((k) => (
                <View key={k}>{renderSection(k, resume as any, colors, headingStyle, scale)}</View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}

function CoverLetterPdfDoc({ resume }: { resume: Resume }) {
  const template = getTemplateById(resume.templateId)
  const colors: Colors = template?.colors ?? {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#e2e8f0',
    background: '#ffffff',
    text: '#0f172a',
  }
  const cfg = template ? getLayoutConfig(template) : null
  const headerAlign = cfg?.headerAlign ?? 'left'

  const name = resume.personalInfo?.fullName || 'Cover Letter'
  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
    resume.personalInfo?.homeAddress,
  ]
    .filter(Boolean)
    .join(' • ')

  const jobLine = [resume.coverLetter?.jobTitle, resume.coverLetter?.company].filter(Boolean).join(' — ')
  const body = String(resume.coverLetter?.body || '').trim()
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

  return (
    <Document>
      <Page size="A4" style={{ paddingTop: 18, paddingBottom: 16, paddingHorizontal: 18, backgroundColor: '#ffffff', fontFamily: 'Helvetica' }}>
        <View style={{ borderTopWidth: 8, borderTopColor: colors.primary, paddingTop: 12 }}>
          <View style={{ alignItems: headerAlign === 'center' ? 'center' : 'flex-start' }}>
            <Text style={{ fontSize: 18, fontWeight: 800 as any, color: colors.text }}>{name}</Text>
            {contact ? <Text style={{ fontSize: 9.5, color: colors.secondary, marginTop: 6 }}>{contact}</Text> : null}
            {jobLine ? <Text style={{ fontSize: 10, color: colors.secondary, marginTop: 6 }}>{jobLine}</Text> : null}
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: colors.accent, marginTop: 10, marginBottom: 12 }} />
        <View style={{ gap: 9 }}>
          {(paragraphs.length ? paragraphs : [' ']).map((p, idx) => (
            <Text key={idx} style={{ fontSize: 11, lineHeight: 1.35, color: '#111827' }}>
              {p}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export async function exportResumeTemplatePDF(resume: Resume) {
  const blob = await pdf(<ResumePdfDoc resume={resume} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilenameFromResume(resume)}-resume.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function exportCoverLetterTemplatePDF(resume: Resume) {
  const blob = await pdf(<CoverLetterPdfDoc resume={resume} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilenameFromResume(resume)}-cover-letter.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

