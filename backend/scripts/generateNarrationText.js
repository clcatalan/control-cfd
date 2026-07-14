// One-time/manual script: rewrites detailed-explanation blocks into
// TTS-friendly natural language and writes them to
// frontend/src/data/narrationText.json. Run with:
//   node backend/scripts/generateNarrationText.js
// Requires OPENAI_API_KEY in backend/.env. Safe to re-run: existing keys in
// narrationText.json are preserved (so hand-edited rewrites survive), only
// missing keys are generated.

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const fs = require('fs')
const path = require('path')
const vm = require('vm')
const OpenAI = require('openai')

const PROBLEMS_PATH = path.join(__dirname, '../../frontend/src/data/leetcodeProblems.js')
const OUTPUT_PATH = path.join(__dirname, '../../frontend/src/data/narrationText.json')
const MODEL = 'gpt-5.4-nano'

const languageFields = {
  javascript: { dle: 'dleJS' },
  python: { dle: 'dlePython' },
  java: { dle: 'dleJava' },
  cpp: { dle: 'dleCPP' },
}

const LINE_LABEL_PATTERN = /^(lines?\s+[\d,\s-]+)\n([\s\S]*)$/i

// Mirrors frontend/src/utils/explanationParsing.js's parseDetailedExplanation,
// reimplemented here to avoid loading an ES module util from this CJS script.
function parseDetailedExplanation(text) {
  if (!text) return []
  return text.split('\n\n').map((paragraph, index) => {
    const match = paragraph.match(LINE_LABEL_PATTERN)
    if (!match) return { index, type: 'plain', text: paragraph }
    const [, , sentence] = match
    return { index, type: 'labeled', sentence }
  })
}

function loadProblems() {
  let src = fs.readFileSync(PROBLEMS_PATH, 'utf8')
  src = src.replace('export default leetcodeProblems', 'module.exports = leetcodeProblems')
  const sandbox = { module: { exports: {} }, exports: {}, require }
  vm.createContext(sandbox)
  new vm.Script(src, { filename: PROBLEMS_PATH }).runInContext(sandbox)
  return sandbox.module.exports
}

function loadExistingOutput() {
  if (!fs.existsSync(OUTPUT_PATH)) return {}
  return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'))
}

const SYSTEM_INSTRUCTIONS =
  'Rewrite the following algorithm explanation sentence so it can be read aloud naturally by a ' +
  'text-to-speech voice. Replace source code fragments, operators (e.g. <=, ===, =>, **), and ' +
  'mathematical notation (e.g. O(n log n), 10^5) with plain spoken English, preserving full ' +
  'technical accuracy and meaning. Do not add commentary, headers, or change the meaning of the ' +
  'sentence — return only the rewritten sentence.'

async function rewrite(client, sentence) {
  const response = await client.responses.create({
    model: MODEL,
    instructions: SYSTEM_INSTRUCTIONS,
    input: sentence,
  })
  return response.output_text.trim()
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not set (checked backend/.env)')
    process.exit(1)
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const problems = loadProblems()
  const output = loadExistingOutput()

  let generated = 0
  let skipped = 0

  for (const problem of problems) {
    for (const [language, fields] of Object.entries(languageFields)) {
      const dle = problem[fields.dle]
      if (!dle) continue

      const blocks = parseDetailedExplanation(dle)
      for (const block of blocks) {
        if (block.type !== 'labeled') continue
        const key = `${problem.id}:${language}:${block.index + 1}`

        if (output[key]) {
          skipped++
          continue
        }

        try {
          output[key] = await rewrite(client, block.sentence)
          generated++
          console.log(`Generated ${key}`)
        } catch (err) {
          console.error(`Failed ${key}:`, err.message)
        }
      }
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n')
  console.log(`Done. Generated ${generated}, skipped ${skipped} (already present). Wrote ${OUTPUT_PATH}`)
}

main()
