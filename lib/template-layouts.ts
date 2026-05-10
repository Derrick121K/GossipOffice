import type { Template } from './templates'

export type TemplateLayoutVariant =
  | 'ats'
  | 'single'
  | 'centered'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'top-banner'

export type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'languages'
  | 'references'
  | 'custom'

export type HeadingStyle = 'underline' | 'bar' | 'pill' | 'caps' | 'minimal'

export interface TemplateLayoutConfig {
  variant: TemplateLayoutVariant
  headingStyle: HeadingStyle
  sectionOrder: SectionKey[]
  sidebarEmphasis?: 'skills' | 'contacts' | 'mixed'
  headerAlign?: 'left' | 'center'
  showPhoto?: boolean
}

const DEFAULT_ORDER: SectionKey[] = [
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

// Each of the 35 templates gets its own config so layouts differ.
const CONFIGS: Record<string, TemplateLayoutConfig> = {
  // Professional
  johannesburg: { variant: 'top-banner', headingStyle: 'bar', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: true, sidebarEmphasis: 'mixed' },
  'cape-town': { variant: 'sidebar-right', headingStyle: 'pill', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: true, sidebarEmphasis: 'contacts' },
  pretoria: { variant: 'ats', headingStyle: 'caps', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false },
  durban: { variant: 'centered', headingStyle: 'underline', sectionOrder: DEFAULT_ORDER, headerAlign: 'center', showPhoto: true },
  bloemfontein: { variant: 'single', headingStyle: 'minimal', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false },

  // Creative
  soweto: { variant: 'top-banner', headingStyle: 'pill', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: true, sidebarEmphasis: 'mixed' },
  ndebele: { variant: 'sidebar-left', headingStyle: 'bar', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: true, sidebarEmphasis: 'skills' },
  kwaito: { variant: 'centered', headingStyle: 'pill', sectionOrder: DEFAULT_ORDER, headerAlign: 'center', showPhoto: false },
  madiba: { variant: 'single', headingStyle: 'underline', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: true },
  shweshwe: { variant: 'sidebar-right', headingStyle: 'bar', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'skills' },

  // Modern
  'rainbow-nation': { variant: 'top-banner', headingStyle: 'caps', sectionOrder: DEFAULT_ORDER, headerAlign: 'center', showPhoto: true, sidebarEmphasis: 'mixed' },
  'tech-hub': { variant: 'sidebar-left', headingStyle: 'minimal', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'skills' },
  safari: { variant: 'single', headingStyle: 'pill', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: true },
  protea: { variant: 'centered', headingStyle: 'bar', sectionOrder: DEFAULT_ORDER, headerAlign: 'center', showPhoto: true },
  karoo: { variant: 'ats', headingStyle: 'underline', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false },

  // Classic
  'union-buildings': { variant: 'single', headingStyle: 'caps', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false },
  winelands: { variant: 'sidebar-right', headingStyle: 'underline', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'contacts' },
  drakensberg: { variant: 'centered', headingStyle: 'minimal', sectionOrder: DEFAULT_ORDER, headerAlign: 'center', showPhoto: false },
  'garden-route': { variant: 'sidebar-left', headingStyle: 'pill', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: true, sidebarEmphasis: 'mixed' },
  kruger: { variant: 'top-banner', headingStyle: 'bar', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: true },

  // Tech
  'silicon-cape': { variant: 'sidebar-left', headingStyle: 'bar', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'skills' },
  'cyber-city': { variant: 'top-banner', headingStyle: 'pill', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'mixed' },
  fintech: { variant: 'ats', headingStyle: 'caps', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false },
  'data-science': { variant: 'sidebar-right', headingStyle: 'minimal', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'skills' },
  developer: { variant: 'centered', headingStyle: 'bar', sectionOrder: DEFAULT_ORDER, headerAlign: 'center', showPhoto: false },

  // Academic
  stellenbosch: { variant: 'ats', headingStyle: 'caps', sectionOrder: ['summary','education','experience','projects','skills','certifications','languages','references','custom'], headerAlign: 'left', showPhoto: false },
  wits: { variant: 'single', headingStyle: 'underline', sectionOrder: ['summary','education','experience','projects','skills','certifications','languages','references','custom'], headerAlign: 'left', showPhoto: false },
  uct: { variant: 'sidebar-right', headingStyle: 'bar', sectionOrder: ['summary','education','experience','projects','skills','certifications','languages','references','custom'], headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'mixed' },
  rhodes: { variant: 'centered', headingStyle: 'pill', sectionOrder: ['summary','education','experience','projects','skills','certifications','languages','references','custom'], headerAlign: 'center', showPhoto: false },
  unisa: { variant: 'top-banner', headingStyle: 'minimal', sectionOrder: ['summary','education','experience','projects','skills','certifications','languages','references','custom'], headerAlign: 'left', showPhoto: false },

  // Minimal
  'clean-slate': { variant: 'ats', headingStyle: 'minimal', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false },
  'paper-white': { variant: 'single', headingStyle: 'caps', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false },
  'nordic-light': { variant: 'centered', headingStyle: 'minimal', sectionOrder: DEFAULT_ORDER, headerAlign: 'center', showPhoto: false },
  zen: { variant: 'sidebar-right', headingStyle: 'underline', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'mixed' },
  mono: { variant: 'sidebar-left', headingStyle: 'caps', sectionOrder: DEFAULT_ORDER, headerAlign: 'left', showPhoto: false, sidebarEmphasis: 'skills' },
}

export function getLayoutConfig(template: Template): TemplateLayoutConfig {
  return CONFIGS[template.id] ?? {
    variant: 'single',
    headingStyle: 'underline',
    sectionOrder: DEFAULT_ORDER,
    headerAlign: 'left',
    showPhoto: true,
  }
}

