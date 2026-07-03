import React, { useState } from 'react'
import ProblemPanel from './components/ProblemPanel'
import EditorPanel from './components/EditorPanel'
import ExplanationPanel from './components/ExplanationPanel'
import './App.css'

function App() {
  const [leftWidth, setLeftWidth] = useState(30)
  const [middleWidth, setMiddleWidth] = useState(40)
  const [activeHandle, setActiveHandle] = useState(null)

  const handleMouseDown = (handle) => {
    setActiveHandle(handle)
  }

  const handleMouseUp = () => {
    setActiveHandle(null)
  }

  const handleMouseMove = (e) => {
    if (!activeHandle) return
    
    const container = document.querySelector('.app')
    const containerRect = container.getBoundingClientRect()
    const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100
    
    if (activeHandle === 'left') {
      // Dragging first handle (between problem and editor)
      if (percentage >= 20 && percentage <= 50) {
        setLeftWidth(percentage)
      }
    } else if (activeHandle === 'right') {
      // Dragging second handle (between editor and explanation)
      const newMiddleWidth = percentage - leftWidth
      if (newMiddleWidth >= 25 && newMiddleWidth <= 55 && percentage <= 80) {
        setMiddleWidth(newMiddleWidth)
      }
    }
  }

  React.useEffect(() => {
    if (activeHandle) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [activeHandle, leftWidth, middleWidth])

  const rightWidth = 100 - leftWidth - middleWidth

  return (
    <div className="app">
      <div className="panel-left" style={{ width: `${leftWidth}%` }}>
        <ProblemPanel />
      </div>
      <div 
        className={`resize-handle ${activeHandle === 'left' ? 'dragging' : ''}`}
        onMouseDown={() => handleMouseDown('left')}
      />
      <div className="panel-middle" style={{ width: `${middleWidth}%` }}>
        <EditorPanel />
      </div>
      <div 
        className={`resize-handle ${activeHandle === 'right' ? 'dragging' : ''}`}
        onMouseDown={() => handleMouseDown('right')}
      />
      <div className="panel-right" style={{ width: `${rightWidth}%` }}>
        <ExplanationPanel />
      </div>
    </div>
  )
}

export default App
