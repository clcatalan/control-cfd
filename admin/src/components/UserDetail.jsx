import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './UserDetail.css'
import './UsersTable.css'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

function UserDetail() {
  const { participantId } = useParams()
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState('')

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${API_URL}/users/${encodeURIComponent(participantId)}/progress`)
        const data = await response.json()
        if (data.success) {
          setProgress(data.progress)
        } else {
          setError(data.message || 'Failed to load progress')
        }
      } catch (err) {
        console.error('Error fetching progress:', err)
        setError('Unable to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [participantId])

  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true)
      setEventsError('')
      try {
        const response = await fetch(`${API_URL}/users/${encodeURIComponent(participantId)}/events`)
        const data = await response.json()
        if (data.success) {
          setEvents(data.events)
        } else {
          setEventsError(data.message || 'Failed to load events')
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setEventsError('Unable to connect to server')
      } finally {
        setEventsLoading(false)
      }
    }

    fetchEvents()
  }, [participantId])

  const responseLabel = (problem) => {
    if (problem.response === 'accept') return 'Accepted'
    if (problem.response === 'reject') return 'Rejected'
    if (problem.response === 'timeout') return 'Timed Out'
    return 'No response'
  }

  const problemLabel = (problem) => `P${problem.id}: ${problem.title.replace(/^\d+\.\s*/, '')}`

  // Problems 2, 4, 7, 9, 10 have a synthetic error seeded into their solution;
  // the rest (1, 3, 5, 6, 8) are correct as generated
  const redProblemIds = new Set([2, 4, 7, 9, 10])
  const greenProblemIds = new Set([1, 3, 5, 6, 8])
  const rowClass = (problem) => (redProblemIds.has(problem.id) ? 'row-red' : 'row-green')

  // How often the participant accepted a flawed solution, out of all flawed problems
  const overRelianceCount = progress.filter((p) => redProblemIds.has(p.id) && p.response === 'accept').length
  const overRelianceScore = `${overRelianceCount}/${redProblemIds.size}`

  // How often the participant made the correct call (accepting a correct solution
  // or rejecting a flawed one), out of all problems
  const accuracyCount = progress.filter(
    (p) =>
      (greenProblemIds.has(p.id) && p.response === 'accept') ||
      (redProblemIds.has(p.id) && p.response === 'reject')
  ).length
  const accuracyScore = `${accuracyCount}/${greenProblemIds.size + redProblemIds.size}`

  const eventsForProblem = (problemId, eventName) =>
    events.filter((event) => event.event_name === eventName && event.metadata?.problemId === problemId)

  // Earliest occurrence best reflects the initial problem open / generate click
  const earliestEventTimestamp = (problemId, eventName) => {
    const matches = eventsForProblem(problemId, eventName)
    if (matches.length === 0) return null
    const earliest = matches.reduce((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? a : b))
    return earliest.metadata?.timestamp ?? null
  }

  // Most recent occurrence best reflects the participant's final response
  const latestEventTimestamp = (problemId, eventName) => {
    const matches = eventsForProblem(problemId, eventName)
    if (matches.length === 0) return null
    const latest = matches.reduce((a, b) => (new Date(a.created_at) > new Date(b.created_at) ? a : b))
    return latest.metadata?.timestamp ?? null
  }

  const latestEventMetadata = (problemId, eventName) => {
    const matches = eventsForProblem(problemId, eventName)
    if (matches.length === 0) return null
    const latest = matches.reduce((a, b) => (new Date(a.created_at) > new Date(b.created_at) ? a : b))
    return latest.metadata ?? null
  }

  const problemOpenedAt = (problemId) => earliestEventTimestamp(problemId, 'problem_opened')
  const generateClickedAt = (problemId) => earliestEventTimestamp(problemId, 'generate_ai_solution_clicked')
  const voiceExplanationCompletedAt = (problemId) => earliestEventTimestamp(problemId, 'voice_explanation_completed')
  const respondedAt = (problemId) => latestEventTimestamp(problemId, 'accept_reject_clicked')
  const voiceReplayCount = (problemId) => eventsForProblem(problemId, 'repeated_voice_explanation').length

  // Most recent explicit dropdown selection; falls back to the language used at the
  // last generate click (covers participants who never touched the dropdown)
  const selectedLanguage = (problemId) =>
    latestEventMetadata(problemId, 'language_selected')?.language ??
    latestEventMetadata(problemId, 'generate_ai_solution_clicked')?.language ??
    null

  return (
    <div className="dashboard-content user-detail-page">
      <Link to="/" className="back-link">&larr; Back to Users</Link>

      <div className="user-detail-header">
        <h2>{participantId}</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <section className="detail-card">
        <h3>Problem Responses</h3>
        {loading ? (
          <div className="loading">Loading progress...</div>
        ) : !error ? (
          <>
            <div className="score-summary">
              <div className="score-item">
                <span className="score-label">Over-reliance Score</span>
                <span className="score-value">{overRelianceScore}</span>
              </div>
              <div className="score-item">
                <span className="score-label">Accuracy Score</span>
                <span className="score-value">{accuracyScore}</span>
              </div>
            </div>
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Problem Title</th>
                    <th>Response</th>
                    <th>Language</th>
                    <th>Problem Opened At</th>
                    <th>Solution Generated At</th>
                    <th>Voice Explanation Completed At</th>
                    <th>Participant Responded At</th>
                    <th>Voice Replays</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((problem) => {
                    const language = selectedLanguage(problem.id)
                    const openedAt = problemOpenedAt(problem.id)
                    const generatedAt = generateClickedAt(problem.id)
                    const voiceCompletedAt = voiceExplanationCompletedAt(problem.id)
                    const respondedAtValue = respondedAt(problem.id)
                    const replayCount = voiceReplayCount(problem.id)
                    return (
                      <tr key={problem.id} className={rowClass(problem)}>
                        <td>{problemLabel(problem)}</td>
                        <td className={`response-cell response-${problem.response || 'none'}`}>
                          {responseLabel(problem)}
                        </td>
                        <td>{language || '—'}</td>
                        <td>{openedAt || '—'}</td>
                        <td>{generatedAt || '—'}</td>
                        <td>{voiceCompletedAt || '—'}</td>
                        <td>{respondedAtValue || '—'}</td>
                        <td>{replayCount > 0 ? replayCount : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>

      <section className="detail-card">
        <h3>Events</h3>
        {eventsError && <div className="error-banner">{eventsError}</div>}
        {eventsLoading ? (
          <div className="loading">Loading events...</div>
        ) : !eventsError ? (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Metadata</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <tr key={i}>
                    <td>{event.event_name}</td>
                    <td className="event-metadata-cell">
                      {event.metadata ? JSON.stringify(event.metadata) : '—'}
                    </td>
                    <td>{new Date(event.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default UserDetail
