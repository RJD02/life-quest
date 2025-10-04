import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface PomodoroSession {
  id: string
  taskId?: string
  projectId?: string
  duration: number // in minutes
  type: 'work' | 'short-break' | 'long-break'
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  startTime: Date
  endTime?: Date
  xpEarned: number
  createdAt: Date
}

interface PomodoroState {
  // Current session
  currentSession: PomodoroSession | null
  timeRemaining: number // in seconds
  isRunning: boolean
  currentRound: number
  totalRounds: number
  
  // Settings
  workDuration: number // in minutes
  shortBreakDuration: number
  longBreakDuration: number
  roundsBeforeLongBreak: number
  autoStartBreaks: boolean
  autoStartWork: boolean
  
  // History
  sessions: PomodoroSession[]
  todaysSessions: PomodoroSession[]
  
  // Stats
  totalSessionsToday: number
  totalXpToday: number
  currentStreak: number
  
  // Actions
  startSession: (type: 'work' | 'short-break' | 'long-break', taskId?: string, projectId?: string) => void
  pauseSession: () => void
  resumeSession: () => void
  completeSession: () => void
  cancelSession: () => void
  setTimeRemaining: (time: number) => void
  
  // Settings actions
  updateSettings: (settings: Partial<{
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    roundsBeforeLongBreak: number
    autoStartBreaks: boolean
    autoStartWork: boolean
  }>) => void
  
  // History actions
  addSession: (session: PomodoroSession) => void
  getSessions: (date?: Date) => PomodoroSession[]
  getSessionsByTask: (taskId: string) => PomodoroSession[]
  
  // Computed values
  getNextSessionType: () => 'work' | 'short-break' | 'long-break'
  getTodaysStats: () => {
    totalSessions: number
    totalWorkTime: number
    totalBreakTime: number
    xpEarned: number
  }
}

export const usePomodoroStore = create<PomodoroState>()(
  devtools(
    (set, get) => ({
      // Current session state
      currentSession: null,
      timeRemaining: 25 * 60, // 25 minutes in seconds
      isRunning: false,
      currentRound: 1,
      totalRounds: 4,
      
      // Default settings
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      roundsBeforeLongBreak: 4,
      autoStartBreaks: false,
      autoStartWork: false,
      
      // History
      sessions: [],
      todaysSessions: [],
      
      // Stats
      totalSessionsToday: 0,
      totalXpToday: 0,
      currentStreak: 0,
      
      startSession: (type, taskId, projectId) => {
        const { workDuration, shortBreakDuration, longBreakDuration } = get()
        const duration = type === 'work' ? workDuration 
          : type === 'short-break' ? shortBreakDuration 
          : longBreakDuration
        
        const session: PomodoroSession = {
          id: crypto.randomUUID(),
          taskId,
          projectId,
          duration,
          type,
          status: 'active',
          startTime: new Date(),
          xpEarned: 0,
          createdAt: new Date(),
        }
        
        set({
          currentSession: session,
          timeRemaining: duration * 60,
          isRunning: true,
        })
      },
      
      pauseSession: () => {
        set((state) => ({
          isRunning: false,
          currentSession: state.currentSession 
            ? { ...state.currentSession, status: 'paused' }
            : null,
        }))
      },
      
      resumeSession: () => {
        set((state) => ({
          isRunning: true,
          currentSession: state.currentSession 
            ? { ...state.currentSession, status: 'active' }
            : null,
        }))
      },
      
      completeSession: () => {
        const { currentSession, currentRound, roundsBeforeLongBreak } = get()
        if (!currentSession) return
        
        const xpEarned = currentSession.type === 'work' ? 25 : 10
        const completedSession = {
          ...currentSession,
          status: 'completed' as const,
          endTime: new Date(),
          xpEarned,
        }
        
        set((state) => ({
          currentSession: null,
          timeRemaining: 0,
          isRunning: false,
          sessions: [...state.sessions, completedSession],
          todaysSessions: [...state.todaysSessions, completedSession],
          totalSessionsToday: state.totalSessionsToday + 1,
          totalXpToday: state.totalXpToday + xpEarned,
          currentRound: currentSession.type === 'work' 
            ? Math.min(currentRound + 1, roundsBeforeLongBreak + 1)
            : currentRound,
        }))
      },
      
      cancelSession: () => {
        const { currentSession } = get()
        if (!currentSession) return
        
        const cancelledSession = {
          ...currentSession,
          status: 'cancelled' as const,
          endTime: new Date(),
        }
        
        set((state) => ({
          currentSession: null,
          timeRemaining: 0,
          isRunning: false,
          sessions: [...state.sessions, cancelledSession],
        }))
      },
      
      setTimeRemaining: (time) => set({ timeRemaining: time }),
      
      updateSettings: (settings) => set(settings),
      
      addSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),
      
      getSessions: (date) => {
        const { sessions } = get()
        if (!date) return sessions
        
        const targetDate = new Date(date).toDateString()
        return sessions.filter(
          (session) => session.createdAt.toDateString() === targetDate
        )
      },
      
      getSessionsByTask: (taskId) => {
        const { sessions } = get()
        return sessions.filter((session) => session.taskId === taskId)
      },
      
      getNextSessionType: () => {
        const { currentRound, roundsBeforeLongBreak, currentSession } = get()
        
        if (!currentSession) return 'work'
        
        if (currentSession.type === 'work') {
          return currentRound >= roundsBeforeLongBreak ? 'long-break' : 'short-break'
        }
        
        return 'work'
      },
      
      getTodaysStats: () => {
        const { todaysSessions } = get()
        const workSessions = todaysSessions.filter(s => s.type === 'work' && s.status === 'completed')
        const breakSessions = todaysSessions.filter(s => s.type !== 'work' && s.status === 'completed')
        
        return {
          totalSessions: todaysSessions.filter(s => s.status === 'completed').length,
          totalWorkTime: workSessions.reduce((acc, s) => acc + s.duration, 0),
          totalBreakTime: breakSessions.reduce((acc, s) => acc + s.duration, 0),
          xpEarned: todaysSessions.reduce((acc, s) => acc + s.xpEarned, 0),
        }
      },
    }),
    {
      name: 'pomodoro-store',
    }
  )
)