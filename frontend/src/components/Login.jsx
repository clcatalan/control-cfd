import React, { useState } from 'react'
import './Login.css'

const API_URL = 'http://localhost:3001/api'

function Login({ onLogin }) {
  const [participantId, setParticipantId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!participantId.trim()) {
      setError('Please enter a participant ID')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantId: participantId.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        onLogin(data.user.participantId, data.user)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Unable to connect to server. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Code Generation Study</h1>
        <p className="login-subtitle">Please enter your participant ID to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="participantId">Participant ID</label>
            <input
              type="text"
              id="participantId"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              placeholder="Enter your participant ID"
              autoFocus
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
