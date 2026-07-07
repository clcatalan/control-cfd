import React from 'react'
import './ProblemList.css'

const weeks = [
  {
    label: 'Week 1',
    problems: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ],
  },
  {
    label: 'Week 2',
    problems: [
      { id: 6 },
      { id: 7 },
      { id: 8 },
      { id: 9 },
      { id: 10 },
    ],
  },
]

function ProblemList({ participantId, onSelectProblem, onLogout }) {
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
        {weeks.map((week) => (
          <section className="week-section" key={week.label}>
            <h2 className="week-label">{week.label}</h2>
            <div className="problem-grid">
              {week.problems.map((problem) => (
                <button
                  key={problem.id}
                  className="problem-card"
                  onClick={() => onSelectProblem && onSelectProblem(problem)}
                >
                  <span className="problem-title">Problem {problem.id}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default ProblemList
