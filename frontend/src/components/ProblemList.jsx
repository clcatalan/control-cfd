import React, { useState, useEffect } from 'react'
import './ProblemList.css'
import leetcodeProblems from '../data/leetcodeProblems'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

const weeks = [
  {
    label: 'Week 1',
    problems: leetcodeProblems.slice(0, 5),
  },
  {
    label: 'Week 2',
    problems: leetcodeProblems.slice(5, 10),
  },
]

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Bypass the daily schedule lock in local dev so every problem is testable; never true in a production build.
const unlockAllForDev = import.meta.env.DEV

function ProblemList({ participantId, onSelectProblem, onLogout, completedProblemIds = [] }) {
  const [unlockedProblemId, setUnlockedProblemId] = useState(null)
  const [scheduleByProblemId, setScheduleByProblemId] = useState({})
  const [allProblemsEnabled, setAllProblemsEnabled] = useState(false)
  const [loadingSchedule, setLoadingSchedule] = useState(true)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${API_URL}/schedule`)
        const data = await response.json()
        if (data.success) {
          const todayStr = formatDate(new Date())
          const todayEntry = data.schedule.find((entry) => entry.scheduled_date === todayStr)
          setUnlockedProblemId(todayEntry ? todayEntry.problem_id : null)

          const scheduleMap = {}
          data.schedule.forEach((entry) => {
            scheduleMap[entry.problem_id] = entry.scheduled_date
          })
          setScheduleByProblemId(scheduleMap)
        }
      } catch (err) {
        console.error('Error fetching schedule:', err)
      } finally {
        setLoadingSchedule(false)
      }
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/settings`)
        const data = await response.json()
        if (data.success) {
          setAllProblemsEnabled(data.allProblemsEnabled)
        }
      } catch (err) {
        console.error('Error fetching settings:', err)
      }
    }

    fetchSchedule()
    fetchSettings()
  }, [])

  return (
    <div className="problem-list-page">
      <div className="problem-list-header">
        <h1>Code Generation Study</h1>
        <div className="header-right">
          <span className="participant-id">Participant: {participantId}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="problem-list-content">
        {!loadingSchedule && !unlockedProblemId && !unlockAllForDev && !allProblemsEnabled && (
          <div className="no-problem-banner">No problem is scheduled for today. Please check back later.</div>
        )}
        {weeks.map((week) => (
          <section className="week-section" key={week.label}>
            <h2 className="week-label">{week.label}</h2>
            <div className="problem-grid">
              {week.problems.map((problem) => {
                const isUnlocked = unlockAllForDev || allProblemsEnabled || problem.id === unlockedProblemId
                const isCompleted = completedProblemIds.includes(problem.id)
                const scheduledDate = scheduleByProblemId[problem.id]
                return (
                  <button
                    key={problem.id}
                    className={`problem-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                    disabled={!isUnlocked || isCompleted}
                    title={isCompleted ? 'Already completed' : isUnlocked ? undefined : 'Not available today'}
                    onClick={() => isUnlocked && !isCompleted && onSelectProblem && onSelectProblem(problem)}
                  >
                    <span className="problem-title">Problem {problem.id}</span>
                    <span className="problem-availability">
                      {scheduledDate ? formatDisplayDate(scheduledDate) : 'Not scheduled'}
                    </span>
                    {isCompleted && <span className="problem-done-badge">Done</span>}
                    {!isCompleted && !isUnlocked && <span className="problem-lock-icon">🔒</span>}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default ProblemList
