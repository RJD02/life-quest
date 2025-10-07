import { useState } from 'react'
import type { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { usePomodoroStore } from '../../stores/pomodoroStore'
import { useAuthStore } from '../../stores/authStore'
import { NotificationCenter } from './NotificationCenter'
import { ThemeToggle } from '../ui/ThemeToggle'

interface HeaderProps {
  onToggleSidebar: () => void
}

export const Header: FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { currentSession, timeRemaining, isRunning } = usePomodoroStore()
  const { user, logout } = useAuthStore()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-4 flex items-center justify-between shadow-sm transition-all duration-200"
      style={{ 
        backgroundColor: 'var(--color-header)',
        borderBottom: '1px solid var(--color-header-border)',
        color: 'var(--color-header-foreground)'
      }}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg transition-colors duration-200"
          style={{ backgroundColor: 'transparent' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Bars3Icon className="w-5 h-5" style={{ color: 'var(--color-header-foreground)' }} />
        </button>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
            style={{ color: 'var(--color-muted-foreground)' }}
          />
          <input
            type="text"
            placeholder="Search projects, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 rounded-lg focus:outline-none transition-all duration-200"
            style={{ 
              backgroundColor: 'var(--color-input)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-ring)'
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Pomodoro Timer */}
        {currentSession && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: currentSession.type === 'work' 
                ? 'var(--color-primary)' 
                : 'var(--color-success)',
              color: currentSession.type === 'work'
                ? 'var(--color-primary-foreground)'
                : 'var(--color-success-foreground)',
              opacity: isRunning ? 1 : 0.8
            }}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: isRunning ? 'var(--color-success)' : 'var(--color-muted-foreground)'
                }}
              />
              <span>{formatTime(timeRemaining)}</span>
              <span className="text-xs opacity-75">
                {currentSession.type === 'work' ? 'Focus' : 'Break'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        <NotificationCenter />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: 'var(--color-header-foreground)' }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Welcome back!'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                Level {user?.level || 1} • {user?.xp.toLocaleString() || '0'} XP
              </p>
            </div>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative p-1 rounded-full transition-colors duration-200"
              style={{ backgroundColor: 'transparent' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8" style={{ color: 'var(--color-header-foreground)' }} />
              )}
            </button>
          </div>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50"
                  style={{ 
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div 
                    className="p-3"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                      {user?.email}
                    </p>
                  </div>
                  
                  <div className="p-1">
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors"
                      style={{ 
                        color: 'var(--color-foreground)',
                        backgroundColor: 'transparent'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}