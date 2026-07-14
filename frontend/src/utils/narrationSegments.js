import { languageFields, parseDetailedExplanation } from './explanationParsing'
import narrationText from '../data/narrationText.json'

// blockIndex = detailedIndex + 1, matching each detailed-explanation paragraph.
// This numbering is the shared contract between the narration hook (drives
// audio + Monaco highlight) and ExplanationPanel (drives in-text highlight of
// the currently-spoken paragraph). Only the detailed explanation is narrated;
// the high-level explanation is read-only text.
export function buildNarrationSegments(problem, language) {
  const fields = languageFields[language] || languageFields.javascript
  const dle = problem?.[fields.dle]
  const segments = []

  parseDetailedExplanation(dle).forEach((block) => {
    const rawText = block.type === 'labeled' ? block.sentence : block.text
    if (rawText && rawText.trim()) {
      const blockIndex = block.index + 1
      // Prefer the pre-generated TTS-friendly rewrite (spoken aloud) over the
      // raw sentence (which is still what's shown on screen), falling back to
      // the raw sentence for any block the generator script hasn't covered.
      const spokenText = narrationText[`${problem?.id}:${language}:${blockIndex}`] || rawText
      segments.push({
        blockIndex,
        text: spokenText,
        ranges: block.type === 'labeled' ? block.ranges : [],
      })
    }
  })

  return segments
}
