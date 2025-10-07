import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface SkillTree {
  id: string
  name: string
  category: 'PRODUCTIVITY' | 'HEALTH' | 'LEARNING' | 'CREATIVITY' | 'SOCIAL' | 'FINANCE' | 'PERSONAL'
  totalXp: number
  level: number
  skills: Skill[]
}

export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  requiredXp: number
  unlocked: boolean
  level: number
  maxLevel: number
  category: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  unlockedAt: string
  criteria: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  completed: boolean
  xpReward: number
  badgeReward?: Badge
  unlockedAt?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'TASK_DUE' | 'SESSION_REMINDER' | 'ACHIEVEMENT_UNLOCKED' | 'BADGE_EARNED' | 'SPRINT_COMPLETED' | 'COLLABORATION_INVITE' | 'SYSTEM_UPDATE'
  read: boolean
  data?: string
  createdAt: string
}

interface SkillTreeState {
  skillTrees: SkillTree[]
  badges: Badge[]
  achievements: Achievement[]
  notifications: Notification[]
  
  // Actions
  addXpToSkill: (category: string, xp: number) => void
  addXp: (category: string, xp: number) => void
  getXpByCategory: (category: string) => number
  unlockBadge: (badge: Badge) => void
  updateAchievementProgress: (achievementId: string, progress: number) => void
  markNotificationAsRead: (notificationId: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  getUnreadNotificationCount: () => number
  
  // Skill tree management
  fetchSkillTrees: () => Promise<void>
  fetchBadges: () => Promise<void>
  fetchAchievements: () => Promise<void>
  
  // Real-time features
  subscribeToNotifications: () => void
  unsubscribeFromNotifications: () => void
}

export const useSkillTreeStore = create<SkillTreeState>()(
  devtools(
    persist(
      (set, get) => ({
        skillTrees: [
          {
            id: '1',
            name: 'Productivity Master',
            category: 'PRODUCTIVITY',
            totalXp: 2450,
            level: 12,
            skills: [
              {
                id: '1',
                name: 'Task Completion',
                description: 'Master the art of completing tasks efficiently',
                icon: '✅',
                requiredXp: 100,
                unlocked: true,
                level: 8,
                maxLevel: 10,
                category: 'PRODUCTIVITY',
              },
              {
                id: '2',
                name: 'Focus Sessions',
                description: 'Improve your ability to maintain deep focus',
                icon: '🎯',
                requiredXp: 200,
                unlocked: true,
                level: 6,
                maxLevel: 10,
                category: 'PRODUCTIVITY',
              },
            ],
          },
          {
            id: '2',
            name: 'Health & Wellness',
            category: 'HEALTH',
            totalXp: 1800,
            level: 9,
            skills: [
              {
                id: '3',
                name: 'Exercise Consistency',
                description: 'Build a consistent exercise routine',
                icon: '💪',
                requiredXp: 150,
                unlocked: true,
                level: 5,
                maxLevel: 10,
                category: 'HEALTH',
              },
            ],
          },
        ],
        badges: [
          {
            id: '1',
            name: 'First Steps',
            description: 'Completed your first task',
            icon: '👶',
            rarity: 'COMMON',
            unlockedAt: '2024-12-01T10:00:00Z',
            criteria: 'Complete 1 task',
          },
          {
            id: '2',
            name: 'Focus Warrior',
            description: 'Completed 10 focus sessions',
            icon: '⚔️',
            rarity: 'RARE',
            unlockedAt: '2024-12-03T15:30:00Z',
            criteria: 'Complete 10 Pomodoro sessions',
          },
        ],
        achievements: [
          {
            id: '1',
            name: 'Task Master',
            description: 'Complete 100 tasks',
            icon: '🏆',
            progress: 87,
            maxProgress: 100,
            completed: false,
            xpReward: 500,
          },
          {
            id: '2',
            name: 'Focus Champion',
            description: 'Complete 50 focus sessions',
            icon: '🔥',
            progress: 32,
            maxProgress: 50,
            completed: false,
            xpReward: 300,
          },
          {
            id: '3',
            name: 'Streak Legend',
            description: 'Maintain a 30-day streak',
            icon: '⚡',
            progress: 12,
            maxProgress: 30,
            completed: false,
            xpReward: 1000,
          },
        ],
        notifications: [],

        addXpToSkill: (category, xp) => {
          set((state) => ({
            skillTrees: state.skillTrees.map((tree) => {
              if (tree.category === category) {
                const newTotalXp = tree.totalXp + xp
                const newLevel = Math.floor(newTotalXp / 200) + 1 // 200 XP per level
                return {
                  ...tree,
                  totalXp: newTotalXp,
                  level: newLevel,
                }
              }
              return tree
            }),
          }))
        },

        addXp: (category, xp) => {
          // Alias for addXpToSkill for backward compatibility
          get().addXpToSkill(category, xp)
        },

        getXpByCategory: (category) => {
          const tree = get().skillTrees.find((tree) => tree.category === category)
          return tree ? tree.totalXp : 0
        },

        unlockBadge: (badge) => {
          set((state) => ({
            badges: [...state.badges, badge],
          }))
          
          // Add notification for badge unlock
          get().addNotification({
            title: 'Badge Unlocked!',
            message: `You've earned the "${badge.name}" badge!`,
            type: 'BADGE_EARNED',
            read: false,
            data: JSON.stringify({ badgeId: badge.id }),
          })
        },

        updateAchievementProgress: (achievementId, progress) => {
          set((state) => ({
            achievements: state.achievements.map((achievement) => {
              if (achievement.id === achievementId) {
                const completed = progress >= achievement.maxProgress
                const wasCompleted = achievement.completed
                
                // If newly completed, add notification
                if (completed && !wasCompleted) {
                  get().addNotification({
                    title: 'Achievement Unlocked!',
                    message: `You've completed "${achievement.name}"!`,
                    type: 'ACHIEVEMENT_UNLOCKED',
                    read: false,
                    data: JSON.stringify({ achievementId, xpReward: achievement.xpReward }),
                  })
                }
                
                return {
                  ...achievement,
                  progress,
                  completed,
                  unlockedAt: completed && !wasCompleted ? new Date().toISOString() : achievement.unlockedAt,
                }
              }
              return achievement
            }),
          }))
        },

        markNotificationAsRead: (notificationId) => {
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true }
                : notification
            ),
          }))
        },

        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          }
          
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
          }))
        },

        getUnreadNotificationCount: () => {
          return get().notifications.filter((n) => !n.read).length
        },

        fetchSkillTrees: async () => {
          // TODO: Implement GraphQL query
          console.log('Fetching skill trees...')
        },

        fetchBadges: async () => {
          // TODO: Implement GraphQL query
          console.log('Fetching badges...')
        },

        fetchAchievements: async () => {
          // TODO: Implement GraphQL query
          console.log('Fetching achievements...')
        },

        subscribeToNotifications: () => {
          // TODO: Implement GraphQL subscription
          console.log('Subscribing to notifications...')
        },

        unsubscribeFromNotifications: () => {
          // TODO: Implement GraphQL subscription cleanup
          console.log('Unsubscribing from notifications...')
        },
      }),
      {
        name: 'skill-tree-store',
        partialize: (state) => ({
          skillTrees: state.skillTrees,
          badges: state.badges,
          achievements: state.achievements,
          notifications: state.notifications,
        }),
      }
    ),
    { name: 'SkillTreeStore' }
  )
)