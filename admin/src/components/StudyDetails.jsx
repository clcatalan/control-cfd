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

function StudyDetails({ group, title }) {
  const [problems, setProblems] = useState([])
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [problemsRes, progressRes] = await Promise.all([
          fetch(`${API_URL}/problems`),
          fetch(`${API_URL}/groups/${group}/progress`)
        ])
        const problemsData = await problemsRes.json()
        const progressData = await progressRes.json()

        if (problemsData.success) {
          setProblems(problemsData.problems)
        }
        if (progressData.success) {
          setParticipants(progressData.participants)
        } else {
          setError(`Failed to fetch ${group} group progress`)
        }
      } catch (err) {
        console.error('Error fetching study details:', err)
        setError('Unable to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [group])

  const sortedProblems = useMemo(
    () => [...problems].sort((a, b) => a.id - b.id),
    [problems]
  )

  const totals = useMemo(() => {
    let overReliance = 0
    let accuracy = 0
    participants.forEach((participant) => {
      const completions = participant.completions.map((c) => ({ id: c.problemId, ...c }))
      overReliance += countOverReliance(completions)
      accuracy += countAccuracy(completions)
    })
    return { overReliance, accuracy }
  }, [participants])

  const overRelianceDenominator = RED_PROBLEM_IDS.size * participants.length
  const accuracyDenominator = (RED_PROBLEM_IDS.size + GREEN_PROBLEM_IDS.size) * participants.length

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>{title}</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="section-header">
        <h3 className="section-label">{title}</h3>
      </div>

      {loading ? (
        <div className="loading">Loading progress...</div>
      ) : participants.length === 0 ? (
        <p className="schedule-panel-hint">No participants assigned to the {group} group yet.</p>
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
                        return (
                          <td key={problem.id} className={`progress-col ${problemColumnClass(problem.id)}`}>
                            <span className={className}>{label}</span>
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

export default StudyDetails
