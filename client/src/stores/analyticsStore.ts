import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface DailyStat {
  date: string
  tasksCompleted: number
  xpEarned: number
  pomodoroSessions: number
  focusTime: number // in minutes
  projectsWorkedOn: number
}

export interface WeeklyStat {
  weekStart: string
  tasksCompleted: number
  xpEarned: number
  pomodoroSessions: number
  focusTime: number
  averageProductivity: number
}

export interface MonthlyStat {
  month: number
  year: number
  tasksCompleted: number
  xpEarned: number
  pomodoroSessions: number
  focusTime: number
  goalsAchieved: number
}

export interface ProductivityAnalytics {
  averageTasksPerDay: number
  peakProductivityHour: number
  mostProductiveDay: string
  taskCompletionRate: number
  averageTaskDuration: number
}

export interface FocusAnalytics {
  averageSessionDuration: number
  totalFocusTime: number
  focusStreakDays: number
  preferredFocusTime: string
  focusEfficiency: number
}

export interface CategoryBreakdown {
  category: string
  tasksCompleted: number
  timeSpent: number
  xpEarned: number
  percentage: number
}

export interface TimeframeFilter {
  startDate: string
  endDate: string
  period: 'day' | 'week' | 'month' | 'year'
}

interface AnalyticsState {
  // Data
  dailyStats: DailyStat[]
  weeklyStats: WeeklyStat[]
  monthlyStats: MonthlyStat[]
  productivityAnalytics: ProductivityAnalytics | null
  focusAnalytics: FocusAnalytics | null
  categoryBreakdown: CategoryBreakdown[]
  
  // UI State
  selectedTimeframe: TimeframeFilter
  isLoading: boolean
  error: string | null
  
  // Actions
  setTimeframe: (timeframe: TimeframeFilter) => void
  fetchAnalytics: (timeframe: TimeframeFilter) => Promise<void>
  addDailyStat: (stat: DailyStat) => void
  updateTodaysStats: (updates: Partial<DailyStat>) => void
  
  // Computed analytics
  getProductivityTrend: () => { direction: 'up' | 'down' | 'stable'; percentage: number }
  getFocusTrend: () => { direction: 'up' | 'down' | 'stable'; percentage: number }
  getTopCategories: () => CategoryBreakdown[]
  getCurrentStreak: () => number
  getPredictedLevel: () => { level: number; xpNeeded: number; daysToLevel: number }
  
