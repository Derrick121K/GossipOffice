'use client'

import PptxGenJS from 'pptxgenjs'

export type SlideTheme = 'modernBlue' | 'darkPro' | 'minimalLight'

export async function exportSlidesPptx(
  deckTitle: string,
  slides: { title: string; bullets: string[] }[],
  theme: SlideTheme = 'modernBlue'
) {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'AI Tools'
  pptx.company = 'GossipOffice'
  pptx.subject = deckTitle
  pptx.title = deckTitle

  const pptxTheme = {
    headFontFace: 'Aptos Display',
    bodyFontFace: 'Aptos',
    lang: 'en-US',
  }
  pptx.theme = pptxTheme as any

  const palette =
    theme === 'darkPro'
      ? { bg: '0B1220', accent: '60A5FA', text: 'F9FAFB', muted: 'CBD5E1' }
      : theme === 'minimalLight'
        ? { bg: 'FFFFFF', accent: '111827', text: '111827', muted: '6B7280' }
        : { bg: 'FFFFFF', accent: '2563EB', text: '111827', muted: '6B7280' }
  const { bg, accent, text, muted } = palette

  slides.forEach((s, idx) => {
    const slide = pptx.addSlide()
    slide.background = { color: bg }

    // top accent bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 0.18,
      fill: { color: accent },
      line: { color: accent },
    })

    slide.addText(s.title || deckTitle, {
      x: 0.7,
      y: 0.6,
      w: 12,
      h: 0.8,
      fontFace: 'Aptos Display',
      fontSize: 34,
      bold: true,
      color: text,
    })

    const bullets = (s.bullets || []).slice(0, 7)
    const bulletText = bullets.map((b) => b.replace(/^\s*[-•]\s*/, '')).join('\n')

    slide.addText(bulletText || '', {
      x: 1.05,
      y: 1.7,
      w: 11.7,
      h: 4.8,
      fontFace: 'Aptos',
      fontSize: 20,
      color: muted,
      bullet: { indent: 18 },
      paraSpaceAfter: 10,
    })

    // footer
    slide.addText(`${deckTitle} • ${idx + 1}/${slides.length}`, {
      x: 0.7,
      y: 7.1,
      w: 12,
      h: 0.3,
      fontFace: 'Aptos',
      fontSize: 12,
      color: muted,
    })
  })

  await pptx.writeFile({ fileName: `${safeName(deckTitle)}.pptx` })
}

function safeName(name: string) {
  return (name || 'slides')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

