import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FolderIcon,
    PlusIcon,
    SearchIcon,
    GridIcon,
    ListIcon,
    MoreVerticalIcon,
    CalendarIcon,
    TrendingUpIcon,
    ClockIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    Edit,
    Trash2,
    Eye,
    Target
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useProjectStore, type Project } from '../stores/projectStore'
import { Modal } from '../components/ui/Modal'
import { ProjectForm } from '../components/forms/ProjectForm'

interface ProjectCardProps {
  project: Project
  viewMode: 'grid' | 'list'
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onView: (project: Project) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  viewMode, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case 'active': return <ClockIcon className="w-4 h-4 text-blue-500" />
      case 'on-hold': return <AlertCircleIcon className="w-4 h-4 text-orange-500" />
      case 'cancelled': return <AlertCircleIcon className="w-4 h-4 text-red-500" />
      default: return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <TrendingUpIcon className={`w-4 h-4 ${getPriorityColor(priority)}`} />
      case 'medium': return <Target className={`w-4 h-4 ${getPriorityColor(priority)}`} />
      case 'low': return <Target className={`w-4 h-4 ${getPriorityColor(priority)}`} />
      default: return <Target className="w-4 h-4 text-gray-500" />
    }
  }

  const progress = project.taskCount > 0 ? (project.completedTaskCount / project.taskCount) * 100 : 0

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onView(project)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2">
              {getStatusIcon(project.status)}
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
            </div>
            <p className="text-gray-600 text-sm flex-1">{project.description}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {getPriorityIcon(project.priority)}
              <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <CheckCircleIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {project.completedTaskCount}/{project.taskCount}
              </span>
            </div>
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVerticalIcon className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onView(project)
                      setShowMenu(false)
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(project)
                      setShowMenu(false)
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(project.id)
                      setShowMenu(false)
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => onView(project)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(project.status)}
          <span className="text-sm font-medium capitalize">{project.status.replace('-', ' ')}</span>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
          >
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onView(project)
                  setShowMenu(false)
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(project)
                  setShowMenu(false)
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(project.id)
                  setShowMenu(false)
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-blue-600 h-2 rounded-full"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <CheckCircleIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {project.completedTaskCount}/{project.taskCount} tasks
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {getPriorityIcon(project.priority)}
            <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>
        
        {project.dueDate && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export const Projects: React.FC = () => {
  const { user } = useAuthStore()
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    setProjects,
    setFolders
  } = useProjectStore()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'status' | 'priority'>('created')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  // Initialize with sample data
  useEffect(() => {
    if (projects.length === 0) {
      // Import sample data
      const sampleFolders = [
        {
          id: 'work',
          name: 'Work',
          description: 'Professional projects and tasks',
          color: '#3B82F6',
          icon: '💼',
          path: ['Work'],
          projectCount: 3,
          isExpanded: false,
          lastModified: new Date(),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        {
          id: 'personal',
          name: 'Personal',
          description: 'Personal projects and life goals',
          color: '#10B981',
          icon: '🏠',
          path: ['Personal'],
          projectCount: 2,
          isExpanded: false,
          lastModified: new Date(Date.now() - 86400000),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date()
        },
        {
          id: 'health',
          name: 'Health & Fitness',
          description: 'Health and wellness tracking',
          color: '#EF4444',
          icon: '💪',
          path: ['Health & Fitness'],
          projectCount: 1,
          isExpanded: false,
          lastModified: new Date(Date.now() - 172800000),
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date()
        }
      ]

      const sampleProjects: Project[] = [
        {
          id: '1',
          name: 'LifeQuest V2 Development',
          description: 'Building the next version with advanced features',
          folderId: 'work',
          status: 'active',
          priority: 'high',
          taskCount: 24,
          completedTaskCount: 16,
          xpEarned: 1250,
          dueDate: new Date('2025-01-15'),
          lastModified: new Date(),
          createdAt: new Date('2024-12-01'),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Personal Health Tracking',
          description: 'Implement comprehensive health and fitness tracking',
          folderId: 'health',
          status: 'active',
          priority: 'medium',
          taskCount: 12,
          completedTaskCount: 2,
          xpEarned: 150,
          dueDate: new Date('2025-02-01'),
          lastModified: new Date(Date.now() - 86400000),
          createdAt: new Date('2024-11-20'),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Marketing Campaign',
          description: 'Launch awareness campaign for LifeQuest',
          folderId: 'work',
          status: 'completed',
          priority: 'high',
          taskCount: 8,
          completedTaskCount: 8,
          xpEarned: 800,
          lastModified: new Date(Date.now() - 172800000),
          createdAt: new Date('2024-10-15'),
          updatedAt: new Date()
        },
        {
          id: '4',
          name: 'Home Organization',
          description: 'Organize and declutter living space',
          folderId: 'personal',
          status: 'active',
          priority: 'low',
          taskCount: 8,
          completedTaskCount: 2,
          xpEarned: 50,
          lastModified: new Date(Date.now() - 259200000),
          createdAt: new Date('2024-12-05'),
          updatedAt: new Date()
        }
      ]
      
      setFolders(sampleFolders)
      setProjects(sampleProjects)
    }
  }, [projects.length, setProjects, setFolders])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'status':
        return a.status.localeCompare(b.status)
      case 'priority':
        const priorityOrder = { low: 0, medium: 1, high: 2 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      default:
        return 0
    }
  })

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    addProject(newProject)
    setShowCreateModal(false)
  }

  const handleEditProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProject) {
      updateProject(selectedProject.id, {
        ...projectData,
        updatedAt: new Date()
      })
      setShowEditModal(false)
      setSelectedProject(null)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
    }
  }

  const handleViewProject = (project: Project) => {
    // For now, just select the project - in a real app, this might navigate to a detailed view
    setSelectedProject(project)
    console.log('Viewing project:', project)
  }

  const handleEditClick = (project: Project) => {
    setSelectedProject(project)
    setShowEditModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your projects and track progress</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created">Sort by Created</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="priority">Sort by Priority</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <AnimatePresence mode="wait">
        {sortedProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first project</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Project
            </button>
          </motion.div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onEdit={handleEditClick}
                onDelete={handleDeleteProject}
                onView={handleViewProject}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        maxWidth="max-w-lg"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedProject(null)
        }}
        title="Edit Project"
        maxWidth="max-w-lg"
      >
        <ProjectForm
          project={selectedProject}
          onSubmit={handleEditProject}
          onCancel={() => {
            setShowEditModal(false)
            setSelectedProject(null)
          }}
        />
      </Modal>
    </div>
  )
}