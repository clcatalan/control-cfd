import React, { useState, useEffect } from 'react'
import ProblemPanel from './components/ProblemPanel'
import EditorPanel from './components/EditorPanel'
import ExplanationPanel from './components/ExplanationPanel'
import Login from './components/Login'
import ProblemList from './components/ProblemList'
import './App.css'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [participantId, setParticipantId] = useState('')
  const [userData, setUserData] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [language, setLanguage] = useState('javascript')
  const [aiSolutionGenerated, setAiSolutionGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [leftWidth, setLeftWidth] = useState(30)
  const [middleWidth, setMiddleWidth] = useState(40)
  const [activeHandle, setActiveHandle] = useState(null)
  const [completedProblemIds, setCompletedProblemIds] = useState([])

  // The backend is the source of truth for which problems a participant has completed
  const fetchCompletedProblemIds = async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}/progress`)
      const data = await response.json()
      if (data.success) {
        return data.progress.filter((problem) => problem.completed).map((problem) => problem.id)
      }
      return []
    } catch (err) {
      console.error('Error fetching completed problems:', err)
      return []
    }
  }

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
      fetchCompletedProblemIds(storedParticipantId).then(setCompletedProblemIds)
    }
  }, [])

  const handleLogin = async (id, user) => {
    setParticipantId(id)
    setUserData(user)
    setIsLoggedIn(true)
    setCompletedProblemIds(await fetchCompletedProblemIds(id))
    localStorage.setItem('participantId', id)
    localStorage.setItem('userData', JSON.stringify(user))
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setParticipantId('')
    setUserData(null)
    setSelectedProblem(null)
    setCompletedProblemIds([])
    localStorage.removeItem('participantId')
    localStorage.removeItem('userData')
  }

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem)
    setAiSolutionGenerated(false)
    setIsGenerating(false)
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    setAiSolutionGenerated(false)
    setIsGenerating(false)
  }

  const handleGenerateStart = () => {
    setAiSolutionGenerated(false)
    setIsGenerating(true)
  }

  const handleGenerateComplete = () => {
    setIsGenerating(false)
    setAiSolutionGenerated(true)
  }

  const handleSolutionResolved = (problemId) => {
    setCompletedProblemIds((prev) => (prev.includes(problemId) ? prev : [...prev, problemId]))
    setSelectedProblem(null)

    fetch(`${API_URL}/users/${participantId}/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId })
    }).catch((err) => console.error('Error syncing completed problem:', err))
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
        onSelectProblem={handleSelectProblem}
        onLogout={handleLogout}
        completedProblemIds={completedProblemIds}
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
          <ProblemPanel problem={selectedProblem} />
        </div>
        <div 
          className={`resize-handle ${activeHandle === 'left' ? 'dragging' : ''}`}
          onMouseDown={() => handleMouseDown('left')}
        />
        <div className="panel-middle" style={{ width: `${middleWidth}%` }}>
          <EditorPanel
            problem={selectedProblem}
            language={language}
            onLanguageChange={handleLanguageChange}
            onGenerateStart={handleGenerateStart}
            onGenerateComplete={handleGenerateComplete}
          />
        </div>
        <div
          className={`resize-handle ${activeHandle === 'right' ? 'dragging' : ''}`}
          onMouseDown={() => handleMouseDown('right')}
        />
        <div className="panel-right" style={{ width: `${rightWidth}%` }}>
          <ExplanationPanel
            problem={selectedProblem}
            language={language}
            visible={aiSolutionGenerated}
            isGenerating={isGenerating}
            onResolved={handleSolutionResolved}
          />
        </div>
      </div>
    </div>
  )
}

export default App
