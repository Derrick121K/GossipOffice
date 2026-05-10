'use client'

import { Resume } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { getTemplateById } from '@/lib/templates'
import { getLayoutConfig } from '@/lib/template-layouts'

type Colors = {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

function SectionTitle({
  title,
  colors,
  style,
}: {
  title: string
  colors: Colors
  style: ReturnType<typeof getLayoutConfig>['headingStyle']
}) {
  if (style === 'caps') {
    return (
      <div className="text-xs tracking-widest font-semibold mb-2" style={{ color: colors.secondary }}>
        {title.toUpperCase()}
      </div>
    )
  }
  if (style === 'pill') {
    return (
      <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: colors.accent, color: colors.text }}>
        {title}
      </div>
    )
  }
  if (style === 'bar') {
    return (
      <div className="flex items-center gap-3 mb-3">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.primary }} />
        <div className="text-sm font-bold" style={{ color: colors.text }}>
          {title}
        </div>
        <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
      </div>
    )
  }
  if (style === 'minimal') {
    return (
      <div className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
        {title}
      </div>
    )
  }
  // underline
  return (
    <div className="mb-3">
      <div className="text-sm font-bold" style={{ color: colors.text }}>
        {title}
      </div>
      <div className="h-0.5 w-10 mt-1" style={{ backgroundColor: colors.primary }} />
    </div>
  )
}

function ContactLine({ resume, colors }: { resume: any; colors: Colors }) {
  const items = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
    resume.personalInfo?.homeAddress,
    resume.personalInfo?.governmentId ? `ID: ${resume.personalInfo.governmentId}` : null,
  ].filter(Boolean)
  if (items.length === 0) return null
  return (
    <div className="text-xs mt-2" style={{ color: colors.secondary }}>
      {items.join(' • ')}
    </div>
  )
}

function Summary({ resume, colors, headingStyle }: { resume: any; colors: Colors; headingStyle: any }) {
  const summary = resume.personalInfo?.summary
  if (!summary) return null
  return (
    <div>
      <SectionTitle title="Professional Summary" colors={colors} style={headingStyle} />
      <div className="text-sm leading-relaxed" style={{ color: colors.secondary }}>
        {summary}
      </div>
    </div>
  )
}

