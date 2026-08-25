// One-time/manual script: exports a participant x problem-number template CSV
// to quantitative-analysis/raw-data/coding_problem_responses.csv. The
// response column is left blank — population logic is handled separately.
// Run with:
//   node backend/scripts/exportCodingResponses.js

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

const OUTPUT_PATH = path.join(__dirname, '../../quantitative-analysis/raw-data/coding_problem_responses.csv')
const PROBLEM_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1) // 1..10, excludes onboarding sample problem 0
const ADMIN_TEST_PARTICIPANT_IDS = ['admin-con', 'admin-exp']

const GROUP_LABELS = {
  control: 'Group 1',
  experimental: 'Group 2',
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
    `SELECT participant_id, study_group
     FROM users
     WHERE participant_id != ALL($1)
     ORDER BY participant_id`,
    [ADMIN_TEST_PARTICIPANT_IDS]
  )

  const header = ['participant_id', 'group_id', 'problem_number', 'response']
  const lines = [header.join(',')]

  for (const { participant_id, study_group } of participants) {
    const groupId = GROUP_LABELS[study_group] || ''
    for (const problemNumber of PROBLEM_NUMBERS) {
      lines.push([participant_id, groupId, problemNumber, ''].join(','))
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
