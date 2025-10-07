import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Focus } from './pages/Focus'
import { Projects } from './pages/Projects'
import { Sprints } from './pages/Sprints'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { AuthPage } from './pages/AuthPage'
import { ToastContainer, useToast } from './components/ui/Toast'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'

function App() {
  const { toasts, removeToast } = useToast()
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore()
  const { applyThemeToDocument } = useThemeStore()

  useEffect(() => {
    initializeAuth()
    // Apply theme on app initialization
    applyThemeToDocument()
  }, [initializeAuth, applyThemeToDocument])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto"
            style={{ borderColor: 'var(--color-primary)' }}
          ></div>
          <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>Loading LifeQuest...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/sprints" element={<Sprints />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      )}
      
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </Router>
  )
}

export default App
