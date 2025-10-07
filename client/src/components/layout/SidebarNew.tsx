import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Target,
    BarChart3,
    Timer,
    Settings,
    ChevronDown,
    ChevronRight,
    Folder,
    FolderOpen,
    Plus,
    MoreHorizontal
} from 'lucide-react'
import { useProjectStore } from '../../stores/projectStore'

interface SidebarProps {
  isCollapsed?: boolean
}

interface FolderItemProps {
  folder: any
  level: number
  isExpanded: boolean
  onToggle: () => void
  onSelect: (folderId: string) => void
  selectedFolder: string | null
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  level,
  isExpanded,
  onToggle,
  onSelect,
  selectedFolder
}) => {
  const { getProjectsByFolder } = useProjectStore()
  const projects = getProjectsByFolder(folder.id)
  const hasProjects = projects.length > 0
  const isSelected = selectedFolder === folder.id

  return (
    <div className="mb-1">
      {/* Folder Item */}
      <div
        className={`flex items-center w-full p-2 rounded-lg cursor-pointer group transition-all ${
          isSelected 
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
            : 'hover:bg-gray-50 text-gray-700'
        }`}
        style={{ paddingLeft: `${12 + level * 20}px` }}
        onClick={() => onSelect(folder.id)}
      >
        {/* Expand/Collapse Toggle */}
        {hasProjects && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className="mr-1 p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        
        {/* Folder Icon */}
        <div className="mr-2">
          {isExpanded && hasProjects ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <div className="text-sm">{folder.icon}</div>
          )}
        </div>
        
        {/* Folder Name */}
        <span className="flex-1 text-sm font-medium truncate">
          {folder.name}
        </span>
        
        {/* Project Count */}
        {hasProjects && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
          }`}>
            {projects.length}
          </span>
        )}
        
        {/* Options Menu */}
        <button className="ml-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all">
          <MoreHorizontal className="w-3 h-3" />
        </button>
      </div>
      
      {/* Projects List */}
      <AnimatePresence>
        {isExpanded && hasProjects && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center p-2 ml-4 rounded-lg cursor-pointer group hover:bg-gray-50 transition-colors"
                style={{ paddingLeft: `${16 + level * 20}px` }}
              >
                <div className="w-2 h-2 rounded-full mr-2 bg-blue-400" />
                <span className="flex-1 text-sm text-gray-600 truncate">
                  {project.name}
                </span>
                <span className="text-xs text-gray-400">
                  {project.taskCount || 0}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const location = useLocation()
  const {
    getRecentlyModifiedFolders,
    selectedFolder,
    setSelectedFolder,
    expandedFolders,
    toggleFolderExpansion
  } = useProjectStore()

  const [showAllFolders, setShowAllFolders] = useState(false)

  const recentFolders = getRecentlyModifiedFolders(5)
  const displayFolders = showAllFolders ? recentFolders : recentFolders.slice(0, 5)

  const mainNavItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-600'
    },
    {
      name: 'Projects',
      icon: Target,
      path: '/projects',
      color: 'text-green-600'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      color: 'text-purple-600'
    },
    {
      name: 'Focus',
      icon: Timer,
      path: '/focus',
      color: 'text-red-600'
    },
    {
      name: 'Sprints',
      icon: Target,
      path: '/sprints',
      color: 'text-orange-600'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      color: 'text-gray-600'
    }
  ]

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 h-full flex flex-col">
        {/* Collapsed Nav Items */}
        <div className="flex-1 py-4">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center w-12 h-12 mx-2 mb-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={item.name}
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Main Navigation */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">LifeQuest</h2>
        
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center w-full p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${item.color}`} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Folders Section */}
      <div className="flex-1 px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Recent Folders
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        {displayFolders.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No folders yet</p>
            <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">
              Create your first folder
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {displayFolders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                level={0}
                isExpanded={expandedFolders.has(folder.id)}
                onToggle={() => toggleFolderExpansion(folder.id)}
                onSelect={setSelectedFolder}
                selectedFolder={selectedFolder}
              />
            ))}
            
            {recentFolders.length > 5 && (
              <button
                onClick={() => setShowAllFolders(!showAllFolders)}
                className="w-full text-left p-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {showAllFolders ? 'Show Less' : `Show ${recentFolders.length - 5} More`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button className="w-full flex items-center p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
          <button className="w-full flex items-center p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Timer className="w-4 h-4 mr-2" />
            Start Focus Session
          </button>
        </div>
      </div>
    </div>
  )
}