import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Sprint {
  id: string
  name: string
  description?: string
  startDate: Date
  endDate: Date
  status: 'planned' | 'active' | 'completed'
  goalXp: number
  earnedXp: number
  taskIds: string[]
  createdAt: Date
  updatedAt: Date
}

interface SprintState {
  currentSprint: Sprint | null
  sprints: Sprint[]
  isLoading: boolean

  // Actions
  setCurrentSprint: (sprint: Sprint | null) => void
  setSprints: (sprints: Sprint[]) => void
  setIsLoading: (isLoading: boolean) => void

  // Sprint operations
  createSprint: (sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateSprint: (sprintId: string, updates: Partial<Sprint>) => void
  deleteSprint: (sprintId: string) => void
  startSprint: (sprintId: string) => void
  completeSprint: (sprintId: string) => void

  // Task management in sprint
  addTaskToSprint: (sprintId: string, taskId: string) => void
  removeTaskFromSprint: (sprintId: string, taskId: string) => void

  // Computed values
  getSprintProgress: (sprintId: string) => number
  getActiveSprintTasks: () => string[]
  getSprintStats: (sprintId: string) => {
    totalTasks: number
    completedTasks: number
    progressPercentage: number
    xpProgress: number
    daysRemaining: number
  }
}

export const useSprintStore = create<SprintState>()(
  devtools(
    (set, get) => ({
      currentSprint: null,
      sprints: [],
      isLoading: false,

      setCurrentSprint: (currentSprint) => set({ currentSprint }),
      setSprints: (sprints) => set({ sprints }),
      setIsLoading: (isLoading) => set({ isLoading }),

      createSprint: (sprintData) => {
        const newSprint: Sprint = {
          ...sprintData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          sprints: [...state.sprints, newSprint],
        }))
      },

      updateSprint: (sprintId, updates) =>
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? { ...sprint, ...updates, updatedAt: new Date() }
              : sprint
          ),
          currentSprint:
            state.currentSprint?.id === sprintId
              ? { ...state.currentSprint, ...updates, updatedAt: new Date() }
              : state.currentSprint,
        })),

      deleteSprint: (sprintId) =>
        set((state) => ({
          sprints: state.sprints.filter((sprint) => sprint.id !== sprintId),
          currentSprint:
            state.currentSprint?.id === sprintId ? null : state.currentSprint,
        })),

      startSprint: (sprintId) => {
        set((state) => {
          const sprint = state.sprints.find((s) => s.id === sprintId)
          if (!sprint) return state

          const updatedSprint = {
            ...sprint,
            status: 'active' as const,
            updatedAt: new Date(),
          }

          return {
            sprints: state.sprints.map((s) =>
              s.id === sprintId ? updatedSprint : s
            ),
            currentSprint: updatedSprint,
          }
        })
      },

      completeSprint: (sprintId) => {
        set((state) => {
          const updatedSprints = state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? { ...sprint, status: 'completed' as const, updatedAt: new Date() }
              : sprint
          )

          return {
            sprints: updatedSprints,
            currentSprint:
              state.currentSprint?.id === sprintId ? null : state.currentSprint,
          }
        })
      },

      addTaskToSprint: (sprintId, taskId) =>
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  taskIds: [...sprint.taskIds, taskId],
                  updatedAt: new Date(),
                }
              : sprint
          ),
          currentSprint:
            state.currentSprint?.id === sprintId
              ? {
                  ...state.currentSprint,
                  taskIds: [...state.currentSprint.taskIds, taskId],
                  updatedAt: new Date(),
                }
              : state.currentSprint,
        })),

      removeTaskFromSprint: (sprintId, taskId) =>
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  taskIds: sprint.taskIds.filter((id) => id !== taskId),
                  updatedAt: new Date(),
                }
              : sprint
          ),
          currentSprint:
            state.currentSprint?.id === sprintId
              ? {
                  ...state.currentSprint,
                  taskIds: state.currentSprint.taskIds.filter(
                    (id) => id !== taskId
                  ),
                  updatedAt: new Date(),
                }
              : state.currentSprint,
        })),

      getSprintProgress: (sprintId) => {
        const { sprints } = get()
        const sprint = sprints.find((s) => s.id === sprintId)
        if (!sprint || sprint.goalXp === 0) return 0
        return Math.min((sprint.earnedXp / sprint.goalXp) * 100, 100)
      },

      getActiveSprintTasks: () => {
        const { currentSprint } = get()
        return currentSprint?.taskIds || []
      },

      getSprintStats: (sprintId) => {
        const { sprints } = get()
        const sprint = sprints.find((s) => s.id === sprintId)

        if (!sprint) {
          return {
            totalTasks: 0,
            completedTasks: 0,
            progressPercentage: 0,
            xpProgress: 0,
            daysRemaining: 0,
          }
        }

        const now = new Date()
        const endDate = new Date(sprint.endDate)
        const daysRemaining = Math.max(
          0,
          Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        )

        // Note: To get actual task completion stats, we'd need to cross-reference with task store
        // For now, returning basic stats
        return {
          totalTasks: sprint.taskIds.length,
          completedTasks: 0, // Would need to check task statuses
          progressPercentage: get().getSprintProgress(sprintId),
          xpProgress: sprint.goalXp > 0 ? (sprint.earnedXp / sprint.goalXp) * 100 : 0,
          daysRemaining,
        }
      },
    }),
    {
      name: 'sprint-store',
    }
  )
)