function Skills({ resume, colors, headingStyle }: { resume: any; colors: Colors; headingStyle: any }) {
  const skills = Array.isArray(resume.skills) ? resume.skills : []
  if (skills.length === 0) return null
  return (
    <div>
      <SectionTitle title="Skills" colors={colors} style={headingStyle} />
      <div className="flex flex-wrap gap-2">
        {skills.map((s: any) => (
          <span
            key={s.id ?? s.name}
            className="text-xs font-medium px-2.5 py-1 rounded"
            style={{ backgroundColor: colors.accent, color: colors.text }}
          >
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

function BulletedText({ text, colors }: { text: string; colors: Colors }) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length <= 1) {
    return (
      <div className="text-sm" style={{ color: colors.secondary }}>
        {text}
      </div>
    )
  }
  return (
    <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: colors.secondary }}>
      {lines.map((l, i) => (
        <li key={i}>{l.replace(/^\s*[-•]\s*/, '')}</li>
      ))}
    </ul>
  )
}

function Experience({ resume, colors, headingStyle, title = 'Experience' }: { resume: any; colors: Colors; headingStyle: any; title?: string }) {
  const list = Array.isArray(resume.experience) ? resume.experience : []
  if (list.length === 0) return null
  return (
    <div>
      <SectionTitle title={title} colors={colors} style={headingStyle} />
      <div className="space-y-4">
        {list.map((exp: any) => (
          <div key={exp.id ?? `${exp.jobTitle}-${exp.company}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-sm" style={{ color: colors.text }}>
                  {exp.jobTitle || 'Role'}
                </div>
                <div className="text-xs" style={{ color: colors.secondary }}>
                  {[exp.company, exp.location].filter(Boolean).join(' • ')}
                </div>
              </div>
              <div className="text-[11px] whitespace-nowrap" style={{ color: colors.secondary }}>
                {exp.startDate ? `${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate || ''}` : ''}
              </div>
            </div>
            {exp.description ? <div className="mt-2"><BulletedText text={exp.description} colors={colors} /></div> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function Education({ resume, colors, headingStyle }: { resume: any; colors: Colors; headingStyle: any }) {
  const list = Array.isArray(resume.education) ? resume.education : []
  if (list.length === 0) return null
  return (
    <div>
      <SectionTitle title="Education" colors={colors} style={headingStyle} />
      <div className="space-y-3">
        {list.map((edu: any) => (
          <div key={edu.id ?? `${edu.degree}-${edu.school}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-sm" style={{ color: colors.text }}>
                  {[edu.degree, edu.field].filter(Boolean).join(' — ') || 'Education'}
                </div>
                <div className="text-xs" style={{ color: colors.secondary }}>
                  {edu.school}
                </div>
              </div>
              <div className="text-[11px] whitespace-nowrap" style={{ color: colors.secondary }}>
                {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ''}
              </div>
            </div>
            {edu.details ? <div className="text-xs mt-1" style={{ color: colors.secondary }}>{edu.details}</div> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function SimpleList({ title, items, colors, headingStyle }: { title: string; items: string[]; colors: Colors; headingStyle: any }) {
  if (!items.length) return null
  return (
    <div>
      <SectionTitle title={title} colors={colors} style={headingStyle} />
      <div className="flex flex-wrap gap-2">
        {items.map((t, i) => (
          <span key={`${t}-${i}`} className="text-xs px-2.5 py-1 rounded" style={{ backgroundColor: colors.accent, color: colors.text }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function References({ resume, colors, headingStyle }: { resume: any; colors: Colors; headingStyle: any }) {
  const refs = Array.isArray(resume.references) ? resume.references : []
  if (refs.length === 0) return null
  return (
    <div>
      <SectionTitle title="References" colors={colors} style={headingStyle} />
      <div className="space-y-2">
        {refs.map((r: any) => (
          <div key={r.id ?? r.name}>
            <div className="text-sm font-semibold" style={{ color: colors.text }}>
              {r.name}
            </div>
            <div className="text-xs" style={{ color: colors.secondary }}>
              {[r.title, r.company, r.relationship, r.email, r.phone].filter(Boolean).join(' • ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CustomSections({ resume, colors, headingStyle }: { resume: any; colors: Colors; headingStyle: any }) {
  const sections = Array.isArray(resume.customSections) ? resume.customSections : []
  if (sections.length === 0) return null
  return (
    <div className="space-y-5">
      {sections.map((s: any) => (
        <div key={s.id ?? s.title}>
          <SectionTitle title={s.title || 'Additional Information'} colors={colors} style={headingStyle} />
          {s.content ? <BulletedText text={s.content} colors={colors} /> : null}
        </div>
      ))}
    </div>
  )
}

function renderSection(key: any, resume: any, colors: Colors, headingStyle: any) {
  switch (key) {
    case 'summary':
      return <Summary resume={resume} colors={colors} headingStyle={headingStyle} />
    case 'experience':
      return <Experience resume={resume} colors={colors} headingStyle={headingStyle} />
    case 'projects':
      return <Experience resume={{ ...resume, experience: resume.projects }} colors={colors} headingStyle={headingStyle} title="Projects" />
    case 'education':
      return <Education resume={resume} colors={colors} headingStyle={headingStyle} />
    case 'skills':
      return <Skills resume={resume} colors={colors} headingStyle={headingStyle} />
    case 'certifications':
      return <SimpleList title="Certifications" items={Array.isArray(resume.certifications) ? resume.certifications : []} colors={colors} headingStyle={headingStyle} />
    case 'languages':
      return <SimpleList title="Languages" items={Array.isArray(resume.languages) ? resume.languages : []} colors={colors} headingStyle={headingStyle} />
    case 'references':
      return <References resume={resume} colors={colors} headingStyle={headingStyle} />
    case 'custom':
      return <CustomSections resume={resume} colors={colors} headingStyle={headingStyle} />
    default:
      return null
  }
}

export function ResumePreview({ resume }: { resume: Resume }) {
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

  const name = resume.personalInfo?.fullName || 'Your Name'
  const title = resume.title
  const summary = resume.personalInfo?.summary

  const hasAny =
    Boolean(summary) ||
    (Array.isArray(resume.experience) && resume.experience.length) ||
    (Array.isArray(resume.education) && resume.education.length) ||
    (Array.isArray(resume.skills) && resume.skills.length) ||
    (Array.isArray(resume.projects) && resume.projects.length) ||
    (Array.isArray(resume.certifications) && resume.certifications.length) ||
    (Array.isArray(resume.languages) && resume.languages.length) ||
    (Array.isArray(resume.references) && resume.references.length) ||
    (Array.isArray(resume.customSections) && resume.customSections.length)

  const ordered = cfg?.sectionOrder ?? [
    'summary',
    'experience',
    'projects',
    'education',
    'skills',
    'certifications',
    'languages',
    'references',
    'custom',
  ]

  const headerAlign = cfg?.headerAlign ?? 'left'
  const showPhoto =
    Boolean(resume.personalInfo?.showPhoto) &&
    (cfg?.showPhoto ?? true) &&
    Boolean(resume.personalInfo?.profileImage)

  const header = (
    <div className={headerAlign === 'center' ? 'text-center' : ''}>
      <div className="flex items-start gap-4" style={{ justifyContent: headerAlign === 'center' ? 'center' : 'flex-start' }}>
        {showPhoto && (
          <img
            src={resume.personalInfo.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            style={{ border: `2px solid ${colors.accent}` }}
          />
        )}
        <div>
          <div className="text-2xl font-extrabold" style={{ color: colors.text }}>
            {name}
          </div>
          <div className="text-xs mt-1" style={{ color: colors.secondary }}>
            {title}
          </div>
          <ContactLine resume={resume as any} colors={colors} />
        </div>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card
        id="resume-preview"
        className="shadow-2xl rounded-xl print:shadow-none overflow-hidden"
        style={{ backgroundColor: colors.background, color: colors.text, minHeight: '500px' }}
      >
        {variant === 'top-banner' ? (
          <div style={{ borderTop: `10px solid ${colors.primary}` }} className="p-8">
            <div className="pb-5 mb-6" style={{ borderBottom: `2px solid ${colors.accent}` }}>
              {header}
            </div>
            <div className="space-y-7">
              {ordered.map((k) => (
                <div key={k}>{renderSection(k, resume as any, colors, headingStyle)}</div>
              ))}
            </div>
          </div>
        ) : variant === 'centered' ? (
          <div className="p-8">
            <div className="pb-6 mb-6" style={{ borderBottom: `1px solid ${colors.accent}` }}>
              {header}
            </div>
            <div className="space-y-7">
              {ordered.map((k) => (
                <div key={k}>{renderSection(k, resume as any, colors, headingStyle)}</div>
              ))}
            </div>
          </div>
        ) : variant === 'sidebar-left' || variant === 'sidebar-right' ? (
          <div className="grid grid-cols-12">
            {variant === 'sidebar-left' ? (
              <>
                <div className="col-span-4 p-6" style={{ backgroundColor: `${colors.accent}22` }}>
                  {header}
                  <div className="mt-6 space-y-6">
                    <Skills resume={resume as any} colors={colors} headingStyle={headingStyle} />
                    <SimpleList title="Certifications" items={Array.isArray((resume as any).certifications) ? (resume as any).certifications : []} colors={colors} headingStyle={headingStyle} />
                    <SimpleList title="Languages" items={Array.isArray((resume as any).languages) ? (resume as any).languages : []} colors={colors} headingStyle={headingStyle} />
                  </div>
                </div>
                <div className="col-span-8 p-8">
                  <div className="space-y-7">
                    {ordered
                      .filter((k) => !['skills', 'certifications', 'languages'].includes(k))
                      .map((k) => (
                        <div key={k}>{renderSection(k, resume as any, colors, headingStyle)}</div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-8 p-8">
                  <div className="pb-5 mb-6" style={{ borderBottom: `1px solid ${colors.accent}` }}>
                    {header}
                  </div>
                  <div className="space-y-7">
                    {ordered
                      .filter((k) => !['skills', 'certifications', 'languages'].includes(k))
                      .map((k) => (
                        <div key={k}>{renderSection(k, resume as any, colors, headingStyle)}</div>
                      ))}
                  </div>
                </div>
                <div className="col-span-4 p-6" style={{ backgroundColor: `${colors.accent}22` }}>
                  <div className="space-y-6">
                    <Skills resume={resume as any} colors={colors} headingStyle={headingStyle} />
                    <SimpleList title="Certifications" items={Array.isArray((resume as any).certifications) ? (resume as any).certifications : []} colors={colors} headingStyle={headingStyle} />
                    <SimpleList title="Languages" items={Array.isArray((resume as any).languages) ? (resume as any).languages : []} colors={colors} headingStyle={headingStyle} />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : variant === 'ats' ? (
          <div className="p-8">
            <div className="pb-4 mb-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
              <div className="text-xl font-extrabold" style={{ color: colors.text }}>
                {name}
              </div>
              <div className="text-xs mt-1" style={{ color: colors.secondary }}>
                {[resume.personalInfo?.email, resume.personalInfo?.phone, resume.personalInfo?.location].filter(Boolean).join(' | ')}
              </div>
            </div>
            <div className="space-y-6">
              {ordered.map((k) => (
                <div key={k}>{renderSection(k, resume as any, colors, headingStyle)}</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="pb-5 mb-6" style={{ borderBottom: `2px solid ${colors.accent}` }}>
              {header}
            </div>
            <div className="space-y-7">
              {ordered.map((k) => (
                <div key={k}>{renderSection(k, resume as any, colors, headingStyle)}</div>
              ))}
            </div>
          </div>
        )}

        {!hasAny && (
          <div className="p-8 text-center text-sm" style={{ color: colors.secondary }}>
            Start adding content to see your resume preview
          </div>
        )}
      </Card>
    </motion.div>
  )
}
