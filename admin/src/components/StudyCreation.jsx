import React, { useState, useEffect, useMemo } from 'react'
import './StudyCreation.css'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

const PROBLEM_COUNT = 10
const PROBLEM_IDS = Array.from({ length: PROBLEM_COUNT }, (_, i) => i + 1)
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildCalendarDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstWeekday; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }
  return days
}

function StudyCreation() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedProblemId, setSelectedProblemId] = useState(String(PROBLEM_IDS[0]))
  const [saving, setSaving] = useState(false)
  const [allProblemsEnabled, setAllProblemsEnabled] = useState(false)
  const [togglingAllProblems, setTogglingAllProblems] = useState(false)
  const [resetting, setResetting] = useState(false)

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

  const handleToggleAllProblems = async () => {
    setTogglingAllProblems(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/settings/all-problems-enabled`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !allProblemsEnabled })
      })
      const data = await response.json()
      if (data.success) {
        setAllProblemsEnabled(data.allProblemsEnabled)
      } else {
        setError(data.message || 'Failed to update setting')
      }
    } catch (err) {
      console.error('Error toggling all problems:', err)
      setError('Failed to update setting')
    } finally {
      setTogglingAllProblems(false)
    }
  }

  const handleResetProgress = async () => {
    const confirmed = confirm(
      "This will permanently clear EVERY participant's completed-problem history and the entire problem schedule, then unlock all problems for everyone. This cannot be undone. Continue?"
    )
    if (!confirmed) return

    setResetting(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/reset-progress`, { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        setAllProblemsEnabled(data.allProblemsEnabled)
        fetchSchedule()
      } else {
        setError(data.message || 'Failed to reset progress')
      }
    } catch (err) {
      console.error('Error resetting progress:', err)
      setError('Failed to reset progress')
    } finally {
      setResetting(false)
    }
  }

  const fetchSchedule = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/schedule`)
      const data = await response.json()
      if (data.success) {
        setSchedule(data.schedule)
      } else {
        setError('Failed to fetch schedule')
      }
    } catch (err) {
      console.error('Error fetching schedule:', err)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
    fetchSettings()
  }, [])

  const scheduleByDate = useMemo(() => {
    const map = {}
    schedule.forEach((entry) => {
      map[entry.scheduled_date] = entry.problem_id
    })
    return map
  }, [schedule])

  const todayStr = formatDate(new Date())
  const calendarDays = buildCalendarDays(currentMonth)
  const monthLabel = currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleSelectDay = (date) => {
    const dateStr = formatDate(date)
    setSelectedDate(dateStr)
    const assignedProblemId = scheduleByDate[dateStr]
    setSelectedProblemId(String(assignedProblemId || PROBLEM_IDS[0]))
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!selectedDate) return

    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: Number(selectedProblemId), date: selectedDate })
      })
      const data = await response.json()
      if (data.success) {
        fetchSchedule()
      } else {
        setError(data.message || 'Failed to assign problem')
      }
    } catch (err) {
      console.error('Error assigning problem:', err)
      setError('Failed to assign problem')
    } finally {
      setSaving(false)
    }
  }

  const handleClear = async (problemId) => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/schedule/${problemId}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        fetchSchedule()
      } else {
        setError(data.message || 'Failed to clear schedule')
      }
    } catch (err) {
      console.error('Error clearing schedule:', err)
      setError('Failed to clear schedule')
    } finally {
      setSaving(false)
    }
  }

  const assignedProblemForSelectedDate = selectedDate ? scheduleByDate[selectedDate] : null

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Study Creation</h2>
        <div className="header-actions">
          <button
            className={`testing-toggle-btn ${allProblemsEnabled ? 'active' : ''}`}
            onClick={handleToggleAllProblems}
            disabled={togglingAllProblems}
          >
            {allProblemsEnabled ? 'Disable All Problems' : 'Enable All Problems'}
          </button>
          <button
            className="reset-progress-btn"
            onClick={handleResetProgress}
            disabled={resetting}
          >
            {resetting ? 'Resetting...' : 'Reset All Progress'}
          </button>
        </div>
      </div>

      {allProblemsEnabled && (
        <div className="testing-mode-banner">
          Testing mode is ON — all problems are unlocked for every participant, regardless of schedule.
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      <div className="study-creation-layout">
        <div className="calendar-card">
          <div className="calendar-nav">
            <button className="calendar-nav-btn" onClick={goToPrevMonth}>&larr;</button>
            <span className="calendar-month-label">{monthLabel}</span>
            <button className="calendar-nav-btn" onClick={goToNextMonth}>&rarr;</button>
          </div>

          <div className="calendar-weekdays">
            {WEEKDAY_LABELS.map((label) => (
              <div className="calendar-weekday" key={label}>{label}</div>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading schedule...</div>
          ) : (
            <div className="calendar-grid">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div className="calendar-day empty" key={`empty-${index}`} />
                }
                const dateStr = formatDate(date)
                const assignedProblemId = scheduleByDate[dateStr]
                const isToday = dateStr === todayStr
                const isSelected = dateStr === selectedDate

                return (
                  <button
                    key={dateStr}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${assignedProblemId ? 'assigned' : ''}`}
                    onClick={() => handleSelectDay(date)}
                  >
                    <span className="calendar-day-number">{date.getDate()}</span>
                    {assignedProblemId && (
                      <span className="calendar-day-badge">P{assignedProblemId}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="schedule-panel">
          {selectedDate ? (
            <>
              <h3>{selectedDate}</h3>
              {assignedProblemForSelectedDate && (
                <p className="current-assignment">
                  Currently assigned: <strong>Problem {assignedProblemForSelectedDate}</strong>
                </p>
              )}
              <form onSubmit={handleAssign} className="assign-form">
                <div className="form-group">
                  <label>Problem</label>
                  <select
                    value={selectedProblemId}
                    onChange={(e) => setSelectedProblemId(e.target.value)}
                  >
                    {PROBLEM_IDS.map((id) => (
                      <option value={id} key={id}>Problem {id}</option>
                    ))}
                  </select>
                </div>
                <div className="assign-actions">
                  <button type="submit" className="add-btn" disabled={saving}>
                    {assignedProblemForSelectedDate ? 'Move Problem Here' : 'Assign Problem'}
                  </button>
                  {assignedProblemForSelectedDate && (
                    <button
                      type="button"
                      className="cancel-btn"
                      disabled={saving}
                      onClick={() => handleClear(assignedProblemForSelectedDate)}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <p className="schedule-panel-hint">Select a date on the calendar to assign a problem to it.</p>
          )}

          <div className="scheduled-list">
            <h3>Scheduled Problems</h3>
            {schedule.length === 0 ? (
              <p className="schedule-panel-hint">No problems scheduled yet.</p>
            ) : (
              <ul>
                {schedule.map((entry) => (
                  <li key={entry.problem_id}>
                    <span>{entry.scheduled_date} &mdash; Problem {entry.problem_id}</span>
                    <button
                      className="delete-btn"
                      disabled={saving}
                      onClick={() => handleClear(entry.problem_id)}
                    >
                      Clear
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyCreation
