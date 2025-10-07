import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Enhanced Folder structure with hierarchy support
export interface Folder {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  parentId?: string // For nested folders
  path: string[] // For breadcrumb navigation
  projectCount: number
  isExpanded?: boolean // For UI state
  lastModified: Date
  createdAt: Date
  updatedAt: Date
}

// Enhanced Project structure
export interface Project {
  id: string
  name: string
  description?: string
  folderId: string
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  startDate?: Date
  taskCount: number
  completedTaskCount: number
  xpEarned: number
  lastModified: Date
  createdAt: Date
  updatedAt: Date
}

// Task Lists (Kanban columns)
export interface TaskList {
  id: string
  name: string
  description?: string
  projectId: string
  position: number // For ordering
  color: string
  isDefault: boolean // Default lists like "To Do", "In Progress", "Done"
  taskCount: number
  createdAt: Date
  updatedAt: Date
}

// Enhanced Task/Ticket structure (JIRA-like)
export interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  listId: string
  
  // JIRA-like attributes
  status: 'todo' | 'in-progress' | 'review' | 'testing' | 'done' | 'blocked'
  priority: 'lowest' | 'low' | 'medium' | 'high' | 'highest'
  type: 'task' | 'story' | 'bug' | 'epic' | 'subtask'
  
  // Time tracking
  originalEstimate?: number // hours
  timeSpent: number // hours
  remainingEstimate?: number // hours
  
  // Dates
  dueDate?: Date
  startDate?: Date
  completedAt?: Date
  
  // Assignment and tracking
  assigneeId?: string
  reporterId: string
  labels: string[]
  storyPoints?: number
  
  // Progress
  xpValue: number
  estimatedPomodoros: number
  actualPomodoros: number
  
  // Metadata
  position: number // For ordering within list
  createdAt: Date
  updatedAt: Date
}

// Task Comments
export interface TaskComment {
  id: string
  taskId: string
  authorId: string
  authorName: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// Activity Log
export interface ActivityLog {
  id: string
  entityType: 'folder' | 'project' | 'list' | 'task'
  entityId: string
  action: 'created' | 'updated' | 'deleted' | 'moved' | 'commented'
  description: string
  userId: string
  metadata?: Record<string, any>
  createdAt: Date
}

interface ProjectState {
  // Data
  folders: Folder[]
  projects: Project[]
  taskLists: TaskList[]
  tasks: Task[]
  taskComments: TaskComment[]
  activityLogs: ActivityLog[]
  
  // UI State
  selectedFolder: string | null
  selectedProject: string | null
  selectedTask: string | null
  expandedFolders: Set<string>
  isLoading: boolean
  
  // Folder operations
  setFolders: (folders: Folder[]) => void
  addFolder: (folder: Folder) => void
  updateFolder: (folderId: string, updates: Partial<Folder>) => void
  deleteFolder: (folderId: string) => void
  toggleFolderExpansion: (folderId: string) => void
  updateFolderLastModified: (folderId: string) => void
  
  // Project operations
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void
  updateProjectLastModified: (projectId: string) => void
  
  // Task List operations
  setTaskLists: (lists: TaskList[]) => void
  addTaskList: (list: TaskList) => void
  updateTaskList: (listId: string, updates: Partial<TaskList>) => void
  deleteTaskList: (listId: string) => void
  reorderTaskLists: (projectId: string, listIds: string[]) => void
  
  // Task operations
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, newListId: string, newPosition: number) => void
  completeTask: (taskId: string) => void
  
  // Comment operations
  addTaskComment: (comment: TaskComment) => void
  updateTaskComment: (commentId: string, content: string) => void
  deleteTaskComment: (commentId: string) => void
  
  // Activity logging
  logActivity: (activity: Omit<ActivityLog, 'id' | 'createdAt'>) => void
  
  // Selection operations
  setSelectedFolder: (folderId: string | null) => void
  setSelectedProject: (projectId: string | null) => void
  setSelectedTask: (taskId: string | null) => void
  setIsLoading: (isLoading: boolean) => void
  
  // Computed getters
  getFolderHierarchy: () => Folder[]
  getRecentlyModifiedFolders: (limit?: number) => Folder[]
  getProjectsByFolder: (folderId: string) => Project[]
  getTaskListsByProject: (projectId: string) => TaskList[]
  getTasksByList: (listId: string) => Task[]
  getTasksByProject: (projectId: string) => Task[]
  getTaskComments: (taskId: string) => TaskComment[]
  getProjectProgress: (projectId: string) => number
  getListProgress: (listId: string) => number
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        folders: [],
        projects: [],
        taskLists: [],
        tasks: [],
        taskComments: [],
        activityLogs: [],
        selectedFolder: null,
        selectedProject: null,
        selectedTask: null,
        expandedFolders: new Set(),
        isLoading: false,

        // Folder operations
        setFolders: (folders) => set({ folders }),
        
        addFolder: (folder) => {
          set((state) => ({ 
            folders: [...state.folders, folder] 
          }))
          get().logActivity({
            entityType: 'folder',
            entityId: folder.id,
            action: 'created',
            description: `Created folder "${folder.name}"`,
            userId: 'current-user' // Replace with actual user ID
          })
        },
        
        updateFolder: (folderId, updates) => {
          set((state) => ({
            folders: state.folders.map((folder) =>
              folder.id === folderId 
                ? { ...folder, ...updates, updatedAt: new Date() }
                : folder
            ),
          }))
          get().logActivity({
            entityType: 'folder',
            entityId: folderId,
            action: 'updated',
            description: `Updated folder`,
            userId: 'current-user'
          })
        },
        
        deleteFolder: (folderId) => {
          set((state) => ({
            folders: state.folders.filter((folder) => folder.id !== folderId),
          }))
          get().logActivity({
            entityType: 'folder',
            entityId: folderId,
            action: 'deleted',
            description: `Deleted folder`,
            userId: 'current-user'
          })
        },

        toggleFolderExpansion: (folderId) => {
          set((state) => {
            const newExpanded = new Set(state.expandedFolders)
            if (newExpanded.has(folderId)) {
              newExpanded.delete(folderId)
            } else {
              newExpanded.add(folderId)
            }
            return { expandedFolders: newExpanded }
          })
        },

        updateFolderLastModified: (folderId) => {
          set((state) => ({
            folders: state.folders.map((folder) =>
              folder.id === folderId 
                ? { ...folder, lastModified: new Date() }
                : folder
            ),
          }))
        },

        // Project operations
        setProjects: (projects) => set({ projects }),
        
        addProject: (project) => {
          set((state) => ({ 
            projects: [...state.projects, project] 
          }))
          get().updateFolderLastModified(project.folderId)
          get().logActivity({
            entityType: 'project',
            entityId: project.id,
            action: 'created',
            description: `Created project "${project.name}"`,
            userId: 'current-user'
          })
        },
        
