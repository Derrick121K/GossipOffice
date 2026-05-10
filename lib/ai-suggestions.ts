// Mock AI suggestions - in a real app, these would come from an AI API
export const aiSuggestions = {
  summaries: [
    "Results-driven professional with 5+ years of experience in software development. Proven track record of delivering high-quality solutions and leading cross-functional teams.",
    "Strategic leader with expertise in product management and business development. Skilled at identifying market opportunities and driving organizational growth.",
    "Creative designer with a passion for user-centered design. Experienced in creating intuitive interfaces and comprehensive design systems.",
    "Data-driven analyst with strong proficiency in Python, SQL, and data visualization. Passionate about extracting actionable insights from complex datasets.",
  ],
  
  jobBullets: {
    software: [
      "Designed and implemented scalable microservices architecture supporting 1M+ daily users",
      "Led cross-functional team of 8 engineers, improving deployment frequency by 40%",
      "Optimized database queries reducing API response time by 60%",
      "Mentored 3 junior developers, resulting in 2 promotions within 18 months",
    ],
    management: [
      "Managed P&L of $2M+ budget while maintaining 15% year-over-year growth",
      "Built and scaled team from 3 to 15 members in 2 years",
      "Implemented new processes reducing operational costs by 25%",
      "Led successful product launch, acquiring 10K+ customers in first quarter",
    ],
    design: [
      "Created design system used across 50+ product features, improving consistency and reducing dev time by 30%",
      "Conducted user research with 100+ participants, informing product strategy",
      "Redesigned core user flows, increasing conversion rate by 35%",
      "Led design thinking workshops with stakeholders to align on product vision",
    ],
    marketing: [
      "Developed go-to-market strategy for new product line, generating $5M in revenue",
      "Built and managed marketing team of 6, overseeing $1M annual budget",
      "Created content strategy resulting in 10K+ email subscribers",
      "Increased organic traffic by 150% through SEO optimization and content marketing",
    ],
  },

  skills: {
    technical: [
      "JavaScript", "TypeScript", "React", "Node.js", "Python",
      "AWS", "Docker", "Kubernetes", "SQL", "MongoDB",
      "GraphQL", "REST API", "Git", "CI/CD", "System Design"
    ],
    professional: [
      "Project Management", "Team Leadership", "Strategic Planning", "Problem Solving",
      "Communication", "Stakeholder Management", "Agile/Scrum", "Product Strategy"
    ],
    tools: [
      "Jira", "Slack", "GitHub", "VS Code", "Figma",
      "Google Analytics", "Tableau", "Salesforce", "HubSpot"
    ],
  },

  getRandomSummary: () => {
    const summaries = aiSuggestions.summaries
    return summaries[Math.floor(Math.random() * summaries.length)]
  },

  getRandomBullets: (category: keyof typeof aiSuggestions.jobBullets) => {
    const bullets = aiSuggestions.jobBullets[category] || aiSuggestions.jobBullets.software
    const count = Math.floor(Math.random() * 2) + 2
    return bullets
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  },

  getRandomSkills: (category: keyof typeof aiSuggestions.skills) => {
    const skills = aiSuggestions.skills[category] || aiSuggestions.skills.technical
    const count = Math.floor(Math.random() * 3) + 3
    return skills
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  },
}
