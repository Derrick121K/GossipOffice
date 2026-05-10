'use server'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimitOr429 } from '@/lib/rate-limit'
import { withApiLogging } from '@/lib/request-logger'

const BodySchema = z.object({
  title: z.string().min(2),
  outline: z.string().min(5),
})

const ResultSchema = z.object({
  title: z.string().min(1),
  slides: z.array(
    z.object({
      title: z.string().min(1),
      bullets: z.array(z.string().min(1)).min(2).max(8),
    })
  ).min(3).max(10),
})

export async function POST(req: Request) {
  return withApiLogging(req, '/api/ai/slides', async ({ requestId }) => {
  const limited = rateLimitOr429(req, { keyPrefix: 'ai:slides', limit: 15, windowMs: 10 * 60 * 1000 })
  if (limited) return limited

  const key = process.env.GROQ_API_KEY
  if (!key) return NextResponse.json({ error: 'Missing GROQ_API_KEY on server' }, { status: 500 })

  const json = await req.json().catch(() => null)
  const body = BodySchema.safeParse(json)
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid input', details: body.error.flatten() }, { status: 400 })
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
  const system =
    'You create modern business slide decks. Output ONLY valid JSON matching the schema. No markdown or code fences.'

  const user = `Create a slide deck JSON.

Deck title: ${body.data.title}
Outline:
${body.data.outline}

JSON schema:
{
  "title": "Deck title",
  "slides": [
    { "title": "Slide title", "bullets": ["...", "..."] }
  ]
}

Rules:
- 5 to 8 slides
- each slide 3-6 bullets
- keep bullets short and modern`

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.5,
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

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return NextResponse.json({ error: 'Model did not return JSON' }, { status: 502 })
  }

  const validated = ResultSchema.safeParse(parsed)
  if (!validated.success) {
    return NextResponse.json({ error: 'Invalid slide JSON', details: validated.error.flatten(), raw: parsed }, { status: 502 })
  }

  return NextResponse.json({ result: validated.data })
  })
}

