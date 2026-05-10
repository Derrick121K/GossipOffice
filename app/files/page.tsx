'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, FileSpreadsheet, Presentation, Shapes, Trash2 } from 'lucide-react'

import { useCV } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

function typeIcon(type: string) {
  if (type === 'slides') return <Presentation className="w-4 h-4" />
  if (type === 'sheet') return <FileSpreadsheet className="w-4 h-4" />
  if (type === 'diagram') return <Shapes className="w-4 h-4" />
  return <FileText className="w-4 h-4" />
}

export default function FilesPage() {
  const [mounted, setMounted] = useState(false)
  const [q, setQ] = useState('')
  const { resumes, documents, deleteDocument, exportBackup, importBackup } = useCV()

  useEffect(() => setMounted(true), [])

  const filteredDocs = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return documents
    return documents.filter((d) => {
      return (
        d.title.toLowerCase().includes(query) ||
        d.type.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query)
      )
    })
  }, [documents, q])

  const filteredResumes = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return resumes
    return resumes.filter((r) => r.title.toLowerCase().includes(query))
  }, [resumes, q])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Files</h1>
            <p className="text-sm text-muted-foreground mt-1">
              All your documents, slides, and resumes (saved locally in your browser).
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Clearing site data or switching browsers/devices can remove local files. Export a backup to keep a copy.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="w-full sm:w-80">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files…" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  try {
                    const payload = exportBackup()
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `gossipoffice-backup-${new Date().toISOString().slice(0, 10)}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                    toast.success('Backup exported')
                  } catch (e: any) {
                    console.error(e)
                    toast.error('Failed to export backup')
                  }
                }}
              >
                Export Backup
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'application/json'
                  input.onchange = async () => {
                    const file = input.files?.[0]
                    if (!file) return
                    try {
                      const text = await file.text()
                      const parsed = JSON.parse(text)
                      const res = importBackup(parsed, 'merge')
                      if (!res.ok) {
                        toast.error(res.error)
                        return
                      }
                      toast.success('Backup imported')
                    } catch (e: any) {
                      console.error(e)
                      toast.error('Failed to import backup')
                    }
                  }
                  input.click()
                }}
              >
                Import Backup
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Resumes</div>
              <div className="text-xs text-muted-foreground">{filteredResumes.length}</div>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {filteredResumes.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        Updated {new Date(r.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Link href={`/builder/${r.id}`}>
                      <Button size="sm" variant="outline">Open</Button>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredResumes.length === 0 && (
                <div className="text-sm text-muted-foreground">No resumes found.</div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Documents</div>
              <div className="text-xs text-muted-foreground">{filteredDocs.length}</div>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {filteredDocs.map((d) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {typeIcon(d.type)}
                        <div className="font-medium truncate">{d.title}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {d.type} • Updated {new Date(d.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/tools?open=${encodeURIComponent(d.id)}`}>
                        <Button size="sm" variant="outline">Open</Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          deleteDocument(d.id)
                          toast.success('Deleted')
                        }}
                        aria-label="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredDocs.length === 0 && (
                <div className="text-sm text-muted-foreground">No documents found. Create one from AI Tools.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

