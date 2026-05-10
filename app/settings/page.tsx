'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Moon, Sun, Monitor, FileText } from 'lucide-react'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-background/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Theme Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Appearance</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Theme</label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Choose how ResumeBuilder looks to you
                </p>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Account</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Email Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your notification preferences
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: 'Resume updates',
                      description: 'Get notified when your resumes are updated',
                    },
                    {
                      label: 'Tips and tricks',
                      description: 'Receive helpful tips for building better resumes',
                    },
                    {
                      label: 'New features',
                      description: 'Learn about new features and improvements',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`notification-${idx}`}
                        defaultChecked
                        className="rounded"
                      />
                      <label htmlFor={`notification-${idx}`} className="flex-grow cursor-pointer">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Export Data */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Data</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Export Your Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all your resume data as a JSON file
                </p>
                <Button variant="outline">
                  Export Data as JSON
                </Button>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-red-200 dark:border-red-900">
            <h2 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400">
              Danger Zone
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Clear All Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will permanently delete all your resumes and data. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm('Are you sure? All your data will be deleted permanently.')) {
                      localStorage.clear()
                      window.location.reload()
                    }
                  }}
                >
                  Delete All Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
