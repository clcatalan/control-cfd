import React, { useState } from 'react'
import './AdminLogin.css'

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Simple hardcoded admin credentials (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
      onLogin()
    } else {
      setError('Invalid username or password')
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
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
        <p className="admin-hint">Default credentials: admin / admin123</p>
      </div>
    </div>
  )
}

export default AdminLogin
