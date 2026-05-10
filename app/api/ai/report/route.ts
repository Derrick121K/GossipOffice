'use server'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimitOr429 } from '@/lib/rate-limit'
import { withApiLogging } from '@/lib/request-logger'

const BodySchema = z.object({
  topic: z.string().optional().default(''),
  inputs: z.string().optional().default(''),
})

export async function POST(req: Request) {
  return withApiLogging(req, '/api/ai/report', async ({ requestId }) => {
  const limited = rateLimitOr429(req, { keyPrefix: 'ai:report', limit: 20, windowMs: 10 * 60 * 1000 })
  if (limited) return limited

  const key = process.env.GROQ_API_KEY
  if (!key) return NextResponse.json({ error: 'Missing GROQ_API_KEY on server' }, { status: 500 })

  const json = await req.json().catch(() => null)
  const body = BodySchema.safeParse(json)
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid input', details: body.error.flatten() }, { status: 400 })
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
  const system = 'You write clear, structured business reports. Output plain text only (no markdown headings).'
  const user = `Create a structured report.

Topic: ${body.data.topic || '(not provided)'}

Inputs/data:
${body.data.inputs || '(none)'}

Format:
Executive summary (3-5 lines)
Background
Findings (bullets)
Recommendations (bullets)
Next steps (bullets)`

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.4,
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

