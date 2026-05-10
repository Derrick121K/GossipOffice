'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCV } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Edit2,
  Clock,
  FileText,
  Menu,
  X,
  Check,
  Sparkles,
  Download,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'
import { AIResumeDialog } from '@/components/dashboard/ai-resume-dialog'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const { resumes, deleteResume, createResume, updateResume } = useCV()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateResume = () => {
    createResume('Untitled Resume', 'johannesburg')
    toast.success('Resume created successfully!')
  }

  const handleDuplicate = (resume: any) => {
    createResume(`${resume.title} (Copy)`, resume.templateId)
    toast.success('Resume duplicated!')
  }

  const handleDelete = (id: string) => {
    deleteResume(id)
    toast.success('Resume deleted')
  }

  const handleStartEdit = (resume: any) => {
    setEditingId(resume.id)
    setEditTitle(resume.title)
  }

  const handleSaveEdit = (resume: any) => {
    updateResume({
      ...resume,
      title: editTitle,
      updatedAt: new Date(),
    })
    setEditingId(null)
    toast.success('Resume renamed!')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Page Header */}
      <motion.div 
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="border-b border-border bg-card/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Resumes</h1>
              <p className="text-muted-foreground">
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''} created
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <AIResumeDialog />
              <Button
                onClick={handleCreateResume}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/25 btn-shine"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Create New Resume
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {resumes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center"
              >
                <FileText className="w-12 h-12 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">No resumes yet</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Create your first professional resume and start landing your dream job
              </p>
              <Button
                onClick={handleCreateResume}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/25"
                size="lg"
              >
                <Sparkles className="w-5 h-5" />
                Create Your First Resume
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {resumes.map((resume) => (
                  <motion.div
                    key={resume.id}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className="h-full"
                  >
                    <Card className="overflow-hidden h-full flex flex-col group card-hover border-border/50 hover:border-primary/30">
                      {/* Preview Area */}
                      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 h-36 flex items-center justify-center border-b border-border overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <motion.div 
                          className="relative space-y-2 w-28 p-4 bg-card rounded-lg shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <div className="h-2 bg-primary/20 rounded w-full" />
                          <div className="h-1.5 bg-muted rounded w-4/5" />
                          <div className="h-1.5 bg-muted rounded w-3/5" />
                          <div className="h-1 bg-muted rounded w-full mt-2" />
                          <div className="h-1 bg-muted rounded w-4/5" />
                        </motion.div>
                      </div>

                      {/* Info */}
                      <div className="p-6 flex-grow">
                        {editingId === resume.id ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-2 mb-3"
                          >
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="text-sm"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(resume)}
                            />
                            <Button
                              size="icon"
                              className="h-9 w-9 bg-primary hover:bg-primary/90"
                              onClick={() => handleSaveEdit(resume)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ) : (
                          <h3 
                            className="font-semibold text-lg mb-2 truncate cursor-pointer hover:text-primary transition-colors"
                            onDoubleClick={() => handleStartEdit(resume)}
                          >
                            {resume.title}
                          </h3>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                          {resume.templateId} template
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="px-6 pb-6 flex gap-3">
                        <Link href={`/builder/${resume.id}`} className="flex-1">
                          <Button
                            variant="default"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-md shadow-primary/20"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                              <Menu className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleDuplicate(resume)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStartEdit(resume)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(resume.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
