import React, { useState, useEffect } from 'react'
import './ProblemList.css'
import ConfirmDialog from './ConfirmDialog'
import leetcodeProblems from '../data/leetcodeProblems-new'
import { logEvent } from '../utils/logEvent'

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

const CONTROL_ONBOARDING_VIDEO_URL = 'https://youtu.be/m8j1xqnN1dw'
const EXPERIMENTAL_ONBOARDING_VIDEO_URL = 'https://youtu.be/vLIJr4XECJA'

function ProblemList({ participantId, studyGroup, onSelectProblem, onLogout, completedProblemIds = [] }) {
  const onboardingVideoUrl =
    studyGroup === 'experimental' ? EXPERIMENTAL_ONBOARDING_VIDEO_URL : CONTROL_ONBOARDING_VIDEO_URL
  const [unlockedProblemId, setUnlockedProblemId] = useState(null)
  const [scheduleByProblemId, setScheduleByProblemId] = useState({})
  const [allProblemsEnabled, setAllProblemsEnabled] = useState(false)
  const [loadingSchedule, setLoadingSchedule] = useState(true)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [loadingOnboarding, setLoadingOnboarding] = useState(true)
  const [awaitingOnboardingConfirm, setAwaitingOnboardingConfirm] = useState(false)
  const [showOnboardingConfirm, setShowOnboardingConfirm] = useState(false)

  // The onboarding video opens in a new tab; once the participant switches back to this
  // tab, prompt them to confirm they watched it. visibilitychange (not focus) is used
  // because it also fires when returning via alt-tab, not just via clicking the tab.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && awaitingOnboardingConfirm) {
        setAwaitingOnboardingConfirm(false)
        setShowOnboardingConfirm(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [awaitingOnboardingConfirm])

  const handleOnboardingConfirm = async (completed) => {
    setShowOnboardingConfirm(false)
    logEvent(participantId, 'onboarding_video_confirmed', { completed })

    if (!completed) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/users/${encodeURIComponent(participantId)}/onboarding`, {
        method: 'POST',
      })
      const data = await response.json()
      if (data.success) {
        setOnboardingCompleted(true)
      }
    } catch (err) {
      console.error('Error marking onboarding completed:', err)
    }
  }

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${encodeURIComponent(participantId)}/onboarding`)
        const data = await response.json()
        if (data.success) {
          setOnboardingCompleted(data.completed)
        }
      } catch (err) {
        console.error('Error fetching onboarding status:', err)
      } finally {
        setLoadingOnboarding(false)
      }
    }

    fetchOnboardingStatus()
  }, [participantId])

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
        {!unlockAllForDev && !allProblemsEnabled && !loadingOnboarding && !onboardingCompleted && (
          <div className="no-problem-banner">Please watch the onboarding video above before starting any problems.</div>
        )}
        {!unlockAllForDev && !allProblemsEnabled && onboardingCompleted && !loadingSchedule && !unlockedProblemId && (
          <div className="no-problem-banner">No problem is scheduled for today. Please check back later.</div>
        )}
        <section className="week-section">
          <div className="problem-grid onboarding-grid">
            <a
              className="problem-card onboarding-card"
              href={onboardingVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setAwaitingOnboardingConfirm(true)
                logEvent(participantId, 'onboarding_video_opened', { studyGroup: studyGroup || 'control' })
              }}
            >
              <span className="problem-title">Onboarding Instructions</span>
            </a>
          </div>
        </section>
        {weeks.map((week) => (
          <section className="week-section" key={week.label}>
            <h2 className="week-label">{week.label}</h2>
            <div className="problem-grid">
              {week.problems.map((problem) => {
                const isUnlocked =
                  unlockAllForDev || allProblemsEnabled || (onboardingCompleted && problem.id === unlockedProblemId)
                const isCompleted = completedProblemIds.includes(problem.id)
                const scheduledDate = scheduleByProblemId[problem.id]
                const lockedReason = !onboardingCompleted ? 'Complete the onboarding video first' : 'Not available today'
                return (
                  <button
                    key={problem.id}
                    className={`problem-card ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                    disabled={!isUnlocked || isCompleted}
                    title={isCompleted ? 'Already completed' : isUnlocked ? undefined : lockedReason}
                    onClick={() => isUnlocked && !isCompleted && onSelectProblem && onSelectProblem(problem)}
                  >
                    <span className="problem-title">Problem {problem.id}</span>
                    <span className="problem-availability">
                      {scheduledDate ? `Available on ${formatDisplayDate(scheduledDate)}` : 'Not scheduled'}
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

      <ConfirmDialog
        open={showOnboardingConfirm}
        title="Onboarding video"
        message="Have you viewed and completed the onboarding video?"
        confirmLabel="Yes, I've completed it"
        cancelLabel="Not yet"
        variant="accept"
        onConfirm={() => handleOnboardingConfirm(true)}
        onCancel={() => handleOnboardingConfirm(false)}
      />
    </div>
  )
}

export default ProblemList
