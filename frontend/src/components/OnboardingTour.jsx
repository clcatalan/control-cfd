import React, { useEffect, useState } from 'react'
import './OnboardingTour.css'

const POPUP_WIDTH = 420
const POPUP_MARGIN = 16
const POPUP_MIN_WIDTH = 240

// Positions the popup to the right of a real (viewport-centered) dialog it's describing,
// rather than the fixed bottom-center spot used for panel highlights. Shrinks to fit
// whatever room is actually there, and a max-height + scroll in CSS covers the rest.
function getDialogPopupStyle(rect) {
  const spaceRight = window.innerWidth - rect.right - POPUP_MARGIN * 2
  const width = Math.max(Math.min(POPUP_WIDTH, spaceRight), POPUP_MIN_WIDTH)
  const left = rect.right + POPUP_MARGIN
  const top = Math.min(rect.top, window.innerHeight - POPUP_MARGIN)
  return {
    left,
    top,
    width,
    maxWidth: width,
    maxHeight: window.innerHeight - top - POPUP_MARGIN,
    transform: 'none',
  }
}

// Highlights one UI element per step (via a moving spotlight box) alongside a fixed
// instruction card. Steps with a `dialog` field force a real ConfirmDialog open (in
// ExplanationPanel, via the parent's tourForcedDialog prop) instead of highlighting a
// panel; for those the popup tracks the dialog's own position rather than getting a
// spotlight, since the dialog already dims the background itself.
// stepIndex/onNext/onPrevious/onClose are lifted to the parent so it can react to which
// step is active.
function OnboardingTour({ steps, stepIndex, onNext, onPrevious, onClose }) {
  const [rect, setRect] = useState(null)

  const step = steps[stepIndex]
  const isDialogStep = Boolean(step.dialog)

  useEffect(() => {
    if (!step.selector) {
      setRect(null)
      return
    }
    let frameId
    let settleTimeoutId
    const updateRect = () => {
      const target = document.querySelector(step.selector)
      if (target) {
        setRect(target.getBoundingClientRect())
      } else {
        // The dialog can take one extra render to mount after tourForcedDialog changes
        // (ExplanationPanel opens it via its own effect), so keep trying until it appears.
        frameId = requestAnimationFrame(updateRect)
      }
    }
    updateRect()
    // ConfirmDialog has a ~150ms scale-in entrance animation, so the very first measurement
    // can catch it mid-transition; re-measure once more after it settles.
    settleTimeoutId = setTimeout(updateRect, 200)
    window.addEventListener('resize', updateRect)
    return () => {
      window.removeEventListener('resize', updateRect)
      clearTimeout(settleTimeoutId)
      if (frameId) cancelAnimationFrame(frameId)
    }
    // Re-run per step, not per selector string: consecutive steps can share the same
    // selector (e.g. both dialog-preview steps use '.confirm-dialog') but target a
    // different dialog instance that needs a fresh measurement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1

  const popupStyle = isDialogStep && rect ? getDialogPopupStyle(rect) : undefined
  const popupClassName = [
    'onboarding-tour-popup',
    popupStyle ? 'onboarding-tour-popup-compact' : 'onboarding-tour-popup-bottom',
  ].join(' ')

  return (
    <>
      {rect && !isDialogStep && (
        <div
          className="onboarding-tour-highlight"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
          }}
        />
      )}
      <div className={popupClassName} style={popupStyle}>
        <div className="onboarding-tour-step-count">
          Step {stepIndex + 1} of {steps.length}
        </div>
        <h3 className="onboarding-tour-title">{step.title}</h3>
        <p className="onboarding-tour-body">{step.body}</p>
        <div className="onboarding-tour-actions">
          <button className="onboarding-tour-skip" onClick={onClose}>
            Skip
          </button>
          <div className="onboarding-tour-nav">
            {!isFirst && (
              <button className="onboarding-tour-btn onboarding-tour-btn-prev" onClick={onPrevious}>
                Previous
              </button>
            )}
            <button className="onboarding-tour-btn onboarding-tour-btn-next" onClick={onNext}>
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OnboardingTour
