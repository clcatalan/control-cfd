import React from 'react'
import './ConfirmDialog.css'

function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, variant, onConfirm, onCancel, children, wide, confirmDisabled, tourId }) {
  if (!open) {
    return null
  }

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div
        className={`confirm-dialog${wide ? ' confirm-dialog-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        data-tour-dialog={tourId}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        {children}
        <div className="confirm-dialog-actions">
          <button className="confirm-dialog-btn confirm-dialog-btn-cancel" onClick={onCancel}>
            {cancelLabel || 'Cancel'}
          </button>
          <button
            className={`confirm-dialog-btn confirm-dialog-btn-confirm confirm-dialog-btn-${variant || 'default'}`}
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
