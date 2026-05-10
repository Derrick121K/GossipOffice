// South African inspired CV templates with vibrant colors
export interface Template {
  id: string
  name: string
  description: string
  category: 'professional' | 'creative' | 'modern' | 'classic' | 'tech' | 'academic' | 'minimal'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  features: string[]
  popular?: boolean
  new?: boolean
}

export const TEMPLATES: Template[] = [
  // Professional Category
  {
    id: 'johannesburg',
    name: 'Johannesburg Executive',
    description: 'Bold gold and black design inspired by the City of Gold',
    category: 'professional',
    colors: {
      primary: '#FFD700',
      secondary: '#1C1C1C',
      accent: '#B8860B',
      background: '#FFFFFF',
      text: '#1C1C1C'
    },
    features: ['ATS-friendly', 'Executive style', 'Gold accents'],
    popular: true
  },
  {
    id: 'cape-town',
    name: 'Cape Town Coastal',
    description: 'Ocean blue tones reflecting Table Mountain views',
    category: 'professional',
    colors: {
      primary: '#1E90FF',
      secondary: '#4169E1',
      accent: '#00CED1',
      background: '#F8FBFF',
      text: '#1A1A2E'
    },
    features: ['Clean design', 'Professional', 'Coastal vibes'],
    popular: true
  },
  {
    id: 'pretoria',
    name: 'Pretoria Administrative',
    description: 'Classic government-style professional template',
    category: 'professional',
    colors: {
      primary: '#2F4F4F',
      secondary: '#708090',
      accent: '#20B2AA',
      background: '#FFFFFF',
      text: '#2F4F4F'
    },
    features: ['Formal', 'Traditional', 'ATS-optimized']
  },
  {
    id: 'durban',
    name: 'Durban Sunrise',
    description: 'Warm Indian Ocean sunrise colors',
    category: 'professional',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7C59F',
      accent: '#2EC4B6',
      background: '#FFFBF5',
      text: '#1A1A1A'
    },
    features: ['Warm tones', 'Welcoming', 'Memorable']
  },
  {
    id: 'bloemfontein',
    name: 'Bloemfontein Formal',
    description: 'Traditional judicial style with modern touches',
    category: 'professional',
    colors: {
      primary: '#800020',
      secondary: '#4A4A4A',
      accent: '#C9A227',
      background: '#FEFEFE',
      text: '#2D2D2D'
    },
    features: ['Authoritative', 'Classic', 'Refined']
  },

  // Creative Category
  {
    id: 'soweto',
    name: 'Soweto Vibrant',
    description: 'Bold, colorful design celebrating township creativity',
    category: 'creative',
    colors: {
      primary: '#FF1744',
      secondary: '#FFEA00',
      accent: '#00E676',
      background: '#1A1A1A',
      text: '#FFFFFF'
    },
    features: ['Bold colors', 'Creative', 'Stand out'],
    popular: true
  },
  {
    id: 'ndebele',
    name: 'Ndebele Patterns',
    description: 'Geometric patterns inspired by Ndebele art',
    category: 'creative',
    colors: {
      primary: '#E53935',
      secondary: '#43A047',
      accent: '#1E88E5',
      background: '#FFFFFF',
      text: '#212121'
    },
    features: ['Artistic', 'Cultural', 'Unique'],
    new: true
  },
  {
    id: 'kwaito',
    name: 'Kwaito Beats',
    description: 'Music-inspired urban creative template',
    category: 'creative',
    colors: {
      primary: '#9C27B0',
      secondary: '#FF9800',
      accent: '#00BCD4',
      background: '#FAFAFA',
      text: '#37474F'
    },
    features: ['Urban', 'Dynamic', 'Expressive']
  },
  {
    id: 'madiba',
    name: 'Madiba Legacy',
    description: 'Inspired by the colors of peace and reconciliation',
    category: 'creative',
    colors: {
      primary: '#007A4D',
      secondary: '#FFB612',
      accent: '#000000',
      background: '#FFFFFF',
      text: '#1A1A1A'
    },
    features: ['Inspiring', 'Dignified', 'Impactful'],
    popular: true
  },
  {
    id: 'shweshwe',
    name: 'Shweshwe Fabric',
    description: 'Traditional fabric-inspired indigo design',
    category: 'creative',
    colors: {
      primary: '#3F51B5',
      secondary: '#7986CB',
      accent: '#FF5722',
      background: '#E8EAF6',
      text: '#1A237E'
    },
    features: ['Traditional', 'Elegant', 'Cultural']
  },

  // Modern Category
  {
    id: 'rainbow-nation',
    name: 'Rainbow Nation',
    description: 'All six flag colors in modern gradient design',
    category: 'modern',
    colors: {
      primary: '#007A4D',
      secondary: '#FFB612',
      accent: '#E03C31',
      background: '#FFFFFF',
      text: '#000000'
    },
    features: ['Patriotic', 'Colorful', 'Modern'],
    popular: true
  },
  {
    id: 'tech-hub',
    name: 'Tech Hub',
    description: 'Silicon Cape inspired tech-forward design',
    category: 'modern',
    colors: {
      primary: '#6C63FF',
      secondary: '#3F3D56',
      accent: '#FF6584',
      background: '#F5F5F5',
      text: '#2D3436'
    },
    features: ['Tech-focused', 'Modern', 'Clean'],
    new: true
  },
  {
    id: 'safari',
    name: 'Safari Sunset',
    description: 'Warm savanna colors at golden hour',
    category: 'modern',
    colors: {
      primary: '#D4A574',
      secondary: '#8B4513',
      accent: '#CD853F',
      background: '#FDF5E6',
      text: '#3E2723'
    },
    features: ['Natural', 'Warm', 'Inviting']
  },
  {
    id: 'protea',
    name: 'Protea Bloom',
    description: 'National flower inspired pink and green',
    category: 'modern',
    colors: {
      primary: '#E91E63',
      secondary: '#4CAF50',
      accent: '#FFC107',
      background: '#FFF8E1',
      text: '#33691E'
    },
    features: ['Natural', 'Elegant', 'Distinctive'],
    new: true
  },
  {
    id: 'karoo',
    name: 'Karoo Desert',
    description: 'Earth tones from the semi-desert landscape',
    category: 'modern',
    colors: {
      primary: '#795548',
      secondary: '#A1887F',
      accent: '#FF7043',
      background: '#EFEBE9',
      text: '#4E342E'
    },
    features: ['Earthy', 'Grounded', 'Professional']
  },

  // Classic Category
  {
    id: 'union-buildings',
    name: 'Union Buildings',
    description: 'Sandstone-inspired classic elegance',
    category: 'classic',
    colors: {
      primary: '#8B7355',
      secondary: '#D4C4B0',
      accent: '#2E7D32',
      background: '#FAF8F5',
      text: '#3E2723'
    },
    features: ['Elegant', 'Timeless', 'Professional']
  },
  {
    id: 'winelands',
    name: 'Winelands Estate',
    description: 'Cape Dutch heritage with wine-inspired colors',
    category: 'classic',
    colors: {
      primary: '#722F37',
      secondary: '#F5F5DC',
      accent: '#556B2F',
      background: '#FFFEF7',
      text: '#2C1810'
    },
    features: ['Sophisticated', 'Classic', 'Refined']
  },
  {
    id: 'drakensberg',
    name: 'Drakensberg Peaks',
    description: 'Mountain-inspired cool blues and grays',
    category: 'classic',
    colors: {
      primary: '#37474F',
      secondary: '#78909C',
      accent: '#4DD0E1',
      background: '#ECEFF1',
      text: '#263238'
    },
    features: ['Strong', 'Dependable', 'Clear']
  },
  {
    id: 'garden-route',
    name: 'Garden Route',
    description: 'Lush green forest and ocean blend',
    category: 'classic',
    colors: {
      primary: '#2E7D32',
      secondary: '#81C784',
      accent: '#0288D1',
      background: '#E8F5E9',
      text: '#1B5E20'
    },
    features: ['Natural', 'Fresh', 'Balanced']
  },
  {
    id: 'kruger',
    name: 'Kruger Wild',
    description: 'Safari khaki and wildlife-inspired tones',
    category: 'classic',
    colors: {
      primary: '#5D4037',
      secondary: '#8D6E63',
      accent: '#FF8F00',
      background: '#FFF3E0',
      text: '#3E2723'
    },
    features: ['Adventurous', 'Natural', 'Warm']
  },

  // Tech Category
  {
    id: 'silicon-cape',
    name: 'Silicon Cape',
    description: 'Startup ecosystem inspired modern tech',
    category: 'tech',
    colors: {
      primary: '#00BFA5',
      secondary: '#6200EA',
      accent: '#FF4081',
      background: '#FAFAFA',
      text: '#212121'
    },
    features: ['Innovative', 'Tech-forward', 'Dynamic'],
    popular: true
  },
  {
    id: 'cyber-city',
    name: 'Cyber City',
    description: 'Futuristic Johannesburg tech hub design',
    category: 'tech',
    colors: {
      primary: '#00E5FF',
      secondary: '#651FFF',
      accent: '#FF1744',
      background: '#121212',
      text: '#E0E0E0'
    },
    features: ['Futuristic', 'Bold', 'Modern'],
    new: true
  },
  {
    id: 'fintech',
    name: 'FinTech Hub',
    description: 'Financial technology professional style',
    category: 'tech',
    colors: {
      primary: '#1565C0',
      secondary: '#0D47A1',
      accent: '#00C853',
      background: '#E3F2FD',
      text: '#0D47A1'
    },
    features: ['Professional', 'Trustworthy', 'Modern']
  },
  {
    id: 'data-science',
    name: 'Data Analytics',
    description: 'Clean data visualization inspired design',
    category: 'tech',
    colors: {
      primary: '#5C6BC0',
      secondary: '#7E57C2',
      accent: '#26A69A',
      background: '#F5F5F5',
      text: '#37474F'
    },
    features: ['Analytical', 'Clean', 'Precise']
  },
  {
    id: 'developer',
    name: 'Developer Dark',
    description: 'Code editor inspired dark theme',
    category: 'tech',
    colors: {
      primary: '#61DAFB',
      secondary: '#BB86FC',
      accent: '#03DAC6',
      background: '#1E1E1E',
      text: '#D4D4D4'
    },
    features: ['Developer-friendly', 'Modern', 'Dark mode']
  },

  // Academic Category
  {
    id: 'stellenbosch',
    name: 'Stellenbosch Academic',
    description: 'University town scholarly elegance',
    category: 'academic',
    colors: {
      primary: '#8B0000',
      secondary: '#D4AF37',
      accent: '#2F4F4F',
      background: '#FFFFF0',
      text: '#1C1C1C'
    },
    features: ['Scholarly', 'Traditional', 'Prestigious']
  },
  {
    id: 'wits',
    name: 'Wits Research',
    description: 'Research institution blue and gold',
    category: 'academic',
    colors: {
      primary: '#003366',
      secondary: '#FFD700',
      accent: '#666666',
      background: '#F5F5F5',
      text: '#003366'
    },
    features: ['Academic', 'Research-focused', 'Professional']
  },
  {
    id: 'uct',
    name: 'UCT Scholar',
    description: 'Table Mountain university inspired',
    category: 'academic',
    colors: {
      primary: '#00008B',
      secondary: '#87CEEB',
      accent: '#228B22',
      background: '#F0F8FF',
      text: '#00008B'
    },
    features: ['Prestigious', 'Clean', 'Academic']
  },
  {
    id: 'rhodes',
    name: 'Rhodes Heritage',
    description: 'Eastern Cape academic tradition',
    category: 'academic',
    colors: {
      primary: '#800080',
      secondary: '#DDA0DD',
      accent: '#FFD700',
      background: '#FFF5EE',
      text: '#4B0082'
    },
    features: ['Traditional', 'Distinguished', 'Heritage']
  },
  {
    id: 'unisa',
    name: 'UNISA Distance',
    description: 'Open learning modern academic style',
    category: 'academic',
    colors: {
      primary: '#0066CC',
      secondary: '#FF6600',
      accent: '#339933',
      background: '#FFFFFF',
      text: '#333333'
    },
    features: ['Accessible', 'Modern', 'Professional']
  },

  // Minimal Category
  {
    id: 'clean-slate',
    name: 'Clean Slate',
    description: 'Ultra-minimal black and white',
    category: 'minimal',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#999999',
      background: '#FFFFFF',
      text: '#000000'
    },
    features: ['Minimal', 'ATS-perfect', 'Universal']
  },
  {
    id: 'paper-white',
    name: 'Paper White',
    description: 'Simple newspaper-style layout',
    category: 'minimal',
    colors: {
      primary: '#333333',
      secondary: '#777777',
      accent: '#AAAAAA',
      background: '#FAFAFA',
      text: '#1A1A1A'
    },
    features: ['Simple', 'Readable', 'Clean']
  },
  {
    id: 'nordic-light',
    name: 'Nordic Light',
    description: 'Scandinavian-inspired minimal design',
    category: 'minimal',
    colors: {
      primary: '#2D3436',
      secondary: '#636E72',
      accent: '#00CEC9',
      background: '#FFFFFF',
      text: '#2D3436'
    },
    features: ['Minimal', 'Modern', 'Elegant']
  },
  {
    id: 'zen',
    name: 'Zen Balance',
    description: 'Peaceful minimal aesthetic',
    category: 'minimal',
    colors: {
      primary: '#4A4A4A',
      secondary: '#8B8B8B',
      accent: '#98D1C3',
      background: '#F7F7F7',
      text: '#2D2D2D'
    },
    features: ['Calm', 'Balanced', 'Focused']
  },
  {
    id: 'mono',
    name: 'Mono Type',
    description: 'Typography-focused monospace design',
    category: 'minimal',
    colors: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
      accent: '#007ACC',
      background: '#FFFFFF',
      text: '#1A1A1A'
    },
    features: ['Typography', 'Clean', 'Technical']
  }
]

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', count: TEMPLATES.length },
  { id: 'professional', name: 'Professional', count: TEMPLATES.filter(t => t.category === 'professional').length },
  { id: 'creative', name: 'Creative', count: TEMPLATES.filter(t => t.category === 'creative').length },
  { id: 'modern', name: 'Modern', count: TEMPLATES.filter(t => t.category === 'modern').length },
  { id: 'classic', name: 'Classic', count: TEMPLATES.filter(t => t.category === 'classic').length },
  { id: 'tech', name: 'Tech', count: TEMPLATES.filter(t => t.category === 'tech').length },
  { id: 'academic', name: 'Academic', count: TEMPLATES.filter(t => t.category === 'academic').length },
  { id: 'minimal', name: 'Minimal', count: TEMPLATES.filter(t => t.category === 'minimal').length },
]

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'all') return TEMPLATES
  return TEMPLATES.filter(t => t.category === category)
}

export function getPopularTemplates(): Template[] {
  return TEMPLATES.filter(t => t.popular)
}

export function getNewTemplates(): Template[] {
  return TEMPLATES.filter(t => t.new)
}
