import { NextResponse } from 'next/server'

export function getRequestId(req: Request) {
  return (
    req.headers.get('x-request-id') ||
    req.headers.get('x-vercel-id') ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  )
}

export async function withApiLogging<T>(
  req: Request,
  route: string,
  handler: (ctx: { requestId: string; startMs: number }) => Promise<NextResponse<T>>
) {
  const requestId = getRequestId(req)
  const startMs = Date.now()

  try {
    const res = await handler({ requestId, startMs })
    const ms = Date.now() - startMs
    // Structured log for Vercel logs
    console.log(
      JSON.stringify({
        type: 'api',
        route,
        requestId,
        status: res.status,
        ms,
      })
    )
    res.headers.set('x-request-id', requestId)
    return res
  } catch (err: any) {
    const ms = Date.now() - startMs
    console.error(
      JSON.stringify({
        type: 'api_error',
        route,
        requestId,
        ms,
        message: String(err?.message || err),
      })
    )
    return NextResponse.json(
      { error: 'Internal server error', requestId } as any,
      { status: 500, headers: { 'x-request-id': requestId } }
    )
  }
}

