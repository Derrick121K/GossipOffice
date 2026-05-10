'use server'

import { NextResponse } from 'next/server'
import { rateLimitOr429 } from '@/lib/rate-limit'
import { withApiLogging } from '@/lib/request-logger'

type SuggestType = 'summary' | 'jobBullets' | 'skills'

function getString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

export async function POST(req: Request) {
  return withApiLogging(req, '/api/ai/suggest', async ({ requestId }) => {
  const limited = rateLimitOr429(req, { keyPrefix: 'ai:suggest', limit: 30, windowMs: 10 * 60 * 1000 })
  if (limited) return limited

  const key = process.env.GROQ_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: 'Missing GROQ_API_KEY on server' },
      { status: 500 }
    )
  }

  const body = (await req.json().catch(() => null)) as any
  const type = getString(body?.type) as SuggestType | null
  const category = getString(body?.category)
  const context = getString(body?.context) ?? ''

  if (!type || !['summary', 'jobBullets', 'skills'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

  const system =
    'You write concise, professional CV content. Output ONLY what the user asked for. No markdown, no headings, no preface.'

  let userPrompt = ''
  if (type === 'summary') {
    userPrompt = `Write a strong professional summary for a CV in 2-3 sentences.
Tone: confident, specific, not exaggerated.
Use provided context if available.
Context:
${context || '(none)'}`
  } else if (type === 'skills') {
    userPrompt = `Suggest 6-10 skills for a CV.
If category is provided, bias suggestions to it.
Return as a JSON array of strings only.
Category: ${category || '(none)'}
Context:
${context || '(none)'}`
  } else {
    userPrompt = `Write 3-5 impact-focused CV bullet points for a job experience entry.
If category is provided, bias to it.
Use action verbs, include measurable impact when possible.
Return as a JSON array of strings only.
Category: ${category || '(none)'}
Context:
${context || '(none)'}`
  }

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!groqRes.ok) {
    const text = await groqRes.text().catch(() => '')
    return NextResponse.json(
      { error: 'Groq request failed', requestId, status: groqRes.status, details: text },
      { status: 502 }
    )
  }

  const data = (await groqRes.json()) as any
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'Invalid Groq response' }, { status: 502 })
  }

  // For array-based outputs, try to parse JSON; otherwise return plain string.
  if (type === 'summary') {
    return NextResponse.json({ type, result: content.trim() })
  }

  const trimmed = content.trim()
  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
      return NextResponse.json({ type, result: parsed })
    }
  } catch {
    // fall through
  }

  // Fallback: split lines into bullets
  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 10)

  return NextResponse.json({ type, result: lines })
  })
}

