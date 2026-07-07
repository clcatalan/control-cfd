import React, { useState } from 'react'
import './AdminLogin.css'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json()

      if (data.success) {
        onLogin()
      } else {
        setError(data.message || 'Invalid username or password')
      }
    } catch (err) {
      console.error('Admin login error:', err)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>Admin Dashboard</h1>
        <p className="admin-login-subtitle">Please login to access the admin panel</p>
        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div className="admin-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {error && <div className="admin-error-message">{error}</div>}
          <button type="submit" className="admin-login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="admin-hint">Default credentials: admin / admin123 (change after first login)</p>
      </div>
    </div>
  )
}

export default AdminLogin
