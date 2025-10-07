import React from 'react'
import { motion } from 'framer-motion'
import { CheckIcon } from 'lucide-react'
import { useThemeStore, type ThemeMode, themes } from '../../stores/themeStore'

interface ThemePickerProps {
  className?: string
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ className = '' }) => {
  const { currentTheme, setTheme } = useThemeStore()

  const themePreviewColors: Record<ThemeMode, {
    background: string
    surface: string
    primary: string
    accent: string
  }> = {
    light: {
      background: '#ffffff',
      surface: '#f8fafc',
      primary: '#3b82f6',
      accent: '#f1f5f9'
    },
    dark: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#3b82f6',
      accent: '#334155'
    },
    cosmic: {
      background: '#0c0a1a',
      surface: '#1a1428',
      primary: '#8b5cf6',
      accent: '#2d1b4e'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
        Choose Theme
      </h3>
      <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
        Select your preferred theme for the application
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(themes).map(([key, theme]) => {
          const themeKey = key as ThemeMode
          const isSelected = currentTheme === themeKey
          const colors = themePreviewColors[themeKey]
          
          return (
            <motion.div
              key={themeKey}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
              }}
              onClick={() => setTheme(themeKey)}
            >
              {/* Theme Preview */}
              <div className="p-4">
                <div className="space-y-3">
                  {/* Header Preview */}
                  <div 
                    className="h-8 rounded-md flex items-center px-3"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <div 
                      className="w-12 h-3 rounded"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <div className="flex-1" />
                    <div 
                      className="w-6 h-3 rounded"
                      style={{ backgroundColor: colors.accent }}
                    />
                  </div>
                  
                  {/* Content Preview */}
                  <div className="space-y-2">
                    <div 
                      className="h-4 rounded"
                      style={{ backgroundColor: colors.accent }}
                    />
                    <div 
                      className="h-3 w-3/4 rounded"
                      style={{ backgroundColor: colors.accent }}
                    />
                    <div 
                      className="h-3 w-1/2 rounded"
                      style={{ backgroundColor: colors.accent }}
                    />
                  </div>
                  
                  {/* Cards Preview */}
                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      className="h-12 rounded"
                      style={{ backgroundColor: colors.surface }}
                    />
                    <div 
                      className="h-12 rounded"
                      style={{ backgroundColor: colors.surface }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Theme Info */}
              <div 
                className="border-t px-4 py-3"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.accent
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm" style={{ color: currentTheme === themeKey ? 'var(--color-foreground)' : '#374151' }}>
                      {theme.name}
                    </h4>
                    <p className="text-xs opacity-60" style={{ color: currentTheme === themeKey ? 'var(--color-muted-foreground)' : '#6b7280' }}>
                      {themeKey === 'light' && 'Clean and bright interface'}
                      {themeKey === 'dark' && 'Easy on the eyes'}
                      {themeKey === 'cosmic' && 'Vibrant purple theme'}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center w-6 h-6 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <CheckIcon className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Current Theme Info */}
      <div 
        className="mt-6 p-4 rounded-lg border"
        style={{ 
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--color-foreground)' }}>
              Current Theme: {themes[currentTheme].name}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              Theme changes are applied immediately and saved automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}