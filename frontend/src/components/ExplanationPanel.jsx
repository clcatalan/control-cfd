import React, { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import './ExplanationPanel.css'

const languageFields = {
  javascript: { hle: 'hleJS', dle: 'dleJS' },
  python: { hle: 'hlePython', dle: 'dlePython' },
  java: { hle: 'hleJava', dle: 'dleJava' },
  cpp: { hle: 'hleCpp', dle: 'dleCPP' },
}

const LINE_LABEL_PATTERN = /^(lines?\s+[\d,\s-]+)\n([\s\S]*)$/i

function renderDetailedExplanation(text) {
  if (!text) {
    return <p className="explanation-text">No detailed explanation available yet.</p>
  }

  return text.split('\n\n').map((paragraph, index) => {
    const match = paragraph.match(LINE_LABEL_PATTERN)
    if (!match) {
      return (
        <p className="explanation-text" key={index}>
          {paragraph}
        </p>
      )
    }
    const [, label, sentence] = match
    return (
      <div className="explanation-line-block" key={index}>
        <span className="line-breadcrumb">{label}</span>
        <p className="explanation-text">{sentence}</p>
      </div>
    )
  })
}

function ExplanationPanel({ problem, language, visible, isGenerating, onResolved }) {
  const [pendingAction, setPendingAction] = useState(null)

  const confirmAccept = () => {
    console.log('Solution accepted')
    setPendingAction(null)
    onResolved?.(problem?.id)
  }

  const confirmReject = () => {
    console.log('Solution rejected')
    setPendingAction(null)
    onResolved?.(problem?.id)
  }

  const fields = languageFields[language] || languageFields.javascript
  const highLevelExplanation = problem?.[fields.hle]
  const detailedExplanation = problem?.[fields.dle]

  return (
    <div className="explanation-panel">
      <div className="explanation-header">
        <h2>AI Explanation</h2>
      </div>

      <div className="explanation-content">
        {isGenerating && (
          <div className="explanation-loading">
            <div className="spinner" />
          </div>
        )}
        {visible && (
          <>
            <div className="explanation-section">
              <h4>High-Level Explanation</h4>
              <p className="explanation-text">
                {highLevelExplanation || 'No high-level explanation available yet.'}
              </p>
            </div>

            <div className="explanation-section">
              <h4>Detailed Explanation</h4>
              {renderDetailedExplanation(detailedExplanation)}
            </div>
          </>
        )}
      </div>

      <div className="explanation-footer">
        <button className="btn-reject" onClick={() => setPendingAction('reject')} disabled={!visible}>
          Reject
        </button>
        <button className="btn-accept" onClick={() => setPendingAction('accept')} disabled={!visible}>
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
