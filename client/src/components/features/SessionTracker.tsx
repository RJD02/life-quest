import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    Pause,
    Square,
    SkipForward,
    Clock,
    Brain,
    Coffee,
    Target, Calendar, Settings,
    Volume2,
    VolumeX
} from 'lucide-react'
import { usePomodoroStore } from '../../stores/pomodoroStore'
import { useSkillTreeStore } from '../../stores/skillTreeStore'

interface SessionStats {
  totalSessions: number
  totalFocusTime: number
  totalBreakTime: number
  streakDays: number
  averageSessionLength: number
  todaysSessions: number
}

interface SessionSettings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartSessions: boolean
  soundEnabled: boolean
  backgroundSounds: string
}

export const SessionTracker: React.FC = () => {
  const {
    currentSession,
    timeRemaining,
    isRunning,
    startSession,
    pauseSession,
    stopSession,
    skipSession,
    sessionCount,
    completedSessions
  } = usePomodoroStore()

  const { addXp, addNotification } = useSkillTreeStore()

  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 127,
    totalFocusTime: 95.5 * 60, // in minutes
    totalBreakTime: 23.5 * 60,
    streakDays: 12,
    averageSessionLength: 25,
    todaysSessions: 6
  })

  const [settings, setSettings] = useState<SessionSettings>({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartSessions: false,
    soundEnabled: true,
    backgroundSounds: 'nature'
  })

  const [showSettings, setShowSettings] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string>('')

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getNextSessionType = () => {
    if (!currentSession) {
      return 'focus'
    }
    if (currentSession.type === 'work') {
      return sessionCount % settings.sessionsUntilLongBreak === 0 ? 'longBreak' : 'shortBreak'
    }
    return 'focus'
  }

  const getSessionDuration = (type: string) => {
    switch (type) {
      case 'focus':
        return settings.focusDuration * 60
      case 'shortBreak':
        return settings.shortBreakDuration * 60
      case 'longBreak':
        return settings.longBreakDuration * 60
      default:
        return settings.focusDuration * 60
    }
  }

  const handleStart = () => {
    if (!currentSession) {
      const sessionType = getNextSessionType()
      const sessionTypeValue = sessionType === 'focus' ? 'work' 
        : sessionType === 'shortBreak' ? 'short-break' 
        : 'long-break'
      
      startSession(sessionTypeValue)

      // Add notification
      addNotification({
        type: 'SESSION_REMINDER',
        title: `${sessionType === 'focus' ? 'Focus' : 'Break'} Session Started`,
        message: `Time to ${sessionType === 'focus' ? 'focus and be productive!' : 'take a well-deserved break!'}`,
        read: false
      })
    } else {
      pauseSession()
    }
  }

  const handleStop = () => {
    stopSession()
    addNotification({
      type: 'SESSION_REMINDER',
      title: 'Session Stopped',
      message: 'Session ended manually. Take a moment to reflect on your progress.',
      read: false
    })
  }

  const handleSkip = () => {
    skipSession()
    
    // Award XP for completed session
    if (currentSession?.type === 'work') {
      addXp('productivity', 25)
      addNotification({
        type: 'ACHIEVEMENT_UNLOCKED',
        title: '+25 XP Earned!',
        message: 'Focus session completed successfully',
        read: false
      })
    }
  }

  // Progress calculation
  const getProgress = () => {
    if (!currentSession) return 0
    const totalTime = currentSession.duration
    const elapsed = totalTime - timeRemaining
    return (elapsed / totalTime) * 100
  }

  const getCircularProgress = () => {
    const progress = getProgress()
    const radius = 120
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (progress / 100) * circumference
    
    return { strokeDasharray, strokeDashoffset }
  }

  // Session type configurations
  const sessionTypes = {
    focus: {
      name: 'Focus Session',
      icon: <Brain className="w-6 h-6" />,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Time to focus and be productive'
    },
    shortBreak: {
      name: 'Short Break',
      icon: <Coffee className="w-6 h-6" />,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Take a quick break and recharge'
    },
    longBreak: {
      name: 'Long Break',
      icon: <Calendar className="w-6 h-6" />,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Time for a longer, well-deserved break'
    }
  }

  const getCurrentSessionConfig = () => {
    if (!currentSession) {
      return sessionTypes.focus
    }
    
    if (currentSession.type === 'work') {
      return sessionTypes.focus
    } else {
      return sessionCount % settings.sessionsUntilLongBreak === 0 
        ? sessionTypes.longBreak 
        : sessionTypes.shortBreak
    }
  }

  const sessionConfig = getCurrentSessionConfig()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Timer Section */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Focus Session Tracker
          </h1>
          <p className="text-gray-600">
            Stay focused and productive with the Pomodoro technique
          </p>
        </div>

        {/* Circular Timer */}
        <div className="relative inline-block">
          <svg width="280" height="280" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              className={sessionConfig.textColor}
              style={getCircularProgress()}
            />
          </svg>
          
          {/* Timer Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`p-3 rounded-full ${sessionConfig.bgColor} mb-4`}>
              {sessionConfig.icon}
            </div>
            
            <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
              {currentSession ? formatTime(timeRemaining) : '25:00'}
            </div>
            
            <div className={`text-lg font-medium ${sessionConfig.textColor} mb-1`}>
              {sessionConfig.name}
            </div>
            
            <p className="text-sm text-gray-500 text-center max-w-32">
              {sessionConfig.description}
            </p>
          </div>
        </div>

        {/* Task Selection */}
        {!currentSession && (
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What will you focus on? (Optional)
            </label>
            <input
              type="text"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              placeholder="Enter task or project name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Current Task Display */}
        {currentSession?.task && (
          <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-700">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Current Focus:</span>
            </div>
            <p className="text-gray-900 font-medium mt-1">{currentSession.task}</p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className={`
              px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200
              ${currentSession && isRunning
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-blue-500 hover:bg-blue-600'
              }
              shadow-lg hover:shadow-xl
            `}
          >
            {currentSession && isRunning ? (
              <>
                <Pause className="w-5 h-5 inline mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 inline mr-2" />
                {currentSession ? 'Resume' : 'Start Focus'}
              </>
            )}
          </motion.button>

          {currentSession && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStop}
                className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                <Square className="w-5 h-5 inline mr-2" />
                Stop
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSkip}
                className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                <SkipForward className="w-5 h-5 inline mr-2" />
                Complete
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Session Progress */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Session {sessionCount + 1}</span>
          </div>
        </div>

        {/* Session Dots */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${i < sessionCount
                  ? 'bg-blue-500'
                  : i === sessionCount && currentSession
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-gray-200'
                }
              `}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.todaysSessions}
            </div>
            <div className="text-sm text-blue-600">Sessions Today</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatDuration(stats.totalFocusTime)}
            </div>
            <div className="text-sm text-green-600">Focus Time</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.streakDays}
            </div>
            <div className="text-sm text-purple-600">Day Streak</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {stats.averageSessionLength}m
            </div>
            <div className="text-sm text-orange-600">Avg Session</div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
        
        <div className="space-y-3">
          {completedSessions.slice(0, 5).map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-lg
                  ${session.type === 'work' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}
                `}>
                  {session.type === 'work' ? <Brain className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {session.type === 'work' ? 'Focus Session' : 'Break'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {session.task || 'No specific task'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {formatDuration(session.duration / 60)}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(session.endTime || session.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Session Settings
              </h3>

              <div className="space-y-6">
                {/* Duration Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Session Durations</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Focus Duration (minutes)</label>
                      <input
                        type="number"
                        value={settings.focusDuration}
                        onChange={(e) => setSettings({...settings, focusDuration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="120"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Short Break (minutes)</label>
                      <input
                        type="number"
                        value={settings.shortBreakDuration}
                        onChange={(e) => setSettings({...settings, shortBreakDuration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Long Break (minutes)</label>
                      <input
                        type="number"
                        value={settings.longBreakDuration}
                        onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="60"
                      />
                    </div>
                  </div>
                </div>

                {/* Auto Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Automation</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoStartBreaks}
                        onChange={(e) => setSettings({...settings, autoStartBreaks: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Auto-start breaks</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoStartSessions}
                        onChange={(e) => setSettings({...settings, autoStartSessions: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Auto-start sessions</span>
                    </label>
                  </div>
                </div>

                {/* Sound Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Sound</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 flex items-center">
                        {settings.soundEnabled ? (
                          <Volume2 className="w-4 h-4 mr-1" />
                        ) : (
                          <VolumeX className="w-4 h-4 mr-1" />
                        )}
                        Enable sounds
                      </span>
                    </label>
                    
                    {settings.soundEnabled && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Background Sounds</label>
                        <select
                          value={settings.backgroundSounds}
                          onChange={(e) => setSettings({...settings, backgroundSounds: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="none">None</option>
                          <option value="nature">Nature Sounds</option>
                          <option value="rain">Rain</option>
                          <option value="cafe">Cafe Ambience</option>
                          <option value="white-noise">White Noise</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}