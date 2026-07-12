import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import './EditorPanel.css'

const defaultCode = {
  javascript: ``,
  python: ``,
  java: ``,
  cpp: ``
}

function EditorPanel({ problem, language, onLanguageChange, onGenerateStart, onGenerateComplete }) {
  const [code, setCode] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleLanguageChange = (e) => {
    const newLang = e.target.value
    onLanguageChange(newLang)
    setCode(defaultCode[newLang])
  }

  const handleEditorChange = (value) => {
    setCode(value)
  }

  const handleRun = () => {
    const solution = problem?.solutions?.[language]
    if (solution) {
      setIsGenerating(true)
      onGenerateStart?.()
      setTimeout(() => {
        setCode(solution)
        setIsGenerating(false)
        onGenerateComplete?.()
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
          theme="vs-dark"
          options={{
            readOnly: true,
            domReadOnly: true,
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
            padding: { top: 16, bottom: 16 }
          }}
        />
      </div>

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
