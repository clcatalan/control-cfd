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
  isEditing,
  onStartEditing,
  onCancelEditing,
  onSubmit,
  onDialogOpenChange,
}) {
  const [pendingAction, setPendingAction] = useState(null)

  const openDialog = (action) => {
    setPendingAction(action)
    onDialogOpenChange?.(true)
  }

  const closeDialog = () => {
    setPendingAction(null)
    onDialogOpenChange?.(false)
  }

  const confirmAccept = () => {
    console.log('Solution accepted')
    closeDialog()
    onResolved?.(problem?.id, 'accept')
  }

  const confirmReject = () => {
    console.log('Solution rejected, entering edit mode')
    closeDialog()
    onStartEditing?.()
  }

  const confirmSubmit = () => {
    console.log('Edited solution submitted')
    closeDialog()
    onSubmit?.()
  }

  const confirmBack = () => {
    console.log('Editing cancelled, reverting to read-only')
    closeDialog()
    onCancelEditing?.()
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
        {visible && isSpeaking && !isReplaying && (
          <div className="explanation-speaking-overlay">
            <div className="spinner" />
            <p className="speaking-label">AI is explaining its solution</p>
          </div>
        )}
        {visible && narrationEnabled && (!isSpeaking || isReplaying) && (
          <div className="explanation-replay-container">
            <button
              className="narration-btn narration-btn-replay"
              onClick={onReplay}
              disabled={isSpeaking}
              title="Play AI Explanation Again"
            >
              Play AI Explanation Again
            </button>
          </div>
        )}
        {visible && !narrationEnabled && (
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
        {isEditing ? (
          <>
            <button className="btn-back" onClick={() => openDialog('back')} disabled={!visible || isSpeaking}>
              &larr; Back
            </button>
            <button className="btn-submit" onClick={() => openDialog('submit')} disabled={!visible || isSpeaking}>
              Submit
            </button>
          </>
        ) : (
          <>
            <button className="btn-reject" onClick={() => openDialog('reject')} disabled={!visible || isSpeaking}>
              Reject
            </button>
            <button className="btn-accept" onClick={() => openDialog('accept')} disabled={!visible || isSpeaking}>
              Accept
            </button>
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingAction === 'accept'}
        title="Accept AI solution?"
        message="By accepting the solution, you have evaluated that it would pass all the test cases, do you want to proceed?"
        confirmLabel="Accept"
        variant="accept"
        onConfirm={confirmAccept}
        onCancel={closeDialog}
      />

      <ConfirmDialog
        open={pendingAction === 'reject'}
        title="Reject AI solution?"
        message={`By rejecting the solution, you have evaluated that it would fail some or all test cases.\n\nThis would make the text editor writable, and allow you to make changes to AI's solution until you have evaluated it to be correct and pass all test cases.\n\nDo you want to proceed?`}
        confirmLabel="Proceed"
        variant="reject"
        onConfirm={confirmReject}
        onCancel={closeDialog}
      />

      <ConfirmDialog
        open={pendingAction === 'submit'}
        title="Submit your solution?"
        message="This will save your current code as your final submission for this problem. Do you want to proceed?"
        confirmLabel="Submit"
        variant="accept"
        onConfirm={confirmSubmit}
        onCancel={closeDialog}
      />

      <ConfirmDialog
        open={pendingAction === 'back'}
        title="Return to read-only mode?"
        message="This would return the editor to read-only mode, and will revert back to the original AI-generated solution, do you want to proceed?"
        confirmLabel="Proceed"
        variant="reject"
        onConfirm={confirmBack}
        onCancel={closeDialog}
      />
    </div>
  )
}

export default ExplanationPanel
