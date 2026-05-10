import { Resume } from './store'

export interface ResumeScore {
  overall: number
  sections: {
    personalInfo: number
    experience: number
    education: number
    skills: number
  }
  suggestions: string[]
}

export function scoreResume(resume: Resume): ResumeScore {
  let score = 0
  const suggestions: string[] = []

  // Score personal info (max 20 points)
  let personalInfoScore = 0
  const { personalInfo } = resume

  if (personalInfo.fullName.length > 0) personalInfoScore += 5
  else suggestions.push('Add your full name')

  if (personalInfo.email.length > 0) personalInfoScore += 5
  else suggestions.push('Add your email address')

  if (personalInfo.phone.length > 0) personalInfoScore += 5
  else suggestions.push('Add your phone number')

  if (personalInfo.summary.length > 50) personalInfoScore += 5
  else suggestions.push('Write a more detailed professional summary (aim for 50+ characters)')

  // Score experience (max 30 points)
  let experienceScore = 0
  if (resume.experience.length > 0) {
    experienceScore = Math.min(30, resume.experience.length * 10)
    resume.experience.forEach((exp) => {
      if (!exp.description || exp.description.length < 50) {
        suggestions.push(`Add more details to "${exp.jobTitle}" job description`)
      }
    })
  } else {
    suggestions.push('Add at least one work experience entry')
  }

  // Score education (max 20 points)
  let educationScore = 0
  if (resume.education.length > 0) {
    educationScore = Math.min(20, resume.education.length * 10)
  } else {
    suggestions.push('Add your educational background')
  }

  // Score skills (max 20 points)
  let skillsScore = 0
  if (resume.skills.length >= 5) {
    skillsScore = 20
  } else if (resume.skills.length > 0) {
    skillsScore = Math.min(20, resume.skills.length * 4)
    suggestions.push(`Add more skills (aim for 5+, currently have ${resume.skills.length})`)
  } else {
    suggestions.push('Add your professional skills')
  }

  // Add image bonus
  if (personalInfo.profileImage) {
    personalInfoScore = Math.min(20, personalInfoScore + 5)
  }

  score = personalInfoScore + experienceScore + educationScore + skillsScore

  return {
    overall: Math.round(score),
    sections: {
      personalInfo: personalInfoScore,
      experience: experienceScore,
      education: educationScore,
      skills: skillsScore,
    },
    suggestions,
  }
}

export function getScoreLevel(score: number): {
  level: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  color: string
} {
  if (score >= 80) return { level: 'Excellent', color: 'text-green-600 dark:text-green-400' }
  if (score >= 60) return { level: 'Good', color: 'text-blue-600 dark:text-blue-400' }
  if (score >= 40) return { level: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' }
  return { level: 'Poor', color: 'text-red-600 dark:text-red-400' }
}
