'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCV } from '@/lib/store'
import { BuilderForm } from '@/components/builder/builder-form'
import { ResumePreview } from '@/components/builder/resume-preview'
import { ResumeScore } from '@/components/builder/resume-score'
import { TemplateSwitcher } from '@/components/builder/template-switcher'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Download, Share2, Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportResumeToPDF } from '@/lib/pdf-export'
import { exportResumeToDOCX } from '@/lib/docx-export'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function BuilderPage() {
  const params = useParams()
  const id = params.id as string
  const [mounted, setMounted] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportingDocx, setExportingDocx] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const { setCurrentResume, currentResume } = useCV()

  useEffect(() => {
    setMounted(true)
    setCurrentResume(id)
  }, [id, setCurrentResume])

  const handleExportPDF = async () => {
    if (!currentResume) return
    
    try {
      setExporting(true)
      setExportSuccess(false)
      await exportResumeToPDF(currentResume, 'resume-preview')
      setExportSuccess(true)
      toast.success('Resume downloaded successfully!')
      
      // Reset success state after animation
      setTimeout(() => setExportSuccess(false), 2000)
    } catch (error) {
      console.error(error)
      toast.error('Failed to export resume. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const handleExportDOCX = async () => {
    if (!currentResume) return
    try {
      setExportingDocx(true)
      await exportResumeToDOCX(currentResume)
      toast.success('DOCX downloaded successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to export DOCX. Please try again.')
    } finally {
      setExportingDocx(false)
    }
  }

  const handleShare = () => {
    // Copy a placeholder share link
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (!mounted || !currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-muted-foreground text-lg">Loading your resume...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-none">
                {currentResume.title}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {currentResume.templateId} template
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <TemplateSwitcher resume={currentResume} />
              <Button
                onClick={handleExportPDF}
                variant="default"
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 min-w-[120px]"
                disabled={exporting}
              >
                <AnimatePresence mode="wait">
                  {exporting ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting...
                    </motion.span>
                  ) : exportSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Downloaded!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <Button
                onClick={handleExportDOCX}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={exportingDocx}
              >
                {exportingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                DOCX
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="gap-2 hidden sm:inline-flex"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Done
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form - 3 columns */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-3"
          >
            <BuilderForm resume={currentResume} />
          </motion.div>

          {/* Preview - 2 columns, sticky */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="sticky top-36 space-y-4">
              <ResumeScore resume={currentResume} />
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl opacity-50" />
                <ResumePreview resume={currentResume} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
