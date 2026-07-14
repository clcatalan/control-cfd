export const languageFields = {
  javascript: { hle: 'hleJS', dle: 'dleJS' },
  python: { hle: 'hlePython', dle: 'dlePython' },
  java: { hle: 'hleJava', dle: 'dleJava' },
  cpp: { hle: 'hleCpp', dle: 'dleCPP' },
}

export const LINE_LABEL_PATTERN = /^(lines?\s+[\d,\s-]+)\n([\s\S]*)$/i

// "Lines 2, 9-11" -> [{start:2,end:2},{start:9,end:11}]; "line 3" -> [{start:3,end:3}]
export function parseLineRanges(label) {
  const numeric = label.replace(/^lines?\s+/i, '')
  return numeric
    .split(',')
    .map((token) => {
      const parts = token.trim().split('-').map(Number)
      return parts.length === 2 ? { start: parts[0], end: parts[1] } : { start: parts[0], end: parts[0] }
    })
    .filter((range) => Number.isFinite(range.start) && Number.isFinite(range.end))
}

// Returns an ordered list of blocks: { index, type: 'plain', text } or
// { index, type: 'labeled', label, sentence, ranges }
export function parseDetailedExplanation(text) {
  if (!text) return []
  return text.split('\n\n').map((paragraph, index) => {
    const match = paragraph.match(LINE_LABEL_PATTERN)
    if (!match) {
      return { index, type: 'plain', text: paragraph }
    }
    const [, label, sentence] = match
    return { index, type: 'labeled', label, sentence, ranges: parseLineRanges(label) }
  })
}
