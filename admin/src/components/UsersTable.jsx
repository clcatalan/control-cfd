import React from 'react'
import './UsersTable.css'

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function UsersTable({ users, onDelete, onSelectUser }) {
  if (users.length === 0) {
    return (
      <div className="users-empty">
        <p>No registered users yet.</p>
      </div>
    )
  }

  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Participant ID</th>
            <th>Registered</th>
            <th>Group</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="user-row"
              onClick={() => onSelectUser(user)}
            >
              <td>{user.id}</td>
              <td className="participant-id">{user.participant_id}</td>
              <td>{formatDate(user.created_at)}</td>
              <td>
                {user.study_group ? (
                  <span className={`group-badge ${user.study_group}`}>
                    {user.study_group === 'control' ? 'Control' : 'Experimental'}
                  </span>
                ) : (
                  <span className="group-badge-empty">Unassigned</span>
                )}
              </td>
              <td className="actions-col" onClick={(e) => e.stopPropagation()}>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(user.participant_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
