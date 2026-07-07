import React, { useState, useEffect } from 'react'
import ProblemPanel from './components/ProblemPanel'
import EditorPanel from './components/EditorPanel'
import ExplanationPanel from './components/ExplanationPanel'
import Login from './components/Login'
import ProblemList from './components/ProblemList'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [participantId, setParticipantId] = useState('')
  const [userData, setUserData] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [leftWidth, setLeftWidth] = useState(30)
  const [middleWidth, setMiddleWidth] = useState(40)
  const [activeHandle, setActiveHandle] = useState(null)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedParticipantId = localStorage.getItem('participantId')
    const storedUserData = localStorage.getItem('userData')
    if (storedParticipantId) {
      setParticipantId(storedParticipantId)
      setIsLoggedIn(true)
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData))
      }
    }
  }, [])

  const handleLogin = (id, user) => {
    setParticipantId(id)
    setUserData(user)
    setIsLoggedIn(true)
    localStorage.setItem('participantId', id)
    localStorage.setItem('userData', JSON.stringify(user))
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setParticipantId('')
    setUserData(null)
    setSelectedProblem(null)
    localStorage.removeItem('participantId')
    localStorage.removeItem('userData')
  }

  const handleMouseDown = (handle) => {
    setActiveHandle(handle)
  }

  const handleMouseUp = () => {
    setActiveHandle(null)
  }

  const handleMouseMove = (e) => {
    if (!activeHandle) return
    
    const container = document.querySelector('.app')
    const containerRect = container.getBoundingClientRect()
    const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100
    
    if (activeHandle === 'left') {
      // Dragging first handle (between problem and editor)
      if (percentage >= 20 && percentage <= 50) {
        setLeftWidth(percentage)
      }
    } else if (activeHandle === 'right') {
      // Dragging second handle (between editor and explanation)
      const newMiddleWidth = percentage - leftWidth
      if (newMiddleWidth >= 25 && newMiddleWidth <= 55 && percentage <= 80) {
        setMiddleWidth(newMiddleWidth)
      }
    }
  }

  React.useEffect(() => {
    if (activeHandle) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [activeHandle, leftWidth, middleWidth])

  const rightWidth = 100 - leftWidth - middleWidth

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  // Show problem list page until the participant picks a problem
  if (!selectedProblem) {
    return (
      <ProblemList
        participantId={participantId}
        onSelectProblem={setSelectedProblem}
        onLogout={handleLogout}
      />
    )
  }

  // Show main LeetCode UI if logged in
  return (
    <div className="app">
      <div className="app-header">
        <div className="header-left">
          <button className="back-button" onClick={() => setSelectedProblem(null)}>
            &larr; Problems
          </button>
          <span className="participant-id">Participant: {participantId}</span>
        </div>
        <div className="header-right">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="app-content">
        <div className="panel-left" style={{ width: `${leftWidth}%` }}>
          <ProblemPanel />
        </div>
        <div 
          className={`resize-handle ${activeHandle === 'left' ? 'dragging' : ''}`}
          onMouseDown={() => handleMouseDown('left')}
        />
        <div className="panel-middle" style={{ width: `${middleWidth}%` }}>
          <EditorPanel />
        </div>
        <div 
          className={`resize-handle ${activeHandle === 'right' ? 'dragging' : ''}`}
          onMouseDown={() => handleMouseDown('right')}
        />
        <div className="panel-right" style={{ width: `${rightWidth}%` }}>
          <ExplanationPanel />
        </div>
      </div>
    </div>
  )
}

export default App
