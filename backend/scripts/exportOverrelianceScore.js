// One-time/manual script: computes a binary over-reliance score per
// participant/problem and writes it to quantitative-analysis/overreliance_score.csv.
//
// Scoring rule (response = 1 if any of the following, else 0):
//   - problem 2,4,7,9,10: response is 'accept'
//
// Also writes a Certainty column, mapping problem_completions.certainty to
// Very Uncertain=-2, Uncertain=-1, Neither Certain nor Uncertain=0, Certain=1, Very Certain=2.
//
// Run with:
//   node backend/scripts/exportOverrelianceScore.js

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

const OUTPUT_PATH = path.join(__dirname, '../../quantitative-analysis/overreliance_score.csv')
const PROBLEM_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1) // 1..10, excludes onboarding sample problem 0
const ADMIN_TEST_PARTICIPANT_IDS = ['admin-con', 'admin-exp']

const GROUP_LABELS = {
  control: 'Group 1',
  experimental: 'Group 2',
}

const ACCEPT_PROBLEMS = new Set([2, 4, 7, 9, 10])

const CERTAINTY_SCORES = {
  'Very Uncertain': -2,
  'Uncertain': -1,
  'Neither Certain nor Uncertain': 0,
  'Certain': 1,
  'Very Certain': 2,
}

function isOverreliance(problemNumber, response) {
  return ACCEPT_PROBLEMS.has(problemNumber) && response === 'accept'
}

function getCertaintyScore(completion) {
  if (completion?.certainty) return CERTAINTY_SCORES[completion.certainty]
  if (completion?.response === 'timeout') return 0
  return ''
}

const useLocal = process.env.DB_TARGET === 'local'
const connectionString = useLocal ? process.env.DATABASE_URL_LOCAL : process.env.DATABASE_URL

if (!connectionString) {
  const missingVar = useLocal ? 'DATABASE_URL_LOCAL' : 'DATABASE_URL'
  throw new Error(`${missingVar} environment variable is required`)
}

const pool = new Pool({
  connectionString,
  ssl: useLocal ? false : { rejectUnauthorized: false },
})

async function main() {
  console.log(`Connecting to ${useLocal ? 'local' : 'Neon'} Postgres`)

  const { rows: participants } = await pool.query(
    `SELECT id, participant_id, study_group
     FROM users
     WHERE participant_id != ALL($1)
     ORDER BY participant_id`,
    [ADMIN_TEST_PARTICIPANT_IDS]
  )

  const { rows: completions } = await pool.query(
    `SELECT user_id, problem_id, response, certainty FROM problem_completions`
  )
  const completionByUserAndProblem = new Map()
  for (const c of completions) {
    completionByUserAndProblem.set(`${c.user_id}:${c.problem_id}`, c)
  }

  const header = ['PID', 'group_id', 'problem_number', 'response', 'Certainty']
  const lines = [header.join(',')]

  for (const { id, participant_id, study_group } of participants) {
    const groupId = GROUP_LABELS[study_group] || ''
    for (const problemNumber of PROBLEM_NUMBERS) {
      const completion = completionByUserAndProblem.get(`${id}:${problemNumber}`)
      const score = isOverreliance(problemNumber, completion?.response) ? 1 : 0
      const certainty = getCertaintyScore(completion)
      lines.push([participant_id, groupId, problemNumber, score, certainty].join(','))
    }
  }

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n') + '\n')
  console.log(`Wrote ${participants.length} participants x ${PROBLEM_NUMBERS.length} problems (${lines.length - 1} rows) to ${OUTPUT_PATH}`)

  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
