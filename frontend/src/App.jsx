import React, { useState, useEffect, useRef } from 'react'
import ProblemPanel from './components/ProblemPanel'
import EditorPanel from './components/EditorPanel'
import ExplanationPanel from './components/ExplanationPanel'
import Login from './components/Login'
import ProblemList from './components/ProblemList'
import { useAiNarration } from './hooks/useAiNarration'
import { logEvent, formatTimestamp } from './utils/logEvent'
import leetcodeProblems from './data/leetcodeProblems-new'
import './App.css'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'
const PROBLEM_TIME_LIMIT_SECONDS = 30 * 60
const SESSION_STORAGE_PREFIX = 'problemSession_'

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Reads the in-progress problem session (if any) for whichever participant is
// stored in localStorage, so a page refresh can resume instead of bouncing
// back to the problem list. Problem content is static data, not fetched, so
// only the id needs to be persisted.
function loadPersistedSession() {
  const storedParticipantId = localStorage.getItem('participantId')
  if (!storedParticipantId) return null
  try {
    const raw = localStorage.getItem(`${SESSION_STORAGE_PREFIX}${storedParticipantId}`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const problem = leetcodeProblems.find((p) => p.id === parsed.problemId)
    if (!problem) return null
    return { ...parsed, problem }
  } catch {
    return null
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [participantId, setParticipantId] = useState('')
  const [userData, setUserData] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState(() => loadPersistedSession()?.problem ?? null)
  const [language, setLanguage] = useState(() => loadPersistedSession()?.language ?? 'javascript')
  const [aiSolutionGenerated, setAiSolutionGenerated] = useState(() => loadPersistedSession()?.aiSolutionGenerated ?? false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [code, setCode] = useState(() => loadPersistedSession()?.code ?? null)
  const [originalSolution, setOriginalSolution] = useState(() => loadPersistedSession()?.originalSolution ?? null)
  const [isEditingSolution, setIsEditingSolution] = useState(() => loadPersistedSession()?.isEditingSolution ?? false)
  const [leftWidth, setLeftWidth] = useState(30)
  const [middleWidth, setMiddleWidth] = useState(40)
  const [activeHandle, setActiveHandle] = useState(null)
  const [completedProblemIds, setCompletedProblemIds] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const session = loadPersistedSession()
    if (!session) return PROBLEM_TIME_LIMIT_SECONDS
    const elapsedSinceSave = (Date.now() - session.savedAt) / 1000
    return Math.max(0, Math.round(session.timeRemaining - elapsedSinceSave))
  })
  // Tracks whether the voice narration's first read-through (not a replay) has
  // already been logged, so only the very first completion is recorded.
  const wasNarrationSpeakingRef = useRef(false)
  const firstReadCompletedLoggedRef = useRef(false)
  // Experimental-group only: gates the "Running tests..." label so it doesn't show
  // until the voice narration's first read-through has finished. Stays true across
  // replays once set, so it never has to reappear for later plays.
  const [narrationFirstReadDone, setNarrationFirstReadDone] = useState(false)
  // Paused while an Accept/Reject/Submit/Back confirmation dialog is open, so
  // participants aren't timed out while deciding.
  const isTimerPausedRef = useRef(false)

  // Voice narration is a study treatment: only participants assigned to the
  // "experimental" group (via the admin panel) get it. Anyone else (control
  // group, or not yet assigned) gets the original text-only explanation.
  const isExperimental = userData?.studyGroup === 'experimental'

  const narration = useAiNarration({
    problem: selectedProblem,
    language,
    visible: aiSolutionGenerated,
    enabled: isExperimental,
  })

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
    if (participantId) localStorage.removeItem(`${SESSION_STORAGE_PREFIX}${participantId}`)
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
    setCode(null)
    setOriginalSolution(null)
    setIsEditingSolution(false)
    setTimeRemaining(PROBLEM_TIME_LIMIT_SECONDS)
    isTimerPausedRef.current = false
    wasNarrationSpeakingRef.current = false
    firstReadCompletedLoggedRef.current = false
    setNarrationFirstReadDone(false)
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    setAiSolutionGenerated(false)
    setIsGenerating(false)
    setIsEditingSolution(false)

    logEvent(participantId, 'language_selected', {
      problemId: selectedProblem?.id,
      language: newLanguage,
      timestamp: formatTimestamp(),
    })
  }

  const handleGenerateStart = () => {
    setAiSolutionGenerated(false)
    setIsGenerating(true)
    setIsEditingSolution(false)
    wasNarrationSpeakingRef.current = false
    firstReadCompletedLoggedRef.current = false
    setNarrationFirstReadDone(false)

    logEvent(participantId, 'generate_ai_solution_clicked', {
      problemId: selectedProblem?.id,
      language,
      timestamp: formatTimestamp(),
    })
  }

  const handleGenerateComplete = (solution) => {
    setIsGenerating(false)
    setAiSolutionGenerated(true)
    setCode(solution)
    setOriginalSolution(solution)
  }

  // Reject flow: entering edit mode makes the editor writable so the participant
  // can revise the AI solution before submitting it.
  const handleStartEditingSolution = () => {
    setIsEditingSolution(true)
  }

  // "<- Back" discards any edits and returns to the read-only Accept/Reject view.
  const handleCancelEditingSolution = () => {
    setIsEditingSolution(false)
    setCode(originalSolution)
  }

  // Experimental-group only: log the moment the voice narration's first read-through
  // (not a replay) finishes. Guarded so only the very first completion is recorded —
  // subsequent replays via "Play AI Explanation Again" are ignored.
  useEffect(() => {
    if (narration.isSpeaking) {
      wasNarrationSpeakingRef.current = true
      return
    }
    if (wasNarrationSpeakingRef.current && !narration.isReplaying && !firstReadCompletedLoggedRef.current) {
      firstReadCompletedLoggedRef.current = true
      setNarrationFirstReadDone(true)
      logEvent(participantId, 'voice_explanation_completed', {
        problemId: selectedProblem?.id,
        timestamp: formatTimestamp(),
      })
    }
    wasNarrationSpeakingRef.current = false
  }, [narration.isSpeaking, narration.isReplaying])

  const handleSolutionResolved = (problemId, response, submittedCode = null) => {
    if (participantId) localStorage.removeItem(`${SESSION_STORAGE_PREFIX}${participantId}`)
    setCompletedProblemIds((prev) => (prev.includes(problemId) ? prev : [...prev, problemId]))
    setSelectedProblem(null)
    setIsEditingSolution(false)

    if (response === 'accept' || response === 'reject') {
      logEvent(participantId, 'accept_reject_clicked', {
        problemId,
        response,
        studyGroup: isExperimental ? 'experimental' : 'control',
        timestamp: formatTimestamp(),
      })
    }

    fetch(`${API_URL}/users/${participantId}/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId, response, code: submittedCode })
    }).catch((err) => console.error('Error syncing completed problem:', err))
  }

  // Submit flow: the (possibly edited) code in the editor is stored as the participant's
  // final answer, recorded under the same 'reject' response as the confirmation that opened editing.
  const handleSubmitEditedSolution = () => {
    handleSolutionResolved(selectedProblem?.id, 'reject', code)
  }

  // Pausing/resuming only stops the ticking; it's driven off timeRemaining
  // itself rather than a separate wall-clock setTimeout, so a paused dialog
  // can't cause a timeout to fire early.
  const handleDialogOpenChange = (isOpen) => {
    isTimerPausedRef.current = isOpen
  }

  // Give the participant 30 minutes per problem. If they haven't accepted or
  // rejected the solution by then, record a timeout and send them back to the list.
  // Doesn't reset timeRemaining itself: handleSelectProblem sets the full limit when a
  // problem is first opened, and the persisted-session restore above computes what's
  // left after a refresh — resetting here would clobber either of those on mount.
  useEffect(() => {
    if (!selectedProblem) return

    logEvent(participantId, 'problem_opened', {
      problemId: selectedProblem.id,
      timestamp: formatTimestamp(),
    })

    const intervalId = setInterval(() => {
      if (isTimerPausedRef.current) return

      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSolutionResolved(selectedProblem.id, 'timeout')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [selectedProblem])

  // Persist the in-progress session on every change so a page refresh can resume the
  // same problem instead of bouncing back to the list, with the timer picking up where
  // it left off (loadPersistedSession computes elapsed time from savedAt) instead of
  // resetting to the full limit.
  useEffect(() => {
    if (!selectedProblem || !participantId) return

    const session = {
      problemId: selectedProblem.id,
      language,
      code,
      originalSolution,
      aiSolutionGenerated,
      isEditingSolution,
      timeRemaining,
      savedAt: Date.now(),
    }
    localStorage.setItem(`${SESSION_STORAGE_PREFIX}${participantId}`, JSON.stringify(session))
  }, [selectedProblem, participantId, language, code, originalSolution, aiSolutionGenerated, isEditingSolution, timeRemaining])

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

  // Experimental-group only: count each time the participant replays the voice explanation
  const handleReplay = () => {
    logEvent(participantId, 'repeated_voice_explanation', { problemId: selectedProblem?.id })
    narration.replay()
  }

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
        studyGroup={userData?.studyGroup}
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
          {/* <button className="back-button" onClick={() => setSelectedProblem(null)}>
            &larr; Problems
          </button> */}
          <span className="participant-id">Participant: {participantId}</span>
        </div>
        <div className="header-right">
          <span className={`timer ${timeRemaining <= 60 ? 'timer-warning' : ''}`}>
            Time left: {formatTime(timeRemaining)}
          </span>
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
            activeLineRanges={narration.currentLineRanges}
            code={code}
            onCodeChange={setCode}
            readOnly={!isEditingSolution}
            solutionVisible={aiSolutionGenerated}
            holdForNarration={isExperimental}
            narrationFirstReadDone={narrationFirstReadDone}
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
            narrationEnabled={isExperimental}
            currentBlockIndex={narration.currentBlockIndex}
            isSpeaking={narration.isSpeaking}
            isReplaying={narration.isReplaying}
            onReplay={handleReplay}
            isEditing={isEditingSolution}
            onStartEditing={handleStartEditingSolution}
            onCancelEditing={handleCancelEditingSolution}
            onSubmit={handleSubmitEditedSolution}
            onDialogOpenChange={handleDialogOpenChange}
          />
        </div>
      </div>
    </div>
  )
}

export default App
