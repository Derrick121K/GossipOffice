'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react'
import { aiSuggestions } from '@/lib/ai-suggestions'
import toast from 'react-hot-toast'
import { Textarea } from '@/components/ui/textarea'

interface AISuggestionsProps {
  type: 'summary' | 'jobBullets' | 'skills'
  category?: string
  onSelect?: (value: string | string[]) => void
}

export function AISuggestionsPanel({ type, category, onSelect }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string | string[] | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState('')

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, category, context }),
      })

      if (!res.ok) {
        // Fallback to mock suggestions (no key / server error)
        let result
        if (type === 'summary') result = aiSuggestions.getRandomSummary()
        else if (type === 'jobBullets') result = aiSuggestions.getRandomBullets(category as any)
        else result = aiSuggestions.getRandomSkills(category as any)
        setSuggestions(result)
        toast('Using offline suggestions (Groq not configured)')
        return
      }

      const data = (await res.json()) as any
      const result = data?.result
      if (typeof result === 'string' || Array.isArray(result)) {
        setSuggestions(result)
        return
      }

      throw new Error('Invalid AI response')
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard!')
  }

  const handleSelect = (value: string | string[]) => {
    onSelect?.(value)
    toast.success('Applied suggestion!')
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-sm">AI Suggestions</h3>
      </div>

      <div className="mb-3 space-y-2">
        <Textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Optional: paste context (job title, role, achievements) to get better suggestions…"
          className="min-h-20 bg-white/60 dark:bg-background/40"
        />
      </div>

      {!suggestions ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={generateSuggestions}
          className="w-full gap-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Generating…' : 'Generate Suggestions'}
        </Button>
      ) : (
        <div className="space-y-3">
          {Array.isArray(suggestions) ? (
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="text-xs space-y-2">
                  <p className="text-sm text-foreground/80">{suggestion}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleCopy(suggestion)}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {suggestions}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSelect(suggestions)}
                >
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopy(suggestions)}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={generateSuggestions}
            className="w-full text-xs"
            disabled={loading}
          >
            {loading ? 'Generating…' : 'Generate Different'}
          </Button>
        </div>
      )}
    </Card>
  )
}
