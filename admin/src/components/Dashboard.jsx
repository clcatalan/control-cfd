import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import UsersPage from './UsersPage'
import StudyCreation from './StudyCreation'
import StudyDetails from './StudyDetails'
import UserDetail from './UserDetail'
import './Dashboard.css'

function Dashboard({ onLogout }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <nav className="dashboard-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              Users
            </NavLink>
            <NavLink
              to="/study-creation"
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              Study Creation
            </NavLink>
            <NavLink
              to="/study-details"
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              Study Details
            </NavLink>
          </nav>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/study-creation" element={<StudyCreation />} />
        <Route path="/study-details" element={<StudyDetails />} />
        <Route path="/users/:participantId" element={<UserDetail />} />
      </Routes>
    </div>
  )
}

export default Dashboard
