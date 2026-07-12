import React, { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth')
    if (adminAuth === 'true') {
      setIsAdminLoggedIn(true)
    }
  }, [])

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true)
    localStorage.setItem('adminAuth', 'true')
  }

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
    localStorage.removeItem('adminAuth')
  }

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  return (
    <BrowserRouter basename="/admin">
      <Dashboard onLogout={handleAdminLogout} />
    </BrowserRouter>
  )
}

export default App
