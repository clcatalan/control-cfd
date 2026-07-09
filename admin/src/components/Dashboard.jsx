// Dashboard.jsx was initially AI-generated
import React, { useState, useEffect } from 'react'
import UsersTable from './UsersTable'
import StudyCreation from './StudyCreation'
import './Dashboard.css'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

function Dashboard({ onLogout }) {
  const [page, setPage] = useState('users')
  /**
   * Done by AI and Human
   * 
   * This function basically fetches the list of users from the backend API 
   * and manages the state for loading, error, and modal visibility. 
   * It also handles adding and deleting users through API calls.
   */
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newParticipantId, setNewParticipantId] = useState('')

  const fetchUsers = async () => {
    /**
     * 100% done by AI
     * 
     * This specific function is in charge of fetching the users with 
     * appropriate error handling.
     */
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/users`)
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!newParticipantId.trim()) return

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: newParticipantId.trim() })
      })
      const data = await response.json()
      
      if (data.success) {
        setNewParticipantId('')
        setShowAddModal(false)
        fetchUsers() // Refresh the list
      } else {
        alert(data.message || 'Failed to add user')
      }
    } catch (err) {
      console.error('Error adding user:', err)
      alert('Failed to add user')
    }
  }

  const handleDeleteUser = async (participantId) => {
    if (!confirm(`Are you sure you want to delete user "${participantId}"?`)) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/users/${participantId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        fetchUsers() // Refresh the list
      } else {
        alert(data.message || 'Failed to delete user')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Failed to delete user')
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <nav className="dashboard-nav">
            <button
              className={`nav-btn ${page === 'users' ? 'active' : ''}`}
              onClick={() => setPage('users')}
            >
              Users
            </button>
            <button
              className={`nav-btn ${page === 'study-creation' ? 'active' : ''}`}
              onClick={() => setPage('study-creation')}
            >
              Study Creation
            </button>
          </nav>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {page === 'study-creation' ? (
        <StudyCreation />
      ) : (
        <div className="dashboard-content">
          <div className="content-header">
            <h2>Registered Users</h2>
            <div className="actions">
              <button className="refresh-btn" onClick={fetchUsers}>
                ↻ Refresh
              </button>
              <button className="add-btn" onClick={() => setShowAddModal(true)}>
                + Add User
              </button>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <UsersTable users={users} onDelete={handleDeleteUser} />
          )}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Participant ID</label>
                <input
                  type="text"
                  value={newParticipantId}
                  onChange={(e) => setNewParticipantId(e.target.value)}
                  placeholder="Enter participant ID"
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
