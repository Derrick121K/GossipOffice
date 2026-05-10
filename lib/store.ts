import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTemplateById } from '@/lib/templates'

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  homeAddress: string
  governmentId: string
  showPhoto: boolean
  summary: string
  profileImage?: string
}

export interface Experience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  school: string
  field: string
  startDate: string
  endDate: string
  details?: string
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export interface Reference {
  id: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  relationship?: string
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

export interface Resume {
  id: string
  title: string
  templateId: string
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  certifications: string[]
  languages: string[]
  projects: Experience[]
  references: Reference[]
  customSections: CustomSection[]
  coverLetter: {
    jobTitle: string
    company: string
    body: string
    updatedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

export type DocumentType = 'doc' | 'notes' | 'summary' | 'report' | 'slides' | 'sheet' | 'pdf' | 'diagram'

export interface OfficeDocument {
  id: string
  type: DocumentType
  title: string
  content: string
  meta?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

interface CVStore {
  resumes: Resume[]
  documents: OfficeDocument[]
  currentResumeId: string | null
  currentResume: Resume | null
  currentTheme: 'light' | 'dark'
  
  setCurrentResume: (id: string) => void
  createResume: (title: string, templateId: string) => void
  createResumeWithData: (
    title: string,
    templateId: string,
    data: Partial<Omit<Resume, 'id' | 'title' | 'templateId' | 'createdAt' | 'updatedAt'>>
  ) => string
  updateResume: (resume: Resume) => void
  deleteResume: (id: string) => void
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void
  addExperience: (experience: Experience) => void
  updateExperience: (id: string, experience: Partial<Experience>) => void
  deleteExperience: (id: string) => void
  addEducation: (education: Education) => void
  updateEducation: (id: string, education: Partial<Education>) => void
  deleteEducation: (id: string) => void
  addSkill: (skill: Skill) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  deleteSkill: (id: string) => void
  addReference: (reference: Reference) => void
  updateReference: (id: string, reference: Partial<Reference>) => void
  deleteReference: (id: string) => void
  addCustomSection: (section: CustomSection) => void
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void
  deleteCustomSection: (id: string) => void
  updateCoverLetter: (data: Partial<Resume['coverLetter']>) => void
  createDocument: (type: DocumentType, title: string, content: string, meta?: OfficeDocument['meta']) => string
  updateDocument: (id: string, patch: Partial<Pick<OfficeDocument, 'title' | 'content' | 'meta'>>) => void
  deleteDocument: (id: string) => void
  setTheme: (theme: 'light' | 'dark') => void

  exportBackup: () => unknown
  importBackup: (data: unknown, mode?: 'replace' | 'merge') => { ok: true } | { ok: false; error: string }
}

const defaultResume: Resume = {
  id: '1',
  title: 'My Resume',
  templateId: 'johannesburg',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    homeAddress: '',
    governmentId: '',
    showPhoto: false,
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  projects: [],
  references: [],
  customSections: [],
  coverLetter: {
    jobTitle: '',
    company: '',
    body: '',
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

function ensureTemplateId(templateId: unknown): string {
  const id = typeof templateId === 'string' ? templateId : ''
  return getTemplateById(id) ? id : defaultResume.templateId
}

function ensureReferences(value: unknown): Reference[] {
  if (!Array.isArray(value)) return []
  // Backwards compat: old shape was string[]
  if (value.every((v) => typeof v === 'string')) {
    return (value as string[]).filter(Boolean).map((name) => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
    }))
  }
  // New shape
  return (value as any[]).map((v) => ({
    id: typeof v?.id === 'string' ? v.id : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: typeof v?.name === 'string' ? v.name : '',
    title: typeof v?.title === 'string' ? v.title : '',
    company: typeof v?.company === 'string' ? v.company : '',
    email: typeof v?.email === 'string' ? v.email : '',
    phone: typeof v?.phone === 'string' ? v.phone : '',
    relationship: typeof v?.relationship === 'string' ? v.relationship : '',
  }))
}

function ensureCustomSections(value: unknown): CustomSection[] {
  if (!Array.isArray(value)) return []
  return (value as any[]).map((v) => ({
    id: typeof v?.id === 'string' ? v.id : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: typeof v?.title === 'string' ? v.title : 'Additional Information',
    content: typeof v?.content === 'string' ? v.content : '',
  }))
}

function ensureDocumentType(value: unknown): DocumentType {
  const t = typeof value === 'string' ? value : ''
  const allowed: DocumentType[] = [
    'doc',
    'notes',
    'summary',
    'report',
    'slides',
    'sheet',
    'pdf',
    'diagram',
  ]
  return (allowed as string[]).includes(t) ? (t as DocumentType) : 'doc'
}

export const useCV = create<CVStore>()(
  persist(
    (set, get) => ({
      resumes: [defaultResume],
      documents: [],
      currentResumeId: '1',
      currentResume: defaultResume,
      currentTheme: 'light',

      setCurrentResume: (id: string) => {
        const resume = get().resumes.find((r) => r.id === id)
        if (resume) {
          set({ currentResumeId: id, currentResume: resume })
        }
      },

      createResume: (title: string, templateId: string) => {
        const newResume: Resume = {
          ...defaultResume,
          id: Date.now().toString(),
          title,
          templateId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          resumes: [...state.resumes, newResume],
          currentResumeId: newResume.id,
          currentResume: newResume,
        }))
      },

      createResumeWithData: (title, templateId, data) => {
        const id = Date.now().toString()
        const newResume: Resume = {
          ...defaultResume,
          ...data,
          id,
          title,
          templateId,
          references: ensureReferences((data as any)?.references),
          customSections: ensureCustomSections((data as any)?.customSections),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          resumes: [...state.resumes, newResume],
          currentResumeId: newResume.id,
          currentResume: newResume,
        }))
        return id
      },

      updateResume: (resume: Resume) => {
        set((state) => ({
          resumes: state.resumes.map((r) => (r.id === resume.id ? resume : r)),
          currentResume: resume,
        }))
      },

      deleteResume: (id: string) => {
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
          currentResumeId: state.currentResumeId === id ? state.resumes[0]?.id || null : state.currentResumeId,
          currentResume: state.currentResumeId === id ? state.resumes[0] || null : state.currentResume,
        }))
      },

      updatePersonalInfo: (info: Partial<PersonalInfo>) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            personalInfo: { ...current.personalInfo, ...info },
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      addExperience: (experience: Experience) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            experience: [...current.experience, experience],
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      updateExperience: (id: string, experience: Partial<Experience>) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            experience: current.experience.map((e) =>
              e.id === id ? { ...e, ...experience } : e
            ),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      deleteExperience: (id: string) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            experience: current.experience.filter((e) => e.id !== id),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      addEducation: (education: Education) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            education: [...current.education, education],
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      updateEducation: (id: string, education: Partial<Education>) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            education: current.education.map((e) =>
              e.id === id ? { ...e, ...education } : e
            ),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      deleteEducation: (id: string) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            education: current.education.filter((e) => e.id !== id),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      addSkill: (skill: Skill) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            skills: [...current.skills, skill],
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      updateSkill: (id: string, skill: Partial<Skill>) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            skills: current.skills.map((s) =>
              s.id === id ? { ...s, ...skill } : s
            ),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      deleteSkill: (id: string) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            skills: current.skills.filter((s) => s.id !== id),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      addReference: (reference: Reference) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            references: [...current.references, reference],
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      updateReference: (id: string, reference: Partial<Reference>) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            references: current.references.map((r) =>
              r.id === id ? { ...r, ...reference } : r
            ),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      deleteReference: (id: string) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            references: current.references.filter((r) => r.id !== id),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      addCustomSection: (section: CustomSection) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            customSections: [...current.customSections, section],
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      updateCustomSection: (id: string, section: Partial<CustomSection>) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            customSections: current.customSections.map((s) =>
              s.id === id ? { ...s, ...section } : s
            ),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      deleteCustomSection: (id: string) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            customSections: current.customSections.filter((s) => s.id !== id),
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      updateCoverLetter: (data) => {
        const current = get().currentResume
        if (current) {
          const updated = {
            ...current,
            coverLetter: {
              ...current.coverLetter,
              ...data,
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          }
          get().updateResume(updated)
        }
      },

      createDocument: (type, title, content, meta) => {
        const id = Date.now().toString()
        const doc: OfficeDocument = {
          id,
          type,
          title,
          content,
          meta,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ documents: [doc, ...state.documents] }))
        return id
      },

      updateDocument: (id, patch) => {
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id
              ? { ...d, ...patch, updatedAt: new Date() }
              : d
          ),
        }))
      },

      deleteDocument: (id) => {
        set((state) => ({ documents: state.documents.filter((d) => d.id !== id) }))
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ currentTheme: theme })
      },

      exportBackup: () => {
        const state = get()
        return {
          kind: 'gossipoffice-backup',
          version: 1,
          exportedAt: new Date().toISOString(),
          resumes: state.resumes,
          documents: state.documents,
          currentResumeId: state.currentResumeId,
          currentTheme: state.currentTheme,
        }
      },

      importBackup: (data, mode = 'replace') => {
        if (!data || typeof data !== 'object') return { ok: false, error: 'Invalid backup file.' }
        const d: any = data
        if (d.kind !== 'gossipoffice-backup') return { ok: false, error: 'Unrecognized backup format.' }

        const resumesRaw = Array.isArray(d.resumes) ? d.resumes : []
        const docsRaw = Array.isArray(d.documents) ? d.documents : []

        const upgradedResumes = resumesRaw.map((r: any) => ({
          ...defaultResume,
          ...r,
          id: String(r?.id ?? Date.now()),
          title: String(r?.title ?? 'Untitled Resume'),
          templateId: ensureTemplateId(r?.templateId),
          references: ensureReferences(r?.references),
          customSections: ensureCustomSections(r?.customSections),
          personalInfo: {
            ...defaultResume.personalInfo,
            ...(r?.personalInfo ?? {}),
            showPhoto: Boolean(r?.personalInfo?.showPhoto),
          },
          coverLetter: {
            ...defaultResume.coverLetter,
            ...(r?.coverLetter ?? {}),
            updatedAt: r?.coverLetter?.updatedAt ? new Date(r.coverLetter.updatedAt) : new Date(),
          },
          createdAt: r?.createdAt ? new Date(r.createdAt) : new Date(),
          updatedAt: r?.updatedAt ? new Date(r.updatedAt) : new Date(),
        }))

        const upgradedDocs = docsRaw.map((doc: any) => ({
          id: String(doc?.id ?? Date.now()),
          type: ensureDocumentType(doc?.type),
          title: String(doc?.title ?? 'Untitled'),
          content: String(doc?.content ?? ''),
          meta: doc?.meta ?? undefined,
          createdAt: doc?.createdAt ? new Date(doc.createdAt) : new Date(),
          updatedAt: doc?.updatedAt ? new Date(doc.updatedAt) : new Date(),
        }))

        const currentId =
          typeof d.currentResumeId === 'string' ? d.currentResumeId : upgradedResumes[0]?.id ?? defaultResume.id

        if (mode === 'merge') {
          const existing = get()
          const byId = new Map<string, Resume>(existing.resumes.map((r) => [r.id, r]))
          for (const r of upgradedResumes) byId.set(r.id, r)
          const docsById = new Map<string, OfficeDocument>(existing.documents.map((x) => [x.id, x]))
          for (const doc of upgradedDocs) docsById.set(doc.id, doc)
          const mergedResumes = Array.from(byId.values())
          const mergedDocs = Array.from(docsById.values())
          const currentResume =
            mergedResumes.find((r) => r.id === currentId) ?? mergedResumes[0] ?? defaultResume
          set({
            resumes: mergedResumes.length ? mergedResumes : [defaultResume],
            documents: mergedDocs,
            currentResumeId: currentResume?.id ?? null,
            currentResume,
            currentTheme: d.currentTheme === 'dark' ? 'dark' : 'light',
          })
          return { ok: true }
        }

        const currentResume =
          upgradedResumes.find((r: Resume) => r.id === currentId) ?? upgradedResumes[0] ?? defaultResume

        set({
          resumes: upgradedResumes.length ? upgradedResumes : [defaultResume],
          documents: upgradedDocs,
          currentResumeId: currentResume?.id ?? null,
          currentResume,
          currentTheme: d.currentTheme === 'dark' ? 'dark' : 'light',
        })
        return { ok: true }
      },
    }),
    {
      name: 'cv-store',
      version: 2,
      migrate: (persistedState: any) => {
        if (!persistedState) return persistedState

        const resumes = Array.isArray(persistedState.resumes) ? persistedState.resumes : []
        const documents = Array.isArray(persistedState.documents) ? persistedState.documents : []
        const upgradedResumes = resumes.map((r: any) => ({
          ...defaultResume,
          ...r,
          templateId: ensureTemplateId(r?.templateId),
          references: ensureReferences(r?.references),
          customSections: ensureCustomSections(r?.customSections),
          personalInfo: {
            ...defaultResume.personalInfo,
            ...(r?.personalInfo ?? {}),
            showPhoto: Boolean(r?.personalInfo?.showPhoto),
          },
          coverLetter: {
            ...defaultResume.coverLetter,
            ...(r?.coverLetter ?? {}),
            updatedAt: r?.coverLetter?.updatedAt ? new Date(r.coverLetter.updatedAt) : new Date(),
          },
          createdAt: r?.createdAt ? new Date(r.createdAt) : new Date(),
          updatedAt: r?.updatedAt ? new Date(r.updatedAt) : new Date(),
        }))

        const currentResumeId =
          typeof persistedState.currentResumeId === 'string'
            ? persistedState.currentResumeId
            : upgradedResumes[0]?.id ?? defaultResume.id

        const currentResume =
          upgradedResumes.find((r: Resume) => r.id === currentResumeId) ?? upgradedResumes[0] ?? defaultResume

        return {
          ...persistedState,
          resumes: upgradedResumes,
          documents: documents.map((d: any) => ({
            id: String(d?.id ?? Date.now()),
            type: ensureDocumentType(d?.type),
            title: String(d?.title ?? 'Untitled'),
            content: String(d?.content ?? ''),
            meta: d?.meta ?? undefined,
            createdAt: d?.createdAt ? new Date(d.createdAt) : new Date(),
            updatedAt: d?.updatedAt ? new Date(d.updatedAt) : new Date(),
          })),
          currentResumeId,
          currentResume,
        }
      },
    }
  )
)
