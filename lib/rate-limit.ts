import { NextResponse } from 'next/server'

type Bucket = {
  tokens: number
  updatedAt: number
}

const buckets = new Map<string, Bucket>()

function getClientIp(req: Request) {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip') || 'unknown'
}

export function rateLimitOr429(req: Request, opts?: { keyPrefix?: string; limit?: number; windowMs?: number }) {
  const limit = opts?.limit ?? 30
  const windowMs = opts?.windowMs ?? 10 * 60 * 1000
  const keyPrefix = opts?.keyPrefix ?? 'ai'

  const ip = getClientIp(req)
  const ua = req.headers.get('user-agent') || 'ua'
  const key = `${keyPrefix}:${ip}:${ua.slice(0, 40)}`

  const now = Date.now()
  const refillRate = limit / windowMs // tokens per ms

  const prev = buckets.get(key) ?? { tokens: limit, updatedAt: now }
  const elapsed = Math.max(0, now - prev.updatedAt)
  const tokens = Math.min(limit, prev.tokens + elapsed * refillRate)

  if (tokens < 1) {
    const retryAfterSec = Math.ceil((1 - tokens) / refillRate / 1000)
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, retryAfterSec)),
        },
      }
    )
  }

  buckets.set(key, { tokens: tokens - 1, updatedAt: now })
  return null
}

