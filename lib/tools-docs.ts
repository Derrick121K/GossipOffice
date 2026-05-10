'use client'

import { jsPDF } from 'jspdf'
import mammoth from 'mammoth'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Packer, Document, Paragraph, TextRun } from 'docx'

export async function extractDocxToText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return (result.value || '').trim()
}

export async function exportTextToDocx(text: string, filename: string) {
  const paragraphs = String(text || '')
    .split(/\n/)
    .map((l) => l.trimEnd())
    .map((l) => new Paragraph({ children: [new TextRun(l || ' ')] }))

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs.length ? paragraphs : [new Paragraph(' ')] }],
  })
  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, filename)
}

export async function exportTextToPdf(text: string, filename: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  // Fill the page more like a typical Word export: smaller margins, tighter leading.
  const marginX = 10
  const marginTop = 10
  const marginBottom = 10
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const maxWidth = pageWidth - marginX * 2
  let y = marginTop

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11.5)

  const raw = String(text || '').replace(/\r\n/g, '\n')
  const paragraphs = raw.split('\n')

  const addWrapped = (t: string) => {
    const textLine = t === '' ? ' ' : t
    const lines = doc.splitTextToSize(textLine, maxWidth)
    const lineHeight = 4.6

    // Add new pages as needed
    const needed = lines.length * lineHeight
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage()
      y = marginTop
    }

    doc.text(lines, marginX, y)
    y += needed + 2.2
  }

  for (const p of paragraphs.length ? paragraphs : [' ']) addWrapped(p)
  doc.save(filename)
}

export async function editPdfAddText(pdfBytes: ArrayBuffer, text: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  if (!pages.length) return await pdfDoc.save()

  const page = pages[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const { width, height } = page.getSize()

  page.drawText(String(text || ''), {
    x: 36,
    y: height - 48,
    size: 12,
    font,
    color: rgb(0.1, 0.1, 0.1),
  })

  return await pdfDoc.save()
}

export async function mergePdfs(files: ArrayBuffer[]): Promise<Uint8Array> {
  const out = await PDFDocument.create()
  for (const bytes of files) {
    const src = await PDFDocument.load(bytes)
    const copied = await out.copyPages(src, src.getPageIndices())
    copied.forEach((p) => out.addPage(p))
  }
  return await out.save()
}

export async function splitPdf(pdfBytes: ArrayBuffer): Promise<Uint8Array[]> {
  const src = await PDFDocument.load(pdfBytes)
  const outFiles: Uint8Array[] = []
  for (let i = 0; i < src.getPageCount(); i++) {
    const out = await PDFDocument.create()
    const [page] = await out.copyPages(src, [i])
    out.addPage(page)
    outFiles.push(await out.save())
  }
  return outFiles
}

export async function redactPdf(pdfBytes: ArrayBuffer, rects: { x: number; y: number; w: number; h: number }[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  if (!pages.length) return await pdfDoc.save()
  const page = pages[0]
  rects.forEach((r) => {
    page.drawRectangle({
      x: r.x,
      y: r.y,
      width: r.w,
      height: r.h,
      color: rgb(0, 0, 0),
    })
  })
  return await pdfDoc.save()
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

