import { useState } from 'react'
import type { FC, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}