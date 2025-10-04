import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Folder {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  projectCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  folderId: string
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  taskCount: number
  completedTaskCount: number
  xpEarned: number
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  xpValue: number
  estimatedPomodoros: number
  actualPomodoros: number
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface ProjectState {
  folders: Folder[]
  projects: Project[]
  tasks: Task[]
  selectedFolder: string | null
  selectedProject: string | null
  isLoading: boolean

  // Actions
  setFolders: (folders: Folder[]) => void
  setProjects: (projects: Project[]) => void
  setTasks: (tasks: Task[]) => void
  setSelectedFolder: (folderId: string | null) => void
  setSelectedProject: (projectId: string | null) => void
  setIsLoading: (isLoading: boolean) => void

  // CRUD operations
  addFolder: (folder: Folder) => void
  updateFolder: (folderId: string, updates: Partial<Folder>) => void
  deleteFolder: (folderId: string) => void

  addProject: (project: Project) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void

  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  completeTask: (taskId: string) => void

  // Computed values
  getProjectsByFolder: (folderId: string) => Project[]
  getTasksByProject: (projectId: string) => Task[]
  getTasksInSprint: () => Task[]
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      folders: [],
      projects: [],
      tasks: [],
      selectedFolder: null,
      selectedProject: null,
      isLoading: false,

      setFolders: (folders) => set({ folders }),
      setProjects: (projects) => set({ projects }),
      setTasks: (tasks) => set({ tasks }),
      setSelectedFolder: (selectedFolder) => set({ selectedFolder }),
      setSelectedProject: (selectedProject) => set({ selectedProject }),
      setIsLoading: (isLoading) => set({ isLoading }),

      addFolder: (folder) =>
        set((state) => ({ folders: [...state.folders, folder] })),
      updateFolder: (folderId, updates) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId ? { ...folder, ...updates } : folder
          ),
        })),
      deleteFolder: (folderId) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== folderId),
        })),

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (projectId, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId ? { ...project, ...updates } : project
          ),
        })),
      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter(
            (project) => project.id !== projectId
          ),
        })),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
      completeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: 'completed' as const, completedAt: new Date() }
              : task
          ),
        })),

      getProjectsByFolder: (folderId) => {
        const { projects } = get()
        return projects.filter((project) => project.folderId === folderId)
      },
      getTasksByProject: (projectId) => {
        const { tasks } = get()
        return tasks.filter((task) => task.projectId === projectId)
      },
      getTasksInSprint: () => {
        const { tasks } = get()
        // This would be filtered by sprint criteria - for now returning all in-progress tasks
        return tasks.filter((task) => task.status === 'in-progress')
      },
    }),
    {
      name: 'project-store',
    }
  )
)