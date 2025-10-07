import { apolloClient } from '../lib/apollo'
import {
    GET_PROJECTS,
    GET_PROJECT,
    CREATE_PROJECT,
    UPDATE_PROJECT,
    DELETE_PROJECT,
    type ProjectInput,
    type UpdateProjectInput,
    type GraphQLProject
} from '../lib/graphql/projects'
import type { Project } from '../stores/projectStore'

class ProjectService {
  // Convert GraphQL project to local project format
  private mapGraphQLToLocal(gqlProject: GraphQLProject): Project {
    return {
      id: gqlProject.id,
      name: gqlProject.name,
      description: gqlProject.description,
      folderId: gqlProject.folderId || 'default',
      status: this.mapGraphQLStatus(gqlProject.status),
      priority: this.mapGraphQLPriority(gqlProject.priority),
      taskCount: gqlProject.analytics?.totalTasks || 0,
      completedTaskCount: gqlProject.analytics?.completedTasks || 0,
      xpEarned: gqlProject.analytics?.xpEarned || 0,
      dueDate: gqlProject.endDate ? new Date(gqlProject.endDate) : undefined,
      createdAt: new Date(gqlProject.createdAt),
      updatedAt: new Date(gqlProject.updatedAt)
    }
  }

  // Convert local project format to GraphQL input
  private mapLocalToGraphQL(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): ProjectInput {
    return {
      name: project.name,
      description: project.description,
      priority: this.mapLocalPriority(project.priority),
      startDate: new Date().toISOString(),
      endDate: project.dueDate?.toISOString(),
      folderId: project.folderId
    }
  }

  private mapGraphQLStatus(status: string): Project['status'] {
    switch (status) {
      case 'PLANNING': return 'active'
      case 'IN_PROGRESS': return 'active'
      case 'ON_HOLD': return 'on-hold'
      case 'COMPLETED': return 'completed'
      case 'CANCELLED': return 'cancelled'
      default: return 'active'
    }
  }

  private mapLocalStatus(status: Project['status']): string {
    switch (status) {
      case 'active': return 'IN_PROGRESS'
      case 'on-hold': return 'ON_HOLD'
      case 'completed': return 'COMPLETED'
      case 'cancelled': return 'CANCELLED'
      default: return 'IN_PROGRESS'
    }
  }

  private mapGraphQLPriority(priority: string): Project['priority'] {
    switch (priority) {
      case 'LOW': return 'low'
      case 'MEDIUM': return 'medium'
      case 'HIGH': return 'high'
      default: return 'medium'
    }
  }

  private mapLocalPriority(priority: Project['priority']): 'LOW' | 'MEDIUM' | 'HIGH' {
    switch (priority) {
      case 'low': return 'LOW'
      case 'medium': return 'MEDIUM'
      case 'high': return 'HIGH'
      default: return 'MEDIUM'
    }
  }

  // Fetch all projects
  async fetchProjects(): Promise<Project[]> {
    try {
      const { data } = await apolloClient.query({
        query: GET_PROJECTS,
        fetchPolicy: 'cache-first'
      })

      return data.projects.map((project: GraphQLProject) => this.mapGraphQLToLocal(project))
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Return empty array on error - the UI will use local data
      return []
    }
  }

  // Fetch single project
  async fetchProject(id: string): Promise<Project | null> {
    try {
      const { data } = await apolloClient.query({
        query: GET_PROJECT,
        variables: { id },
        fetchPolicy: 'cache-first'
      })

      return data.project ? this.mapGraphQLToLocal(data.project) : null
    } catch (error) {
      console.error('Error fetching project:', error)
      return null
    }
  }

  // Create new project
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
    try {
      const input = this.mapLocalToGraphQL(projectData)
      
      const { data } = await apolloClient.mutate({
        mutation: CREATE_PROJECT,
        variables: { input },
        // Update cache after successful creation
        refetchQueries: [{ query: GET_PROJECTS }]
      })

      return data.createProject ? this.mapGraphQLToLocal(data.createProject) : null
    } catch (error) {
      console.error('Error creating project:', error)
      // Return a local project with generated ID for offline functionality
      return {
        ...projectData,
        id: `local_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  }

  // Update existing project
  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project | null> {
    try {
      const input: UpdateProjectInput = {
        name: updates.name,
        description: updates.description,
        priority: updates.priority ? this.mapLocalPriority(updates.priority) : undefined,
        status: updates.status ? this.mapLocalStatus(updates.status) : undefined,
        endDate: updates.dueDate?.toISOString()
      }

      const { data } = await apolloClient.mutate({
        mutation: UPDATE_PROJECT,
        variables: { id, input },
        refetchQueries: [{ query: GET_PROJECTS }, { query: GET_PROJECT, variables: { id } }]
      })

      return data.updateProject ? this.mapGraphQLToLocal(data.updateProject) : null
    } catch (error) {
      console.error('Error updating project:', error)
      return null
    }
  }

  // Delete project
  async deleteProject(id: string): Promise<boolean> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_PROJECT,
        variables: { id },
        refetchQueries: [{ query: GET_PROJECTS }]
      })

      return data.deleteProject || false
    } catch (error) {
      console.error('Error deleting project:', error)
      return false
    }
  }

  // Sync local projects with server (useful for offline-first functionality)
  async syncProjects(localProjects: Project[]): Promise<Project[]> {
    try {
      const serverProjects = await this.fetchProjects()
      
      // Merge local and server projects, preferring server data for existing projects
      const mergedProjects = [...serverProjects]
      
      localProjects.forEach(localProject => {
        if (!serverProjects.find(sp => sp.id === localProject.id)) {
          mergedProjects.push(localProject)
        }
      })

      return mergedProjects
    } catch (error) {
      console.error('Error syncing projects:', error)
      return localProjects // Return local data on error
    }
  }
}

export const projectService = new ProjectService()