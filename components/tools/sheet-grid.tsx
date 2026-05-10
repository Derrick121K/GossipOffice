import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

function colToName(col: number) {
  let n = col + 1
  let s = ''
  while (n > 0) {
    const r = (n - 1) % 26
    s = String.fromCharCode(65 + r) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

function nameToCol(name: string) {
  let n = 0
  for (const ch of name.toUpperCase()) {
    if (ch < 'A' || ch > 'Z') break
    n = n * 26 + (ch.charCodeAt(0) - 64)
  }
  return n - 1
}

function parseCellRef(ref: string) {
  const m = /^([A-Za-z]+)(\d+)$/.exec(ref.trim())
  if (!m) return null
  const col = nameToCol(m[1])
  const row = Math.max(0, Number(m[2]) - 1)
  if (col < 0 || !Number.isFinite(row)) return null
  return { row, col }
}

function parseCsv(csv: string) {
  const lines = csv.split(/\r?\n/).filter((l) => l.length > 0)
  return lines.map((l) => l.split(','))
}

function toCsv(grid: string[][]) {
  return grid.map((r) => r.join(',')).join('\n')
}

function safeNumber(v: any) {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

function expandRange(a: string, b: string) {
  const A = parseCellRef(a)
  const B = parseCellRef(b)
  if (!A || !B) return []
  const r1 = Math.min(A.row, B.row)
  const r2 = Math.max(A.row, B.row)
  const c1 = Math.min(A.col, B.col)
  const c2 = Math.max(A.col, B.col)
  const out: { row: number; col: number }[] = []
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) out.push({ row: r, col: c })
  }
  return out
}

function evalFormula(expr: string, getCell: (r: number, c: number) => string, stack: Set<string>) {
  // SUM(A1:B2)
  const sumRe = /SUM\(\s*([A-Za-z]+\d+)\s*:\s*([A-Za-z]+\d+)\s*\)/gi
  let expanded = expr.replace(sumRe, (_m, a, b) => {
    const cells = expandRange(a, b)
    const sum = cells.reduce((acc, { row, col }) => acc + safeNumber(resolveCell(row, col)), 0)
    return String(sum)
  })

  // Replace A1 refs with numbers
  expanded = expanded.replace(/([A-Za-z]+\d+)/g, (m) => {
    const rc = parseCellRef(m)
    if (!rc) return '0'
    return String(safeNumber(resolveCell(rc.row, rc.col)))
  })

  // Allow only safe characters for arithmetic
  const safe = expanded.replace(/\s+/g, '')
  if (!/^[0-9+\-*/().,]+$/.test(safe)) return '0'

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${safe})`)
    return String(safeNumber(fn()))
  } catch {
    return '0'
  }

  function resolveCell(r: number, c: number) {
    const key = `${r}:${c}`
    if (stack.has(key)) return '0'
    stack.add(key)
    const raw = getCell(r, c)
    const out =
      typeof raw === 'string' && raw.trim().startsWith('=')
        ? evalFormula(raw.trim().slice(1), getCell, stack)
        : raw
    stack.delete(key)
    return out
  }
}

export function SheetGrid({
  csv,
  onCsvChange,
  maxRows = 50,
  maxCols = 12,
}: {
  csv: string
  onCsvChange: (csv: string) => void
  maxRows?: number
  maxCols?: number
}) {
  const grid = useMemo(() => {
    const parsed = parseCsv(csv)
    const rows = Math.min(maxRows, Math.max(parsed.length, 10))
    const cols = Math.min(
      maxCols,
      Math.max(5, ...parsed.map((r) => r.length)),
    )

    const out: string[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => parsed[r]?.[c] ?? ''),
    )
    return out
  }, [csv, maxRows, maxCols])

  const getCell = (r: number, c: number) => grid[r]?.[c] ?? ''

  const displayCell = (r: number, c: number) => {
    const raw = getCell(r, c)
    if (typeof raw === 'string' && raw.trim().startsWith('=')) {
      return evalFormula(raw.trim().slice(1), getCell, new Set())
    }
    return raw
  }

  const commit = (r: number, c: number, value: string) => {
    const next = grid.map((row) => row.slice())
    next[r][c] = value
    onCsvChange(toCsv(next))
  }

  return (
    <Card className="p-0 overflow-hidden border border-border">
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 bg-muted/50">
            <tr>
              <th className="border border-border px-2 py-1 text-xs text-muted-foreground font-medium sticky left-0 bg-muted/50">
                #
              </th>
              {grid[0].map((_, c) => (
                <th key={c} className="border border-border px-2 py-1 text-xs text-muted-foreground font-medium">
                  {colToName(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                <td className="border border-border px-2 py-1 text-xs text-muted-foreground sticky left-0 bg-background">
                  {r + 1}
                </td>
                {row.map((_, c) => (
                  <td key={c} className="border border-border p-0">
                    <Input
                      value={getCell(r, c)}
                      onChange={(e) => commit(r, c, e.target.value)}
                      className="h-9 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      title={displayCell(r, c)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">
        Formulas: start with <span className="font-medium">=</span>, use refs like <span className="font-medium">A1</span> and <span className="font-medium">SUM(A1:B2)</span>.
      </div>
    </Card>
  )
}

