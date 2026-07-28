import React, { useEffect, useState } from 'react'
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

const BUG_TYPES = [
  {
    label: 'Syntax Error',
    description: 'The code contains syntax errors, such as a missing parenthesis or semicolon.',
  },
  {
    label: 'Silly Mistake',
    description: 'The code contains issues such as redundant conditions or unnecessary casting.',
  },
  {
    label: 'Missing Corner Cases',
    description: 'The code operates correctly, except for overlooking certain corner cases.',
  },
  {
    label: 'Wrong Input Type',
    description: 'The code contains an incorrect input type in a correct function call.',
  },
  {
    label: 'Hallucinated Object',
    description: 'The code utilizes an object that neither exists nor has been defined.',
  },
  {
    label: 'Wrong Attribute',
    description: 'The code contains an incorrect/nonexistent attribute for an object or module.',
  },
]

const CERTAINTY_LEVELS = [
  'Very Uncertain',
  'Uncertain',
  'Neither Certain nor Uncertain',
  'Certain',
  'Very Certain',
]

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
  tourForcedDialog,
}) {
  const [pendingAction, setPendingAction] = useState(null)
  const [bugType, setBugType] = useState(null)
  const [certainty, setCertainty] = useState(null)

  const openDialog = (action) => {
    setPendingAction(action)
    setBugType(null)
    setCertainty(null)
    onDialogOpenChange?.(true)
  }

  const closeDialog = () => {
    setPendingAction(null)
    onDialogOpenChange?.(false)
  }

  // The sample-problem tour previews the real Accept/Reject dialogs by forcing them open
  // here instead of rendering separate mock dialogs. Reacts only to the tour advancing
  // steps (not to the dialog being closed via Cancel), so Cancel doesn't get reopened.
  useEffect(() => {
    if (tourForcedDialog) {
      openDialog(tourForcedDialog)
    } else if (pendingAction === 'accept' || pendingAction === 'reject') {
      closeDialog()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourForcedDialog])

  const confirmAccept = () => {
    closeDialog()
    if (tourForcedDialog === 'accept') return
    console.log('Solution accepted')
    onResolved?.(problem?.id, 'accept', null, null, certainty)
  }

  const confirmReject = () => {
    closeDialog()
    if (tourForcedDialog === 'reject') return
    console.log('Solution rejected')
    onResolved?.(problem?.id, 'reject', null, bugType, certainty)
  }

  const renderCertaintyChoices = () => (
    <div className="bug-type-choices">
      {CERTAINTY_LEVELS.map((level) => (
        <label className="bug-type-choice" key={level}>
          <input
            type="radio"
            name="certainty"
            value={level}
            checked={certainty === level}
            onChange={() => setCertainty(level)}
          />
          {level}
        </label>
      ))}
    </div>
  )

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
  // Problem 0 is the sample onboarding problem — show a placeholder instead of a
  // real explanation, since it's just for practicing the accept/reject UI.
  const isOnboardingProblem = problem?.id === 0

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
          isOnboardingProblem ? (
            <div className="explanation-section">
              <p className="explanation-text">This panel will contain AI's explanation for its solution</p>
            </div>
          ) : (
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
          )
        )}
      </div>

      <div className="explanation-footer" data-tour="accept-reject-buttons">
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
        message="By accepting the solution, you have evaluated that it would pass all the test cases, how certain are you of this?"
        confirmLabel="Accept"
        variant="accept"
        onConfirm={confirmAccept}
        onCancel={closeDialog}
        confirmDisabled={!certainty}
        wide
        tourId="accept"
      >
        {renderCertaintyChoices()}
      </ConfirmDialog>

      <ConfirmDialog
        open={pendingAction === 'reject'}
        title="Reject AI solution?"
        message="You have evaluated the code to contain an error that would cause it to fail certain/all test cases. Which of the following bug type do you think caused this failure?"
        confirmLabel="Proceed"
        variant="reject"
        onConfirm={confirmReject}
        onCancel={closeDialog}
        confirmDisabled={!bugType || !certainty}
        wide
        tourId="reject"
      >
        <div className="bug-type-choices">
          {BUG_TYPES.map(({ label, description }) => (
            <label className="bug-type-choice" key={label}>
              <input
                type="radio"
                name="bug-type"
                value={label}
                checked={bugType === label}
                onChange={() => setBugType(label)}
              />
              <span>
                <span className="bug-type-choice-label">{label}</span>
                {' - '}
                {description}
              </span>
            </label>
          ))}
        </div>

        <p className="confirm-dialog-message confirm-dialog-followup">How certain are you of your response?</p>
        {renderCertaintyChoices()}
      </ConfirmDialog>

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
