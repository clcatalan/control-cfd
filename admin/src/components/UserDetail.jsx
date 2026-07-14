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

  const responseLabel = (problem) => {
    if (problem.response === 'accept') return 'Accepted'
    if (problem.response === 'reject') return 'Rejected'
    return 'No response'
  }

  const problemLabel = (problem) => `P${problem.id}: ${problem.title.replace(/^\d+\.\s*/, '')}`

  const redProblemIds = new Set([2, 4, 7, 9, 10])
  const rowClass = (problem) => (redProblemIds.has(problem.id) ? 'row-red' : 'row-green')

  return (
    <div className="dashboard-content">
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
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Problem Title</th>
                  <th>Response</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((problem) => (
                  <tr key={problem.id} className={rowClass(problem)}>
                    <td>{problemLabel(problem)}</td>
                    <td className={`response-cell response-${problem.response || 'none'}`}>
                      {responseLabel(problem)}
                    </td>
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