        updateProject: (projectId, updates) => {
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId 
                ? { ...project, ...updates, updatedAt: new Date(), lastModified: new Date() }
                : project
            ),
          }))
          const project = get().projects.find(p => p.id === projectId)
          if (project) {
            get().updateFolderLastModified(project.folderId)
          }
        },
        
        deleteProject: (projectId) => {
          const project = get().projects.find(p => p.id === projectId)
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== projectId),
          }))
          if (project) {
            get().updateFolderLastModified(project.folderId)
          }
        },

        updateProjectLastModified: (projectId) => {
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId 
                ? { ...project, lastModified: new Date() }
                : project
            ),
          }))
        },

        // Task List operations
        setTaskLists: (lists) => set({ taskLists: lists }),
        
        addTaskList: (list) => {
          set((state) => ({ 
            taskLists: [...state.taskLists, list] 
          }))
          get().updateProjectLastModified(list.projectId)
        },
        
        updateTaskList: (listId, updates) => {
          set((state) => ({
            taskLists: state.taskLists.map((list) =>
              list.id === listId 
                ? { ...list, ...updates, updatedAt: new Date() }
                : list
            ),
          }))
        },
        
        deleteTaskList: (listId) => {
          set((state) => ({
            taskLists: state.taskLists.filter((list) => list.id !== listId),
          }))
        },

        reorderTaskLists: (projectId, listIds) => {
          set((state) => ({
            taskLists: state.taskLists.map((list) => {
              if (list.projectId === projectId) {
                const newPosition = listIds.indexOf(list.id)
                return newPosition >= 0 ? { ...list, position: newPosition } : list
              }
              return list
            }),
          }))
        },

        // Task operations
        setTasks: (tasks) => set({ tasks }),
        
        addTask: (task) => {
          set((state) => ({ 
            tasks: [...state.tasks, task] 
          }))
          get().updateProjectLastModified(task.projectId)
          get().logActivity({
            entityType: 'task',
            entityId: task.id,
            action: 'created',
            description: `Created task "${task.title}"`,
            userId: 'current-user'
          })
        },
        
        updateTask: (taskId, updates) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId 
                ? { ...task, ...updates, updatedAt: new Date() }
                : task
            ),
          }))
          const task = get().tasks.find(t => t.id === taskId)
          if (task) {
            get().updateProjectLastModified(task.projectId)
          }
        },
        
        deleteTask: (taskId) => {
          const task = get().tasks.find(t => t.id === taskId)
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
          }))
          if (task) {
            get().updateProjectLastModified(task.projectId)
          }
        },

        moveTask: (taskId, newListId, newPosition) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId 
                ? { ...task, listId: newListId, position: newPosition, updatedAt: new Date() }
                : task
            ),
          }))
          const task = get().tasks.find(t => t.id === taskId)
          if (task) {
            get().updateProjectLastModified(task.projectId)
            get().logActivity({
              entityType: 'task',
              entityId: taskId,
              action: 'moved',
              description: `Moved task to different list`,
              userId: 'current-user'
            })
          }
        },
        
        completeTask: (taskId) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId
                ? { 
                    ...task, 
                    status: 'done' as const, 
                    completedAt: new Date(),
                    updatedAt: new Date()
                  }
                : task
            ),
          }))
        },

        // Comment operations
        addTaskComment: (comment) => {
          set((state) => ({ 
            taskComments: [...state.taskComments, comment] 
          }))
          const task = get().tasks.find(t => t.id === comment.taskId)
          if (task) {
            get().updateProjectLastModified(task.projectId)
          }
        },

        updateTaskComment: (commentId, content) => {
          set((state) => ({
            taskComments: state.taskComments.map((comment) =>
              comment.id === commentId 
                ? { ...comment, content, updatedAt: new Date() }
                : comment
            ),
          }))
        },

        deleteTaskComment: (commentId) => {
          set((state) => ({
            taskComments: state.taskComments.filter((comment) => comment.id !== commentId),
          }))
        },

        // Activity logging
        logActivity: (activity) => {
          const newActivity: ActivityLog = {
            ...activity,
            id: Date.now().toString(),
            createdAt: new Date()
          }
          set((state) => ({
            activityLogs: [newActivity, ...state.activityLogs].slice(0, 1000) // Keep last 1000 activities
          }))
        },

        // Selection operations
        setSelectedFolder: (selectedFolder) => set({ selectedFolder }),
        setSelectedProject: (selectedProject) => set({ selectedProject }),
        setSelectedTask: (selectedTask) => set({ selectedTask }),
        setIsLoading: (isLoading) => set({ isLoading }),

        // Computed getters
        getFolderHierarchy: () => {
          const { folders } = get()
          // Build folder tree structure
          const rootFolders = folders.filter(f => !f.parentId)
          const buildTree = (parentFolders: Folder[]): Folder[] => {
            return parentFolders.map(folder => ({
              ...folder,
              children: buildTree(folders.filter(f => f.parentId === folder.id))
            }))
          }
          return buildTree(rootFolders)
        },

        getRecentlyModifiedFolders: (limit = 5) => {
          const { folders } = get()
          return folders
            .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
            .slice(0, limit)
        },

        getProjectsByFolder: (folderId) => {
          const { projects } = get()
          return projects.filter((project) => project.folderId === folderId)
        },

        getTaskListsByProject: (projectId) => {
          const { taskLists } = get()
          return taskLists
            .filter((list) => list.projectId === projectId)
            .sort((a, b) => a.position - b.position)
        },

        getTasksByList: (listId) => {
          const { tasks } = get()
          return tasks
            .filter((task) => task.listId === listId)
            .sort((a, b) => a.position - b.position)
        },

        getTasksByProject: (projectId) => {
          const { tasks } = get()
          return tasks.filter((task) => task.projectId === projectId)
        },

        getTaskComments: (taskId) => {
          const { taskComments } = get()
          return taskComments
            .filter((comment) => comment.taskId === taskId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        },

        getProjectProgress: (projectId) => {
          const tasks = get().getTasksByProject(projectId)
          if (tasks.length === 0) return 0
          const completedTasks = tasks.filter(task => task.status === 'done').length
          return (completedTasks / tasks.length) * 100
        },

        getListProgress: (listId) => {
          const tasks = get().getTasksByList(listId)
          if (tasks.length === 0) return 0
          const completedTasks = tasks.filter(task => task.status === 'done').length
          return (completedTasks / tasks.length) * 100
        },
      }),
      {
        name: 'project-store',
        partialize: (state) => ({
          folders: state.folders,
          projects: state.projects,
          taskLists: state.taskLists,
          tasks: state.tasks,
          taskComments: state.taskComments,
          expandedFolders: Array.from(state.expandedFolders), // Convert Set to Array for serialization
        }),
        onRehydrateStorage: () => (state) => {
          if (state?.expandedFolders && Array.isArray(state.expandedFolders)) {
            // Convert Array back to Set after rehydration
            state.expandedFolders = new Set(state.expandedFolders)
          }
        },
      }
    ),
    {
      name: 'project-store',
    }
  )
)