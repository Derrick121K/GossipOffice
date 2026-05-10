'use client'

import { useMemo } from 'react'
import { Resume } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { scoreResume, getScoreLevel } from '@/lib/resume-scorer'
import { TrendingUp, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ResumeScore({ resume }: { resume: Resume }) {
  const { overall, sections, suggestions } = useMemo(
    () => scoreResume(resume),
    [resume]
  )

  const scoreLevel = getScoreLevel(overall)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-blue-500 to-cyan-500'
    if (score >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-rose-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-5 space-y-5 border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getScoreColor(overall)} flex items-center justify-center shadow-lg`}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Resume Score</h3>
            <p className="text-xs text-muted-foreground">Real-time analysis</p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <span className="text-sm font-medium text-muted-foreground">Overall Score</span>
            <motion.span 
              key={overall}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold"
            >
              <span className={`bg-gradient-to-r ${getScoreColor(overall)} bg-clip-text text-transparent`}>
                {overall}
              </span>
              <span className="text-lg text-muted-foreground">/100</span>
            </motion.span>
          </div>
          <div className="relative w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overall}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getScoreColor(overall)}`}
            />
          </div>
          <motion.div
            key={scoreLevel.level}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              overall >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              overall >= 60 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              overall >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {scoreLevel.level}
          </motion.div>
        </div>

        {/* Section Scores */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Section Breakdown
          </h4>
          {[
            { label: 'Personal Info', score: sections.personalInfo, max: 20, icon: '👤' },
            { label: 'Experience', score: sections.experience, max: 30, icon: '💼' },
            { label: 'Education', score: sections.education, max: 20, icon: '🎓' },
            { label: 'Skills', score: sections.skills, max: 20, icon: '⚡' },
          ].map((section, idx) => (
            <motion.div 
              key={section.label} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-1.5"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span>{section.icon}</span>
                  {section.label}
                </span>
                <span className="font-medium tabular-nums">
                  {section.score}/{section.max}
                </span>
              </div>
              <div className="relative w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(section.score / section.max) * 100}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-4 border-t border-border"
            >
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" />
                Suggestions to Improve
              </h4>
              <ul className="space-y-2">
                {suggestions.slice(0, 3).map((suggestion, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="text-sm text-muted-foreground flex gap-2 items-start"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                    <span>{suggestion}</span>
                  </motion.li>
                ))}
              </ul>
              {suggestions.length > 3 && (
                <p className="text-xs text-muted-foreground pl-6">
                  +{suggestions.length - 3} more suggestion
                  {suggestions.length - 3 > 1 ? 's' : ''}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
