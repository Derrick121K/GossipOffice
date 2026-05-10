'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCV } from '@/lib/store'

export default function BuilderIndexPage() {
  const router = useRouter()
  const { createResume, resumes } = useCV()

  useEffect(() => {
    // If there are existing resumes, go to the first one
    if (resumes.length > 0) {
      router.push(`/builder/${resumes[0].id}`)
    } else {
      // Create a new resume and go to it
      createResume('My Resume', 'johannesburg')
      const newId = Date.now().toString()
      router.push(`/builder/${newId}`)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your resume...</p>
      </div>
    </div>
  )
}
