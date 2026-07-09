import React, { useState } from 'react'
import './ProblemPanel.css'
import leetcodeProblems from '../data/leetcodeProblems'

function ProblemPanel({ problem }) {
  const [activeTab, setActiveTab] = useState('description')
  const activeProblem = problem || leetcodeProblems[0]

  const getDifficultyClass = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy'
      case 'medium': return 'difficulty-medium'
      case 'hard': return 'difficulty-hard'
      default: return ''
    }
  }

  return (
    <div className="problem-panel">
      <div className="problem-tabs">
        <button 
          className={`tab ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
      </div>

      <div className="problem-content">
        {activeTab === 'description' && (
          <>
            <div className="problem-header">
              <h1>{activeProblem.title}</h1>
              <span className={`difficulty ${getDifficultyClass(activeProblem.difficulty)}`}>
                {activeProblem.difficulty}
              </span>
            </div>

            <div className="problem-description">
              <p>{activeProblem.description}</p>
            </div>

            <div className="examples">
              {activeProblem.examples.map((example, index) => (
                <div key={index} className="example">
                  <strong>Example {index + 1}:</strong>
                  <div className="example-content">
                    <div>
                      <strong>Input:</strong> {example.input}
                    </div>
                    <div>
                      <strong>Output:</strong> {example.output}
                    </div>
                    {example.explanation && (
                      <div>
                        <strong>Explanation:</strong> {example.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="constraints">
              <strong>Constraints:</strong>
              <ul>
                {activeProblem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProblemPanel
