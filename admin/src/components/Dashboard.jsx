import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import UsersPage from './UsersPage'
import StudyCreation from './StudyCreation'
import StudyDetails from './StudyDetails'
import UserDetail from './UserDetail'
import ProblemConfiguration from './ProblemConfiguration'
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
              Control Group Progress
            </NavLink>
            <NavLink
              to="/experimental-group-progress"
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              Experimental Group Progress
            </NavLink>
            <NavLink
              to="/problem-configuration"
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              Problem Configuration
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
        <Route path="/study-details" element={<StudyDetails group="control" title="Control Group Progress" />} />
        <Route
          path="/experimental-group-progress"
          element={<StudyDetails group="experimental" title="Experimental Group Progress" />}
        />
        <Route path="/users/:participantId" element={<UserDetail />} />
        <Route path="/problem-configuration" element={<ProblemConfiguration />} />
      </Routes>
    </div>
  )
}

export default Dashboard
