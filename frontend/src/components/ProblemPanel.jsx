import React, { useState } from 'react'
import './ProblemPanel.css'

const sampleProblem = {
  id: 1,
  title: "1. Two Sum",
  difficulty: "Easy",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: ""
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: ""
    }
  ],
  constraints: [
    "2 <= nums.length <= 10⁴",
    "-10⁹ <= nums[i] <= 10⁹",
    "-10⁹ <= target <= 10⁹",
    "Only one valid answer exists."
  ]
}

function ProblemPanel() {
  const [activeTab, setActiveTab] = useState('description')

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
              <h1>{sampleProblem.title}</h1>
              <span className={`difficulty ${getDifficultyClass(sampleProblem.difficulty)}`}>
                {sampleProblem.difficulty}
              </span>
            </div>

            <div className="problem-description">
              <p>{sampleProblem.description}</p>
            </div>

            <div className="examples">
              {sampleProblem.examples.map((example, index) => (
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
                {sampleProblem.constraints.map((constraint, index) => (
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
