import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'cosmic'

export interface Theme {
  name: string
  mode: ThemeMode
  colors: {
    // Background colors
    background: string
    surface: string
    card: string
    popover: string
    
    // Text colors
    foreground: string
    muted: string
    'muted-foreground': string
    
    // UI element colors
    border: string
    input: string
    ring: string
    
    // Brand colors
    primary: string
    'primary-foreground': string
    secondary: string
    'secondary-foreground': string
    
    // Status colors
    destructive: string
    'destructive-foreground': string
    success: string
    'success-foreground': string
    warning: string
    'warning-foreground': string
    
    // Accent colors
    accent: string
    'accent-foreground': string
    
    // Sidebar specific
    sidebar: string
    'sidebar-foreground': string
    'sidebar-border': string
    
    // Header specific
    header: string
    'header-foreground': string
    'header-border': string
  }
  gradients: {
    primary: string
    hero: string
    card: string
    sidebar: string
  }
}

export const themes: Record<ThemeMode, Theme> = {
  light: {
    name: 'Light',
    mode: 'light',
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      card: '#ffffff',
      popover: '#ffffff',
      
      foreground: '#0f172a',
      muted: '#f1f5f9',
      'muted-foreground': '#64748b',
      
      border: '#e2e8f0',
      input: '#f1f5f9',
      ring: '#3b82f6',
      
      primary: '#3b82f6',
      'primary-foreground': '#ffffff',
      secondary: '#f1f5f9',
      'secondary-foreground': '#0f172a',
      
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      success: '#10b981',
      'success-foreground': '#ffffff',
      warning: '#f59e0b',
      'warning-foreground': '#ffffff',
      
      accent: '#f1f5f9',
      'accent-foreground': '#0f172a',
      
      sidebar: '#ffffff',
      'sidebar-foreground': '#0f172a',
      'sidebar-border': '#e2e8f0',
      
      header: '#ffffff',
      'header-foreground': '#0f172a',
      'header-border': '#e2e8f0',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      sidebar: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    }
  },
  
  dark: {
    name: 'Dark',
    mode: 'dark',
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      card: '#1e293b',
      popover: '#1e293b',
      
      foreground: '#f8fafc',
      muted: '#334155',
      'muted-foreground': '#94a3b8',
      
      border: '#334155',
      input: '#1e293b',
      ring: '#3b82f6',
      
      primary: '#3b82f6',
      'primary-foreground': '#ffffff',
      secondary: '#334155',
      'secondary-foreground': '#f8fafc',
      
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      success: '#10b981',
      'success-foreground': '#ffffff',
      warning: '#f59e0b',
      'warning-foreground': '#ffffff',
      
      accent: '#334155',
      'accent-foreground': '#f8fafc',
      
      sidebar: '#1e293b',
      'sidebar-foreground': '#f8fafc',
      'sidebar-border': '#334155',
      
      header: '#1e293b',
      'header-foreground': '#f8fafc',
      'header-border': '#334155',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      sidebar: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    }
  },
  
  cosmic: {
    name: 'Cosmic',
    mode: 'cosmic',
    colors: {
      background: '#0c0a1a',
      surface: '#1a1428',
      card: '#1a1428',
      popover: '#1a1428',
      
      foreground: '#f0f9ff',
      muted: '#2d1b4e',
      'muted-foreground': '#a78bfa',
      
      border: '#4c1d95',
      input: '#1a1428',
      ring: '#8b5cf6',
      
      primary: '#8b5cf6',
      'primary-foreground': '#ffffff',
      secondary: '#2d1b4e',
      'secondary-foreground': '#f0f9ff',
      
      destructive: '#f472b6',
      'destructive-foreground': '#ffffff',
      success: '#34d399',
      'success-foreground': '#ffffff',
      warning: '#fbbf24',
      'warning-foreground': '#ffffff',
      
      accent: '#2d1b4e',
      'accent-foreground': '#f0f9ff',
      
      sidebar: '#1a1428',
      'sidebar-foreground': '#f0f9ff',
      'sidebar-border': '#4c1d95',
      
      header: '#1a1428',
      'header-foreground': '#f0f9ff',
      'header-border': '#4c1d95',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(135deg, #1a1428 0%, #2d1b4e 100%)',
      sidebar: 'linear-gradient(180deg, #1a1428 0%, #0c0a1a 100%)',
    }
  }
}

interface ThemeState {
  currentTheme: ThemeMode
  theme: Theme
  setTheme: (theme: ThemeMode) => void
  applyThemeToDocument: () => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        currentTheme: 'light',
        theme: themes.light,
        
        setTheme: (themeMode: ThemeMode) => {
          const theme = themes[themeMode]
          set({ currentTheme: themeMode, theme })
          
          // Apply theme to document
          const { applyThemeToDocument } = get()
          applyThemeToDocument()
        },
        
        applyThemeToDocument: () => {
          const { theme } = get()
          const root = document.documentElement
          
          // Set CSS custom properties
          Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value)
          })
          
          Object.entries(theme.gradients).forEach(([key, value]) => {
            root.style.setProperty(`--gradient-${key}`, value)
          })
          
          // Set data attribute for theme-specific styling
          root.setAttribute('data-theme', theme.mode)
          
          // Update document class for dark mode detection
          if (theme.mode === 'dark' || theme.mode === 'cosmic') {
            root.classList.add('dark')
          } else {
            root.classList.remove('dark')
          }
        }
      }),
      {
        name: 'lifequest-theme',
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Apply theme on app load
            setTimeout(() => state.applyThemeToDocument(), 0)
          }
        }
      }
    ),
    { name: 'theme-store' }
  )
)