  // Real-time updates
  recordTaskCompletion: (xp: number, category: string, duration?: number) => void
  recordPomodoroSession: (duration: number, focusScore?: number) => void
  recordProjectWork: (projectId: string, duration: number) => void
}

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      dailyStats: [
        { date: '2024-12-01', tasksCompleted: 8, xpEarned: 120, pomodoroSessions: 6, focusTime: 180, projectsWorkedOn: 3 },
        { date: '2024-12-02', tasksCompleted: 12, xpEarned: 200, pomodoroSessions: 8, focusTime: 240, projectsWorkedOn: 4 },
        { date: '2024-12-03', tasksCompleted: 6, xpEarned: 90, pomodoroSessions: 4, focusTime: 120, projectsWorkedOn: 2 },
        { date: '2024-12-04', tasksCompleted: 15, xpEarned: 250, pomodoroSessions: 10, focusTime: 300, projectsWorkedOn: 5 },
        { date: '2024-12-05', tasksCompleted: 10, xpEarned: 180, pomodoroSessions: 7, focusTime: 200, projectsWorkedOn: 3 },
      ],
      weeklyStats: [
        { weekStart: '2024-11-25', tasksCompleted: 45, xpEarned: 750, pomodoroSessions: 30, focusTime: 900, averageProductivity: 85 },
        { weekStart: '2024-12-02', tasksCompleted: 51, xpEarned: 840, pomodoroSessions: 35, focusTime: 1050, averageProductivity: 92 },
      ],
      monthlyStats: [
        { month: 11, year: 2024, tasksCompleted: 180, xpEarned: 3200, pomodoroSessions: 120, focusTime: 3600, goalsAchieved: 8 },
        { month: 12, year: 2024, tasksCompleted: 89, xpEarned: 1560, pomodoroSessions: 65, focusTime: 1950, goalsAchieved: 4 },
      ],
      productivityAnalytics: {
        averageTasksPerDay: 10.2,
        peakProductivityHour: 10, // 10 AM
        mostProductiveDay: 'Tuesday',
        taskCompletionRate: 87.5,
        averageTaskDuration: 45, // minutes
      },
      focusAnalytics: {
        averageSessionDuration: 23.5,
        totalFocusTime: 1950, // minutes
        focusStreakDays: 12,
        preferredFocusTime: '9:00-11:00',
        focusEfficiency: 91.3,
      },
      categoryBreakdown: [
        { category: 'Work', tasksCompleted: 35, timeSpent: 850, xpEarned: 520, percentage: 35 },
        { category: 'Health', tasksCompleted: 25, timeSpent: 300, xpEarned: 375, percentage: 25 },
        { category: 'Learning', tasksCompleted: 20, timeSpent: 600, xpEarned: 300, percentage: 20 },
        { category: 'Personal', tasksCompleted: 15, timeSpent: 200, xpEarned: 225, percentage: 15 },
        { category: 'Other', tasksCompleted: 5, timeSpent: 100, xpEarned: 80, percentage: 5 },
      ],
      selectedTimeframe: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        period: 'week',
      },
      isLoading: false,
      error: null,

      // Actions
      setTimeframe: (timeframe) => {
        set({ selectedTimeframe: timeframe })
        get().fetchAnalytics(timeframe)
      },

      fetchAnalytics: async (timeframe) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: Implement GraphQL query
          console.log('Fetching analytics for timeframe:', timeframe)
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Update analytics based on timeframe
          // This would be replaced with real GraphQL data
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch analytics' 
          })
        }
      },

      addDailyStat: (stat) => {
        set((state) => ({
          dailyStats: [...state.dailyStats.filter(s => s.date !== stat.date), stat]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        }))
      },

      updateTodaysStats: (updates) => {
        const today = new Date().toISOString().split('T')[0]
        const state = get()
        const existingStat = state.dailyStats.find(s => s.date === today)
        
        if (existingStat) {
          const updatedStat = { ...existingStat, ...updates }
          get().addDailyStat(updatedStat)
        } else {
          const newStat: DailyStat = {
            date: today,
            tasksCompleted: 0,
            xpEarned: 0,
            pomodoroSessions: 0,
            focusTime: 0,
            projectsWorkedOn: 0,
            ...updates,
          }
          get().addDailyStat(newStat)
        }
      },

      // Computed analytics
      getProductivityTrend: () => {
        const { weeklyStats } = get()
        if (weeklyStats.length < 2) return { direction: 'stable', percentage: 0 }
        
        const latest = weeklyStats[weeklyStats.length - 1]
        const previous = weeklyStats[weeklyStats.length - 2]
        
        const change = ((latest.averageProductivity - previous.averageProductivity) / previous.averageProductivity) * 100
        
        if (Math.abs(change) < 5) return { direction: 'stable', percentage: Math.abs(change) }
        return { direction: change > 0 ? 'up' : 'down', percentage: Math.abs(change) }
      },

      getFocusTrend: () => {
        const { weeklyStats } = get()
        if (weeklyStats.length < 2) return { direction: 'stable', percentage: 0 }
        
        const latest = weeklyStats[weeklyStats.length - 1]
        const previous = weeklyStats[weeklyStats.length - 2]
        
        const change = ((latest.focusTime - previous.focusTime) / previous.focusTime) * 100
        
        if (Math.abs(change) < 5) return { direction: 'stable', percentage: Math.abs(change) }
        return { direction: change > 0 ? 'up' : 'down', percentage: Math.abs(change) }
      },

      getTopCategories: () => {
        const { categoryBreakdown } = get()
        return categoryBreakdown.sort((a, b) => b.tasksCompleted - a.tasksCompleted).slice(0, 5)
      },

      getCurrentStreak: () => {
        const { dailyStats } = get()
        const sortedStats = [...dailyStats].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        let streak = 0
        const today = new Date()
        
        for (const stat of sortedStats) {
          const statDate = new Date(stat.date)
          const daysDiff = Math.floor((today.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff === streak && stat.tasksCompleted > 0) {
            streak++
          } else {
            break
          }
        }
        
        return streak
      },

      getPredictedLevel: () => {
        const { dailyStats } = get()
        const recentStats = dailyStats.slice(-7) // Last 7 days
        const avgXpPerDay = recentStats.reduce((sum, stat) => sum + stat.xpEarned, 0) / recentStats.length
        
        // Assuming current XP is 7234 and level 15 (from sample data)
        const currentXp = 7234
        const currentLevel = 15
        const xpPerLevel = 500
        const xpToNextLevel = (currentLevel * xpPerLevel) - currentXp
        const daysToLevel = Math.ceil(xpToNextLevel / avgXpPerDay)
        
        return {
          level: currentLevel + 1,
          xpNeeded: xpToNextLevel,
          daysToLevel: isFinite(daysToLevel) ? daysToLevel : 0,
        }
      },

      // Real-time updates
      recordTaskCompletion: (xp, category, duration = 0) => {
        get().updateTodaysStats({
          tasksCompleted: (get().dailyStats.find(s => s.date === new Date().toISOString().split('T')[0])?.tasksCompleted || 0) + 1,
          xpEarned: (get().dailyStats.find(s => s.date === new Date().toISOString().split('T')[0])?.xpEarned || 0) + xp,
        })
        
        // Update category breakdown
        set((state) => ({
          categoryBreakdown: state.categoryBreakdown.map(cat => 
            cat.category === category
              ? { ...cat, tasksCompleted: cat.tasksCompleted + 1, xpEarned: cat.xpEarned + xp }
              : cat
          ),
        }))
      },

      recordPomodoroSession: (duration, focusScore = 8) => {
        get().updateTodaysStats({
          pomodoroSessions: (get().dailyStats.find(s => s.date === new Date().toISOString().split('T')[0])?.pomodoroSessions || 0) + 1,
          focusTime: (get().dailyStats.find(s => s.date === new Date().toISOString().split('T')[0])?.focusTime || 0) + duration,
        })
        
        // Update focus analytics
        const state = get()
        if (state.focusAnalytics) {
          const newTotalSessions = state.dailyStats.reduce((sum, stat) => sum + stat.pomodoroSessions, 0)
          const newTotalTime = state.dailyStats.reduce((sum, stat) => sum + stat.focusTime, 0)
          
          set({
            focusAnalytics: {
              ...state.focusAnalytics,
              averageSessionDuration: newTotalTime / newTotalSessions,
              totalFocusTime: newTotalTime,
              focusEfficiency: (state.focusAnalytics.focusEfficiency + focusScore) / 2, // Simple average
            },
          })
        }
      },

      recordProjectWork: (projectId, duration) => {
        console.log('Recording project work:', projectId, duration)
        // TODO: Implement project-specific tracking
      },
    }),
    { name: 'AnalyticsStore' }
  )
)