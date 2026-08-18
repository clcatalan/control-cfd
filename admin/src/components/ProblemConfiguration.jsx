import React, { useEffect, useMemo, useState } from 'react'
import './StudyDetails.css'
import { RED_PROBLEM_IDS, GREEN_PROBLEM_IDS, countOverReliance, countAccuracy, classifyRejection } from '../utils/scoring'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

function problemColumnLabel(problemId) {
  return problemId === 0 ? 'S' : `P${problemId}`
}

function problemColumnClass(problemId) {
  if (RED_PROBLEM_IDS.has(problemId)) return 'progress-col-red'
  if (GREEN_PROBLEM_IDS.has(problemId)) return 'progress-col-green'
  return ''
}

function isPastDate(dateString) {
  const scheduledDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return scheduledDate < today
}

function ProblemConfiguration() {
  const [problems, setProblems] = useState([])
  const [participants, setParticipants] = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enablingKey, setEnablingKey] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [problemsRes, controlRes, experimentalRes, scheduleRes, adminTestRes] = await Promise.all([
          fetch(`${API_URL}/problems`),
          fetch(`${API_URL}/groups/control/progress`),
          fetch(`${API_URL}/groups/experimental/progress`),
          fetch(`${API_URL}/schedule`),
          fetch(`${API_URL}/admin-test-participants/progress`)
        ])
        const problemsData = await problemsRes.json()
        const controlData = await controlRes.json()
        const experimentalData = await experimentalRes.json()
        const scheduleData = await scheduleRes.json()
        const adminTestData = await adminTestRes.json()

        if (problemsData.success) {
          setProblems(problemsData.problems)
        }
        if (scheduleData.success) {
          setSchedule(scheduleData.schedule)
        }
        if (controlData.success && experimentalData.success) {
          const combined = [
            ...controlData.participants.map((p) => ({ ...p, group: 'control' })),
            ...experimentalData.participants.map((p) => ({ ...p, group: 'experimental' })),
            ...(adminTestData.success
              ? adminTestData.participants.map((p) => ({ ...p, isAdminTest: true }))
              : [])
          ].sort((a, b) => a.participantId.localeCompare(b.participantId))
          setParticipants(combined)
        } else {
          setError('Failed to fetch participant progress')
        }
      } catch (err) {
        console.error('Error fetching problem configuration:', err)
        setError('Unable to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEnable = async (participantId, problemId) => {
    const key = `${participantId}:${problemId}`
    setEnablingKey(key)
    setError('')
    try {
      const response = await fetch(`${API_URL}/users/${encodeURIComponent(participantId)}/problem-overrides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId })
      })
      const data = await response.json()
      if (data.success) {
        setParticipants((prev) =>
          prev.map((participant) =>
            participant.participantId === participantId
              ? { ...participant, overriddenProblemIds: [...(participant.overriddenProblemIds || []), problemId] }
              : participant
          )
        )
      } else {
        setError(data.message || 'Failed to enable problem')
      }
    } catch (err) {
      console.error('Error enabling problem:', err)
      setError('Failed to enable problem')
    } finally {
      setEnablingKey(null)
    }
  }

  const handleDisable = async (participantId, problemId) => {
    const key = `${participantId}:${problemId}`
    setEnablingKey(key)
    setError('')
    try {
      const response = await fetch(
        `${API_URL}/users/${encodeURIComponent(participantId)}/problem-overrides/${problemId}`,
        { method: 'DELETE' }
      )
      const data = await response.json()
      if (data.success) {
        setParticipants((prev) =>
          prev.map((participant) =>
            participant.participantId === participantId
              ? {
                  ...participant,
                  overriddenProblemIds: (participant.overriddenProblemIds || []).filter((id) => id !== problemId)
                }
              : participant
          )
        )
      } else {
        setError(data.message || 'Failed to disable problem')
      }
    } catch (err) {
      console.error('Error disabling problem:', err)
      setError('Failed to disable problem')
    } finally {
      setEnablingKey(null)
    }
  }

  const sortedProblems = useMemo(
    () => [...problems].sort((a, b) => a.id - b.id),
    [problems]
  )

  const scheduledDateByProblemId = useMemo(
    () => new Map(schedule.map((entry) => [entry.problem_id, entry.scheduled_date])),
    [schedule]
  )

  // Admin test participants (admin-con / admin-exp) are shown in the table for testing, but
  // excluded from the score totals below since they aren't real study data.
  const realParticipants = useMemo(
    () => participants.filter((p) => !p.isAdminTest),
    [participants]
  )

  const totals = useMemo(() => {
    let overReliance = 0
    let accuracy = 0
    realParticipants.forEach((participant) => {
      const completions = participant.completions.map((c) => ({ id: c.problemId, ...c }))
      overReliance += countOverReliance(completions)
      accuracy += countAccuracy(completions)
    })
    return { overReliance, accuracy }
  }, [realParticipants])

  const overRelianceDenominator = RED_PROBLEM_IDS.size * realParticipants.length
  const accuracyDenominator = (RED_PROBLEM_IDS.size + GREEN_PROBLEM_IDS.size) * realParticipants.length

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Problem Configuration</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="section-header">
        <h3 className="section-label">All Participants Progress</h3>
      </div>

      {loading ? (
        <div className="loading">Loading progress...</div>
      ) : participants.length === 0 ? (
        <p className="schedule-panel-hint">No participants yet.</p>
      ) : (
        <>
          <div className="score-summary">
            <div className="score-item">
              <span className="score-label">Over-reliance Score</span>
              <span className="score-value">{totals.overReliance}/{overRelianceDenominator}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Accuracy Score</span>
              <span className="score-value">{totals.accuracy}/{accuracyDenominator}</span>
            </div>
          </div>
          <div className="users-table-wrapper">
            <table className="users-table progress-table">
              <thead>
                <tr>
                  <th>Participant ID</th>
                  <th>Group</th>
                  {sortedProblems.map((problem) => (
                    <th key={problem.id} className={`progress-col ${problemColumnClass(problem.id)}`}>
                      {problemColumnLabel(problem.id)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => {
                  const completionByProblemId = new Map(
                    participant.completions.map((c) => [c.problemId, c])
                  )
                  return (
                    <tr key={participant.participantId}>
                      <td className="participant-id">{participant.participantId}</td>
                      <td className="progress-group-cell">
                        {participant.group === 'control' ? 'Control' : 'Experimental'}
                        {participant.isAdminTest && ' (test)'}
                      </td>
                      {sortedProblems.map((problem) => {
                        const completion = completionByProblemId.get(problem.id)
                        const response = completion?.response
                        let label = '—'
                        let className = 'progress-empty'
                        if (response === 'accept') {
                          label = 'A'
                          className = 'progress-accept'
                        } else if (response === 'reject') {
                          label = classifyRejection(problem.id, completion.bugType)
                          className = label === 'R-C' ? 'progress-reject-correct' : 'progress-reject-wrong'
                        } else if (response === 'timeout') {
                          label = 'TO'
                          className = 'progress-timeout'
                        }
                        const scheduledDate = scheduledDateByProblemId.get(problem.id)
                        const isEmptyPastDue = !response && scheduledDate && isPastDate(scheduledDate)
                        const isEnabled = (participant.overriddenProblemIds || []).includes(problem.id)
                        const key = `${participant.participantId}:${problem.id}`
                        return (
                          <td key={problem.id} className={`progress-col ${problemColumnClass(problem.id)}`}>
                            {isEmptyPastDue && isEnabled ? (
                              <button
                                type="button"
                                className="enable-problem-btn disable-problem-btn"
                                disabled={enablingKey === key}
                                onClick={() => handleDisable(participant.participantId, problem.id)}
                              >
                                {enablingKey === key ? 'Disabling…' : 'Disable'}
                              </button>
                            ) : isEmptyPastDue ? (
                              <button
                                type="button"
                                className="enable-problem-btn"
                                disabled={enablingKey === key}
                                onClick={() => handleEnable(participant.participantId, problem.id)}
                              >
                                {enablingKey === key ? 'Enabling…' : 'Enable'}
                              </button>
                            ) : (
                              <span className={className}>{label}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default ProblemConfiguration
