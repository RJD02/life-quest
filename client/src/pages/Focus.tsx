import { useState } from 'react'
import type { FC } from 'react'
import { motion } from 'framer-motion'
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ClockIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { usePomodoroStore } from '../stores/pomodoroStore'
import { useProjectStore } from '../stores/projectStore'

interface PomodoroTimerProps {
  onSessionComplete?: () => void
}

const PomodoroTimer: FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const {
    currentSession,
    timeRemaining,
    isRunning,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    currentRound,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    getNextSessionType,
  } = usePomodoroStore()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (!currentSession) {
      const sessionType = getNextSessionType()
      startSession(sessionType)
    } else if (isRunning) {
      pauseSession()
    } else {
      resumeSession()
    }
  }

  const handleComplete = () => {
    completeSession()
    onSessionComplete?.()
  }

  const handleCancel = () => {
    cancelSession()
  }

  const progress = currentSession 
    ? ((currentSession.duration * 60 - timeRemaining) / (currentSession.duration * 60)) * 100
    : 0

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="card text-center"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {!currentSession 
            ? 'Ready to Focus?' 
            : currentSession.type === 'work' 
              ? 'Focus Time' 
              : 'Break Time'
          }
        </h2>
        <p className="text-gray-600">
          {!currentSession 
            ? 'Start a Pomodoro session to boost your productivity'
            : currentSession.type === 'work'
              ? 'Stay focused on your current task'
              : 'Take a well-deserved break'
          }
        </p>
      </div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={currentSession?.type === 'work' ? '#3b82f6' : '#10b981'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        {/* Timer display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-gray-900">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Round {currentRound}/4
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors
            ${!currentSession || !isRunning
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
            }
          `}
        >
          {!currentSession || !isRunning ? (
            <>
              <PlayIcon className="w-5 h-5" />
              <span>{!currentSession ? 'Start' : 'Resume'}</span>
            </>
          ) : (
            <>
              <PauseIcon className="w-5 h-5" />
              <span>Pause</span>
            </>
          )}
        </motion.button>

        {currentSession && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <CheckIcon className="w-5 h-5" />
              <span>Complete</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <StopIcon className="w-5 h-5" />
              <span>Stop</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Session Settings Preview */}
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="text-center">
          <div className="font-medium">{workDuration}m</div>
          <div>Work</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{shortBreakDuration}m</div>
          <div>Short Break</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{longBreakDuration}m</div>
          <div>Long Break</div>
        </div>
      </div>
    </motion.div>
  )
}

export const Focus: FC = () => {
  const { tasks } = useProjectStore()
  const { sessions, getTodaysStats } = usePomodoroStore()
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const todayStats = getTodaysStats()
  const activeTasks = tasks.filter(task => task.status === 'in-progress')

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Mode</h1>
        <p className="text-gray-600">
          Use the Pomodoro Technique to stay focused and productive
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <PomodoroTimer />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Progress
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions</span>
                <span className="font-semibold text-gray-900">
                  {todayStats.totalSessions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Focus Time</span>
                <span className="font-semibold text-gray-900">
                  {todayStats.totalWorkTime}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">XP Earned</span>
                <span className="font-semibold text-primary-600">
                  +{todayStats.xpEarned}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Active Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Active Tasks
            </h3>
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-colors
                    ${selectedTask === task.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setSelectedTask(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.xpValue} XP • {task.estimatedPomodoros} 🍅
                      </p>
                    </div>
                    {selectedTask === task.id && (
                      <CheckIcon className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                </div>
              ))}
              {activeTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No active tasks. Add some tasks to get started!
                </p>
              )}
            </div>
          </motion.div>

          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {sessions.slice(-5).reverse().map((session) => (
                <div key={session.id} className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${session.type === 'work' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                    }
                  `}>
                    <ClockIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {session.duration}m {session.type === 'work' ? 'Focus' : 'Break'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.status === 'completed' ? 'Completed' : 'Cancelled'} • 
                      +{session.xpEarned} XP
                    </p>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No sessions yet. Start your first Pomodoro!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}