import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  level: number
  xp: number
  totalXp: number
  streak: number
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<boolean>
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        
        setUser: (user) => set({ user }),
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setIsLoading: (isLoading) => set({ isLoading }),
        
        login: async (email: string, password: string) => {
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // For demo purposes, accept any credentials
            if (email && password) {
              const user: User = {
                id: '1',
                email,
                firstName: 'Demo',
                lastName: 'User',
                level: 5,
                xp: 1250,
                totalXp: 2400,
                streak: 12,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date()
              }
              
              set({ user, isAuthenticated: true })
              return true
            }
            return false
          } catch (error) {
            console.error('Login error:', error)
            return false
          }
        },
        
        register: async (userData) => {
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const user: User = {
              id: Math.random().toString(36).substr(2, 9),
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              level: 1,
              xp: 0,
              totalXp: 0,
              streak: 0,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            set({ user, isAuthenticated: true })
            return true
          } catch (error) {
            console.error('Registration error:', error)
            return false
          }
        },
        
        logout: () => {
          set({ user: null, isAuthenticated: false })
        },
        
        initializeAuth: () => {
          // Check if user is already authenticated from persisted state
          const { user } = get()
          if (user) {
            set({ isAuthenticated: true })
          }
          set({ isLoading: false })
        }
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)