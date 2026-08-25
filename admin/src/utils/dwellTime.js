// Shared dwell-time math for the admin panel, used by both the per-participant page
// (UserDetail) and group-wide aggregates (StudyDetails). Keeping this in one place avoids
// the per-user and per-group views quietly disagreeing on how dwell time is defined.
//
// Expects events shaped like the raw pass-through from the backend: { event_name, metadata, created_at }

function eventsForProblem(events, problemId, eventName) {
  return events.filter((e) => e.event_name === eventName && e.metadata?.problemId === problemId)
}

// Earliest occurrence best reflects the initial generate click / narration finishing
export function earliestEventTimestamp(events, problemId, eventName) {
  const matches = eventsForProblem(events, problemId, eventName)
  if (matches.length === 0) return null
  const earliest = matches.reduce((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? a : b))
  return earliest.metadata?.timestamp ?? null
}

// Most recent occurrence best reflects the participant's final response
export function latestEventTimestamp(events, problemId, eventName) {
  const matches = eventsForProblem(events, problemId, eventName)
  if (matches.length === 0) return null
  const latest = matches.reduce((a, b) => (new Date(a.created_at) > new Date(b.created_at) ? a : b))
  return latest.metadata?.timestamp ?? null
}

// Time the participant spent deciding on a single problem, in whole seconds. Experimental-group
// participants get a voice narration of the AI solution, so their dwell time is measured from
// when that narration finished to their accept/reject call; control participants have no
// narration step, so it's measured from generation instead. All timestamps are logged
// client-side in the same 'YYYY-MM-DD HH:MM:ss' local format, so a plain Date diff is safe here.
export function dwellTimeSeconds(events, problemId, studyGroup) {
  const startAt =
    studyGroup === 'experimental'
      ? earliestEventTimestamp(events, problemId, 'voice_explanation_completed')
      : earliestEventTimestamp(events, problemId, 'generate_ai_solution_clicked')
  const respondedAtValue = latestEventTimestamp(events, problemId, 'accept_reject_clicked')
  if (!startAt || !respondedAtValue) return null
  const diffMs = new Date(respondedAtValue) - new Date(startAt)
  if (Number.isNaN(diffMs) || diffMs < 0) return null
  return Math.round(diffMs / 1000)
}

export function formatDwellTime(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined) return '—'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// A single participant's own average dwell time across a set of problems (null problems
// with no valid dwell time, e.g. timeouts, are excluded rather than counted as zero)
export function averageDwellTimeSeconds(events, problemIds, studyGroup) {
  const times = problemIds.map((id) => dwellTimeSeconds(events, id, studyGroup)).filter((t) => t !== null)
  if (times.length === 0) return null
  return Math.round(times.reduce((sum, t) => sum + t, 0) / times.length)
}
