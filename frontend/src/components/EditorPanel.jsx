import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import './EditorPanel.css'

const defaultCode = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
    
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`
}

function EditorPanel() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(defaultCode.javascript)

  const handleLanguageChange = (e) => {
    const newLang = e.target.value
    setLanguage(newLang)
    setCode(defaultCode[newLang])
  }

  const handleEditorChange = (value) => {
    setCode(value)
  }

  const handleRun = () => {
    console.log('Generating AI solution...')
    alert('AI Generate Solution functionality would generate a solution here!')
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
          <button className="btn-run" onClick={handleRun}>
            AI Generate Solution
          </button>
        </div>
      </div>

      <div className="editor-container">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
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
