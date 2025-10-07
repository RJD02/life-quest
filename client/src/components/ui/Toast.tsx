import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Check,
    X,
    AlertTriangle,
    Info,
    Trophy,
    Flame,
    Target,
    Clock,
} from 'lucide-react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'xp' | 'task' | 'session'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5" />
      case 'error':
        return <X className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'info':
        return <Info className="w-5 h-5" />
      case 'achievement':
        return <Trophy className="w-5 h-5" />
      case 'xp':
        return <Flame className="w-5 h-5" />
      case 'task':
        return <Target className="w-5 h-5" />
      case 'session':
        return <Clock className="w-5 h-5" />
    }
  }

  const getStyles = () => {
    const baseStyles = 'border-l-4'
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`
      case 'achievement':
        return `${baseStyles} bg-purple-50 border-purple-500 text-purple-800`
      case 'xp':
        return `${baseStyles} bg-orange-50 border-orange-500 text-orange-800`
      case 'task':
        return `${baseStyles} bg-indigo-50 border-indigo-500 text-indigo-800`
      case 'session':
        return `${baseStyles} bg-cyan-50 border-cyan-500 text-cyan-800`
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
      case 'achievement':
        return 'text-purple-500'
      case 'xp':
        return 'text-orange-500'
      case 'task':
        return 'text-indigo-500'
      case 'session':
        return 'text-cyan-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 500 }}
      className={`
        relative w-96 p-4 rounded-lg shadow-lg backdrop-blur-sm
        ${getStyles()}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 mt-0.5 ${getIconColor()}`}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold leading-5">
            {title}
          </h4>
          {message && (
            <p className="mt-1 text-sm opacity-90">
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 ml-auto text-current opacity-50 hover:opacity-75 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-bl-lg"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  onRemoveToast: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onRemoveToast}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id, onClose: () => {} }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = React.useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }, [addToast])

  const error = React.useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }, [addToast])

  const warning = React.useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }, [addToast])

  const info = React.useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }, [addToast])

  const achievement = React.useCallback((title: string, message?: string) => {
    addToast({ type: 'achievement', title, message, duration: 8000 })
  }, [addToast])

  const xp = React.useCallback((title: string, message?: string) => {
    addToast({ type: 'xp', title, message, duration: 6000 })
  }, [addToast])

  const task = React.useCallback((title: string, message?: string) => {
    addToast({ type: 'task', title, message })
  }, [addToast])

  const session = React.useCallback((title: string, message?: string) => {
    addToast({ type: 'session', title, message })
  }, [addToast])

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
    achievement,
    xp,
    task,
    session,
  }
}