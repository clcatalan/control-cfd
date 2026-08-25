// Problems 2, 4, 7, 9, 10 have a synthetic error seeded into their solution;
// the rest (1, 3, 5, 6, 8) are correct as generated
export const RED_PROBLEM_IDS = new Set([2, 4, 7, 9, 10])
export const GREEN_PROBLEM_IDS = new Set([1, 3, 5, 6, 8])

// Ground-truth type of the bug seeded into each red problem's solution (as opposed to
// bug_type on a completion, which is the participant's own self-reported diagnosis)
export const SEEDED_BUG_TYPES = {
  2: 'Missing Corner Cases',
  4: 'Missing Corner Cases',
  7: 'Hallucinated Object',
  9: 'Hallucinated Object',
  10: 'Missing Corner Cases'
}

// Classifies a rejection as the correct call (R-C) or not (R-W):
// - Rejecting a green (bug-free) problem is always wrong, regardless of diagnosis
// - Rejecting a red (flawed) problem is correct only if the self-reported bug type
//   matches the actual seeded bug type for that problem
export function classifyRejection(problemId, bugType) {
  const isCorrect = RED_PROBLEM_IDS.has(problemId) && bugType === SEEDED_BUG_TYPES[problemId]
  return isCorrect ? 'R-C' : 'R-W'
}

// How often a participant accepted a flawed solution, out of all flawed problems
export function countOverReliance(completions) {
  return completions.filter((c) => RED_PROBLEM_IDS.has(c.id) && c.response === 'accept').length
}

// How often a participant made the correct call, out of all problems: accepting a
// correct solution, or rejecting a flawed one with the correctly diagnosed bug type
export function countAccuracy(completions) {
  return completions.filter(
    (c) =>
      (GREEN_PROBLEM_IDS.has(c.id) && c.response === 'accept') ||
      (RED_PROBLEM_IDS.has(c.id) && c.response === 'reject' && classifyRejection(c.id, c.bugType) === 'R-C')
  ).length
}

// Numeric mapping for the 5-point certainty Likert scale participants choose from
// when accepting/rejecting a solution (see ExplanationPanel's CERTAINTY_LEVELS)
export const CERTAINTY_SCORES = {
  'Very Uncertain': -2,
  'Uncertain': -1,
  'Neither Certain nor Uncertain': 0,
  'Certain': 1,
  'Very Certain': 2
}

// A participant's own average certainty score across their completions (problems with no
// certainty recorded, e.g. timeouts, are excluded rather than counted as zero)
export function averageCertaintyScore(completions) {
  const scores = completions.map((c) => CERTAINTY_SCORES[c.certainty]).filter((score) => score !== undefined)
  if (scores.length === 0) return null
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}
