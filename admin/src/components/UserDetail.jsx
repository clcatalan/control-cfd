import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './UserDetail.css'

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

  const completedCount = progress.filter((problem) => problem.completed).length

  return (
    <div className="dashboard-content">
      <Link to="/" className="back-link">&larr; Back to Users</Link>

      <div className="user-detail-header">
        <h2>{participantId}</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <section className="detail-card">
        <h3>Problem Progress</h3>
        {loading ? (
          <div className="loading">Loading progress...</div>
        ) : !error ? (
          <>
            <p className="progress-summary">
              {completedCount} of {progress.length} problems completed
            </p>
            <ul className="progress-list">
              {progress.map((problem) => (
                <li
                  key={problem.id}
                  className={`progress-item ${problem.completed ? 'done' : 'pending'}`}
                >
                  <span className="progress-status-icon">{problem.completed ? '✓' : '○'}</span>
                  <span className="progress-title">{problem.title}</span>
                  <span className="progress-badge">{problem.completed ? 'Done' : 'Not done'}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </div>
  )
}

export default UserDetail
