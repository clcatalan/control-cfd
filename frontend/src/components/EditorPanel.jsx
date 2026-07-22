import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import './EditorPanel.css'

const defaultCode = {
  javascript: ``,
  python: ``,
  java: ``,
  cpp: ``
}

function EditorPanel({
  problem,
  language,
  onLanguageChange,
  onGenerateStart,
  onGenerateComplete,
  activeLineRanges,
  code,
  onCodeChange,
  readOnly,
  solutionVisible,
  holdForNarration,
  narrationFirstReadDone,
}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPassedLabel, setShowPassedLabel] = useState(false)
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const decorationIdsRef = useRef([])

  // For the experimental group, hold off entirely until the voice narration's first
  // read-through has finished (holdForNarration + narrationFirstReadDone) — otherwise
  // "tests passed" could show while the AI is still explaining the solution. Once the
  // gate opens, "Running tests..." shows for 3s before flipping to "passed", same as
  // the control group; it doesn't re-hide for later narration replays.
  const testsGateOpen = !holdForNarration || narrationFirstReadDone

  useEffect(() => {
    if (!solutionVisible || !testsGateOpen) {
      setShowPassedLabel(false)
      return
    }
    const timerId = setTimeout(() => setShowPassedLabel(true), 3000)
    return () => clearTimeout(timerId)
  }, [solutionVisible, testsGateOpen])

  const handleEditorMount = (editor, monacoInstance) => {
    editorRef.current = editor
    monacoRef.current = monacoInstance
  }

  useEffect(() => {
    const editor = editorRef.current
    const monacoInstance = monacoRef.current
    if (!editor || !monacoInstance) return

    if (!activeLineRanges || activeLineRanges.length === 0) {
      decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, [])
      return
    }

    const decorations = activeLineRanges.map((range) => ({
      range: new monacoInstance.Range(range.start, 1, range.end, 1),
      options: { isWholeLine: true, className: 'narration-highlight-line' },
    }))
    decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, decorations)
    editor.revealLineInCenterIfOutsideViewport(activeLineRanges[0].start)
  }, [activeLineRanges])

  const handleLanguageChange = (e) => {
    const newLang = e.target.value
    onLanguageChange(newLang)
    onCodeChange?.(defaultCode[newLang])
  }

  const handleEditorChange = (value) => {
    onCodeChange?.(value)
  }

  const handleRun = () => {
    const solution = problem?.solutions?.[language]
    if (solution) {
      setIsGenerating(true)
      onGenerateStart?.()
      setTimeout(() => {
        setIsGenerating(false)
        onGenerateComplete?.(solution)
      }, 3000)
    } else {
      alert(`No pre-defined ${language} solution available for this problem yet.`)
    }
  }

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <div className="editor-controls">
          <select 
            className="language-select" 
            value={language} 
            onChange={handleLanguageChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="editor-state">
          {readOnly ? <span className="read-only-label">Read-Only</span> : <span className="editable-label">Editable</span>}
        </div>
        <div className="editor-actions">
          <button className="btn-run" onClick={handleRun} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate AI Solution'}
          </button>
        </div>
      </div>

      <div className="editor-container">
        {isGenerating && (
          <div className="editor-loading-overlay">
            <div className="spinner" />
          </div>
        )}
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            readOnly: readOnly ?? true,
            domReadOnly: readOnly ?? true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            contextmenu: false,
            padding: { top: 16, bottom: 16 },
            fixedOverflowWidgets: true
          }}
        />
      </div>

      {solutionVisible && testsGateOpen && (
        showPassedLabel ? (
          <div className="test-pass-label">The solution passed all example test cases</div>
        ) : (
          <div className="test-pass-label test-pass-label-pending">Running tests on the solution...</div>
        )
      )}

      {/* <div className="console-area">
        <div className="console-header">
          <span>Console</span>
        </div>
        <div className="console-content">
          <p className="console-placeholder">Click "Run Code" to see the output here</p>
        </div>
      </div> */}
    </div>
  )
}

export default EditorPanel
