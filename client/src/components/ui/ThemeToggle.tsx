import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useThemeStore, type ThemeMode, themes } from '../../stores/themeStore'

export const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  const themeIcons: Record<ThemeMode, React.ElementType> = {
    light: SunIcon,
    dark: MoonIcon,
    cosmic: SparklesIcon
  }

  const CurrentThemeIcon = themeIcons[currentTheme]

  const handleThemeChange = (theme: ThemeMode) => {
    setTheme(theme)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-colors duration-200"
        style={{ 
          backgroundColor: 'transparent',
          color: 'var(--color-header-foreground)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        title={`Current theme: ${themes[currentTheme].name}`}
      >
        <CurrentThemeIcon className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50"
              style={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div className="p-2">
                <div 
                  className="px-3 py-2 text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  Choose Theme
                </div>
                
                {Object.entries(themes).map(([key, theme]) => {
                  const themeKey = key as ThemeMode
                  const Icon = themeIcons[themeKey]
                  const isSelected = currentTheme === themeKey
                  
                  return (
                    <motion.button
                      key={themeKey}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeChange(themeKey)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors duration-200"
                      style={{ 
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                        color: isSelected ? 'var(--color-primary-foreground)' : 'var(--color-foreground)'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{theme.name}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--color-primary-foreground)' }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
              
              <div 
                className="px-3 py-2 text-xs border-t"
                style={{ 
                  color: 'var(--color-muted-foreground)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Theme changes are saved automatically
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}