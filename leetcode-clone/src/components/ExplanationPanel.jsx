import React from 'react'
import './ExplanationPanel.css'

const sampleExplanation = {
  title: "Two Sum - Solution Explanation",
  approach: "Hash Map Approach",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  explanation: `The most efficient solution uses a hash map (object in JavaScript) to store numbers we've seen along with their indices.

As we iterate through the array, for each number we:
1. Calculate the complement (target - current number)
2. Check if the complement exists in our hash map
3. If yes, we've found our pair - return both indices
4. If no, store the current number and its index in the hash map

This approach only requires one pass through the array, making it very efficient.`,
  steps: [
    "Create an empty hash map to store numbers and their indices",
    "Iterate through the array with index",
    "For each number, calculate complement = target - nums[i]",
    "Check if complement exists in hash map",
    "If found, return [hashMap[complement], i]",
    "If not found, add current number to hash map",
    "Continue until pair is found"
  ],
  example: `Example walkthrough with nums = [2,7,11,15], target = 9:

• i=0, num=2: complement=7, map={}, add 2
• i=1, num=7: complement=2, found in map! Return [0,1]

Result: [0, 1]`
}

function ExplanationPanel() {
  const handleAccept = () => {
    console.log('Solution accepted')
    alert('AI solution accepted! The code will be inserted into the editor.')
  }

  const handleReject = () => {
    console.log('Solution rejected')
    alert('AI solution rejected.')
  }

  return (
    <div className="explanation-panel">
      <div className="explanation-header">
        <h2>AI Explanation</h2>
      </div>

      <div className="explanation-content">
        <div className="explanation-section">
          <h3>{sampleExplanation.title}</h3>
          
          <div className="complexity-badges">
            <span className="badge time-complexity">
              <strong>Time:</strong> {sampleExplanation.timeComplexity}
            </span>
            <span className="badge space-complexity">
              <strong>Space:</strong> {sampleExplanation.spaceComplexity}
            </span>
          </div>
        </div>

        <div className="explanation-section">
          <h4>Approach: {sampleExplanation.approach}</h4>
          <p className="explanation-text">{sampleExplanation.explanation}</p>
        </div>

        <div className="explanation-section">
          <h4>Algorithm Steps:</h4>
          <ol className="steps-list">
            {sampleExplanation.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="explanation-section">
          <h4>Example Walkthrough:</h4>
          <pre className="example-walkthrough">{sampleExplanation.example}</pre>
        </div>
      </div>

      <div className="explanation-footer">
        <button className="btn-reject" onClick={handleReject}>
          Reject
        </button>
        <button className="btn-accept" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  )
}

export default ExplanationPanel
