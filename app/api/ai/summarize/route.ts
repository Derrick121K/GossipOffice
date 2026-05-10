'use server'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimitOr429 } from '@/lib/rate-limit'
import { withApiLogging } from '@/lib/request-logger'

const BodySchema = z.object({
  notes: z.string().min(5),
  tone: z.enum(['short', 'detailed']).optional().default('short'),
})

export async function POST(req: Request) {
  return withApiLogging(req, '/api/ai/summarize', async ({ requestId }) => {
  const limited = rateLimitOr429(req, { keyPrefix: 'ai:summarize', limit: 30, windowMs: 10 * 60 * 1000 })
  if (limited) return limited

  const key = process.env.GROQ_API_KEY
  if (!key) return NextResponse.json({ error: 'Missing GROQ_API_KEY on server' }, { status: 500 })

  const json = await req.json().catch(() => null)
  const body = BodySchema.safeParse(json)
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid input', details: body.error.flatten() }, { status: 400 })
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
  const system = 'You summarize notes clearly and professionally. Output plain text only.'
  const user = `Summarize these notes.\nTone: ${body.data.tone}\n\nNotes:\n${body.data.notes}\n\nReturn:\n- Key points\n- Actions\n- Decisions\n- Risks (if any)`

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!groqRes.ok) {
    const text = await groqRes.text().catch(() => '')
    return NextResponse.json({ error: 'Groq request failed', requestId, status: groqRes.status, details: text }, { status: 502 })
  }

  const data = (await groqRes.json()) as any
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string') return NextResponse.json({ error: 'Invalid Groq response' }, { status: 502 })

  return NextResponse.json({ result: content.trim() })
  })
}

