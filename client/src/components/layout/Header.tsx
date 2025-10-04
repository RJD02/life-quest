import { useState } from 'react'
import type { FC } from 'react'
import { motion } from 'framer-motion'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { usePomodoroStore } from '../../stores/pomodoroStore'

interface HeaderProps {
  onToggleSidebar: () => void
}

export const Header: FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { currentSession, timeRemaining, isRunning } = usePomodoroStore()

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
      className="navbar shadow-sm"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Bars3Icon className="w-5 h-5 text-gray-600" />
        </button>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Pomodoro Timer */}
        {currentSession && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
              px-4 py-2 rounded-lg font-mono text-sm font-medium
              ${currentSession.type === 'work' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-green-100 text-green-700'
              }
              ${isRunning ? 'animate-pulse' : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isRunning ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span>{formatTime(timeRemaining)}</span>
              <span className="text-xs opacity-75">
                {currentSession.type === 'work' ? 'Focus' : 'Break'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <BellIcon className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Welcome back!</p>
            <p className="text-xs text-gray-500">Level 5 • 1,250 XP</p>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <UserCircleIcon className="w-8 h-8 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}