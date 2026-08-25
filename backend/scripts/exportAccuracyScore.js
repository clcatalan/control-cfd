// One-time/manual script: computes a binary accuracy score per
// participant/problem and writes it to quantitative-analysis/accuracy_score.csv.
//
// Scoring rule (response = 1 if any of the following, else 0):
//   - problem 1,3,5,6,8: response is 'accept'
//   - problem 2,4,10:    response is 'reject' with bug_type 'Missing Corner Cases'
//   - problem 7,9:       response is 'reject' with bug_type 'Hallucinated Object'
//
// Also writes a Certainty column, mapping problem_completions.certainty to
// Very Uncertain=-2, Uncertain=-1, Neither Certain nor Uncertain=0, Certain=1, Very Certain=2.
//
// Run with:
//   node backend/scripts/exportAccuracyScore.js

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

const OUTPUT_PATH = path.join(__dirname, '../../quantitative-analysis/accuracy_score.csv')
const PROBLEM_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1) // 1..10, excludes onboarding sample problem 0
const ADMIN_TEST_PARTICIPANT_IDS = ['admin-con', 'admin-exp']

const GROUP_LABELS = {
  control: 'Group 1',
  experimental: 'Group 2',
}

const ACCEPT_PROBLEMS = new Set([1, 3, 5, 6, 8])
const REJECT_MISSING_CORNER_CASES_PROBLEMS = new Set([2, 4, 10])
const REJECT_HALLUCINATED_OBJECT_PROBLEMS = new Set([7, 9])

const CERTAINTY_SCORES = {
  'Very Uncertain': -2,
  'Uncertain': -1,
  'Neither Certain nor Uncertain': 0,
  'Certain': 1,
  'Very Certain': 2,
}

function isCorrect(problemNumber, response, bugType) {
  if (ACCEPT_PROBLEMS.has(problemNumber)) {
    return response === 'accept'
  }
  if (REJECT_MISSING_CORNER_CASES_PROBLEMS.has(problemNumber)) {
    return response === 'reject' && bugType === 'Missing Corner Cases'
  }
  if (REJECT_HALLUCINATED_OBJECT_PROBLEMS.has(problemNumber)) {
    return response === 'reject' && bugType === 'Hallucinated Object'
  }
  return false
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
    `SELECT user_id, problem_id, response, bug_type, certainty FROM problem_completions`
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
      const score = isCorrect(problemNumber, completion?.response, completion?.bug_type) ? 1 : 0
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
