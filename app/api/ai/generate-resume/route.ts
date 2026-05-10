'use server'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimitOr429 } from '@/lib/rate-limit'
import { withApiLogging } from '@/lib/request-logger'

const BodySchema = z.object({
  profession: z.string().min(2),
  skills: z.string().min(2),
  experience: z.string().optional().default(''),
  jobAd: z.string().optional().default(''),
})

const GeneratedSchema = z.object({
  title: z.string().min(1),
  templateId: z.string().min(1).optional(),
  personalInfo: z
    .object({
      fullName: z.string().optional().default(''),
      email: z.string().optional().default(''),
      phone: z.string().optional().default(''),
      location: z.string().optional().default(''),
      summary: z.string().min(20),
    })
    .passthrough(),
  experience: z
    .array(
      z.object({
        id: z.string().min(1),
        jobTitle: z.string().min(1),
        company: z.string().min(1),
        location: z.string().optional().default(''),
        startDate: z.string().regex(/^\d{4}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}$/).optional().default(''),
        currentlyWorking: z.boolean().default(false),
        description: z.string().min(20),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        id: z.string().min(1),
        degree: z.string().min(1),
        school: z.string().min(1),
        field: z.string().optional().default(''),
        startDate: z.string().regex(/^\d{4}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}$/),
        details: z.string().optional().default(''),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        id: z.string().min(1),
        jobTitle: z.string().min(1),
        company: z.string().min(1),
        location: z.string().optional().default(''),
        startDate: z.string().regex(/^\d{4}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}$/).optional().default(''),
        currentlyWorking: z.boolean().default(false),
        description: z.string().min(20),
      })
    )
    .optional(),
  skills: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    })
  ),
  certifications: z.array(z.string().min(1)).optional(),
  languages: z.array(z.string().min(1)).optional(),
  customSections: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .optional(),
  references: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        title: z.string().optional(),
        company: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        relationship: z.string().optional(),
      })
    )
    .optional(),
})

export async function POST(req: Request) {
  return withApiLogging(req, '/api/ai/generate-resume', async ({ requestId }) => {
  const limited = rateLimitOr429(req, { keyPrefix: 'ai:gen-resume', limit: 10, windowMs: 10 * 60 * 1000 })
  if (limited) return limited

  const key = process.env.GROQ_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'Missing GROQ_API_KEY on server' }, { status: 500 })
  }

  const json = await req.json().catch(() => null)
  const body = BodySchema.safeParse(json)
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid input', details: body.error.flatten() }, { status: 400 })
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

  const system =
    'You are an expert resume writer. Return ONLY valid JSON that matches the schema described. Do not include markdown, code fences, or commentary.'

  const user = `Create a best-fit CV draft for this user.

Profession: ${body.data.profession}
Skills (comma or lines): ${body.data.skills}

Optional experience context (can be rough notes):
${body.data.experience || '(none)'}

Optional job advert:
${body.data.jobAd || '(none)'}

Return JSON with:
- title: a resume title (e.g. "<Profession> Resume")
- personalInfo.summary: 2-3 sentences tailored to the profession + job ad
- experience: 1-3 work experience entries (if user gave any experience notes; otherwise infer 1 plausible entry without fabricating employers that sound real—use generic names like "Company" is OK)
  - startDate/endDate MUST be "YYYY-MM" (for month inputs)
  - description should be 3-6 bullets as a single string using "- " lines
- education: 0-2 education entries
  - startDate/endDate MUST be "YYYY-MM"
- projects: 0-2 projects entries (use the same shape as experience; you can set company to the project/org name)
- skills: 8-14 items, each with {id, name, level} where level is beginner|intermediate|advanced
- certifications: 0-6 short strings (if relevant)
- languages: 0-6 strings (e.g. "English", "Zulu")
- customSections: include one section titled "Additional Information" with 3-6 bullet lines (use "- " lines) tailored to the profession (certs, availability, portfolio, clearance, etc.)

Schema example (must match types):
{
  "title": "Software Engineer Resume",
  "personalInfo": { "summary": "..." },
  "experience": [{
    "id": "1",
    "jobTitle": "Software Engineer",
    "company": "Company",
    "location": "Remote",
    "startDate": "2023-01",
    "endDate": "2025-03",
    "currentlyWorking": false,
    "description": "- Built ...\n- Improved ..."
  }],
  "education": [{
    "id": "1",
    "degree": "BSc",
    "school": "University",
    "field": "Computer Science",
    "startDate": "2019-01",
    "endDate": "2022-12",
    "details": "Honours / coursework ..."
  }],
  "projects": [{
    "id": "1",
    "jobTitle": "Project: Inventory App",
    "company": "Personal / Freelance",
    "location": "Remote",
    "startDate": "2024-02",
    "endDate": "2024-06",
    "currentlyWorking": false,
    "description": "- Built ...\n- Delivered ..."
  }],
  "skills": [{ "id": "1", "name": "TypeScript", "level": "advanced" }],
  "certifications": ["AWS CCP"],
  "languages": ["English"],
  "customSections": [{ "id": "1", "title": "Additional Information", "content": "- ..." }]
}`

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

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return NextResponse.json({ error: 'Model did not return JSON' }, { status: 502 })
  }

  const validated = GeneratedSchema.safeParse(parsed)
  if (!validated.success) {
    return NextResponse.json(
      { error: 'Model output failed validation', details: validated.error.flatten(), raw: parsed },
      { status: 502 }
    )
  }

  return NextResponse.json({ result: validated.data })
  })
}

