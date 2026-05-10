'use server'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimitOr429 } from '@/lib/rate-limit'
import { withApiLogging } from '@/lib/request-logger'

const BodySchema = z.object({
  profession: z.string().min(2),
  jobTitle: z.string().optional().default(''),
  company: z.string().optional().default(''),
  skills: z.string().optional().default(''),
  experience: z.string().optional().default(''),
  jobAd: z.string().optional().default(''),
  tone: z.enum(['professional', 'confident', 'friendly']).optional().default('professional'),
})

export async function POST(req: Request) {
  return withApiLogging(req, '/api/ai/cover-letter', async ({ requestId }) => {
  const limited = rateLimitOr429(req, { keyPrefix: 'ai:cover', limit: 15, windowMs: 10 * 60 * 1000 })
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
    'You are an expert career writer. Output ONLY the cover letter text. No markdown, no headings like "Cover Letter:". Keep it one page.'

  const user = `Write a tailored cover letter.

Profession: ${body.data.profession}
Target job title: ${body.data.jobTitle || '(not provided)'}
Company: ${body.data.company || '(not provided)'}
Tone: ${body.data.tone}

Skills:
${body.data.skills || '(none)'}

Experience notes:
${body.data.experience || '(none)'}

Job advert:
${body.data.jobAd || '(none)'}

Requirements:
- 3–5 short paragraphs
- include a strong opening, evidence/impact, and a clear closing + call to action
- avoid buzzword overload
- do not invent credentials the user did not provide`

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
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
  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'Invalid Groq response' }, { status: 502 })
  }

  return NextResponse.json({ result: content.trim() })
  })
}

