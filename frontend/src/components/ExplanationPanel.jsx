import React, { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { languageFields, parseDetailedExplanation } from '../utils/explanationParsing'
import './ExplanationPanel.css'

function renderDetailedExplanation(text, currentBlockIndex) {
  if (!text) {
    return <p className="explanation-text">No detailed explanation available yet.</p>
  }

  return parseDetailedExplanation(text).map((block) => {
    const isSpeaking = currentBlockIndex === block.index + 1
    if (block.type === 'plain') {
      return (
        <p className={`explanation-text${isSpeaking ? ' is-speaking' : ''}`} key={block.index}>
          {block.text}
        </p>
      )
    }
    return (
      <div className={`explanation-line-block${isSpeaking ? ' is-speaking' : ''}`} key={block.index}>
        <span className="line-breadcrumb">{block.label}</span>
        <p className="explanation-text">{block.sentence}</p>
      </div>
    )
  })
}

function ExplanationPanel({
  problem,
  language,
  visible,
  isGenerating,
  onResolved,
  narrationEnabled,
  currentBlockIndex,
  isSpeaking,
  isReplaying,
  onReplay,
}) {
  const [pendingAction, setPendingAction] = useState(null)

  const confirmAccept = () => {
    console.log('Solution accepted')
    setPendingAction(null)
    onResolved?.(problem?.id, 'accept')
  }

  const confirmReject = () => {
    console.log('Solution rejected')
    setPendingAction(null)
    onResolved?.(problem?.id, 'reject')
  }

  const fields = languageFields[language] || languageFields.javascript
  const highLevelExplanation = problem?.[fields.hle]
  const detailedExplanation = problem?.[fields.dle]

  return (
    <div className="explanation-panel">
      <div className="explanation-header">
        <h2>AI Explanation</h2>
        {visible && narrationEnabled && (
          <div className="narration-controls">
            <button
              className="narration-btn"
              onClick={onReplay}
              disabled={isSpeaking}
              title="Play AI Explanation Again"
            >
              Play AI Explanation Again
            </button>
          </div>
        )}
      </div>

      <div className="explanation-content">
        {isGenerating && (
          <div className="explanation-loading">
            <div className="spinner" />
          </div>
        )}
        {visible && isSpeaking && !isReplaying && (
          <div className="explanation-speaking-overlay">
            <div className="spinner" />
            <p className="speaking-label">AI is explaining its solution</p>
          </div>
        )}
        {visible && (!isSpeaking || isReplaying) && (
          <>
            <div className="explanation-section">
              <h4>Explanation</h4>
              {renderDetailedExplanation(detailedExplanation, currentBlockIndex)}
            </div>
            <div className="explanation-section">
              <h4>Summary</h4>
              <p className={`explanation-text${currentBlockIndex === 0 ? ' is-speaking' : ''}`}>
                {highLevelExplanation || 'No high-level explanation available yet.'}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="explanation-footer">
        <button className="btn-reject" onClick={() => setPendingAction('reject')} disabled={!visible || isSpeaking}>
          Reject
        </button>
        <button className="btn-accept" onClick={() => setPendingAction('accept')} disabled={!visible || isSpeaking}>
          Accept
        </button>
      </div>

      <ConfirmDialog
        open={pendingAction === 'accept'}
        title="Accept AI solution?"
        message="By accepting the solution, you have evaluated that it would pass all the test cases, do you want to proceed?"
        confirmLabel="Accept"
        variant="accept"
        onConfirm={confirmAccept}
        onCancel={() => setPendingAction(null)}
      />

      <ConfirmDialog
        open={pendingAction === 'reject'}
        title="Reject AI solution?"
        message="By rejecting the solution, you have evaluated that it would fail some or all test cases, do you want to proceed?"
        confirmLabel="Reject"
        variant="reject"
        onConfirm={confirmReject}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  )
}

export default ExplanationPanel
