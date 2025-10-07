import { gql } from '@apollo/client'

// Project Queries
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      color
      icon
      status
      priority
      startDate
      endDate
      isArchived
      userId
      folderId
      createdAt
      updatedAt
      analytics {
        totalTasks
        completedTasks
        timeSpent
        xpEarned
      }
    }
  }
`

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      color
      icon
      status
      priority
      startDate
      endDate
      isArchived
      userId
      folderId
      createdAt
      updatedAt
      tasks {
        id
        title
        status
        priority
        xpValue
      }
      analytics {
        totalTasks
        completedTasks
        overdueTasks
        averageTaskDuration
        completionRate
        timeSpent
        xpEarned
      }
    }
  }
`

// Project Mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      color
      icon
      status
      priority
      startDate
      endDate
      isArchived
      userId
      folderId
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      color
      icon
      status
      priority
      startDate
      endDate
      isArchived
      userId
      folderId
      createdAt
      updatedAt
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`

// Types for TypeScript
export interface ProjectInput {
  name: string
  description?: string
  color?: string
  icon?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  startDate?: string
  endDate?: string
  folderId?: string
}

export interface UpdateProjectInput extends Partial<ProjectInput> {
  status?: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  isArchived?: boolean
}

export interface ProjectAnalytics {
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  averageTaskDuration: number
  completionRate: number
  timeSpent: number
  xpEarned: number
}

export interface GraphQLProject {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  startDate?: string
  endDate?: string
  isArchived: boolean
  userId: string
  folderId?: string
  createdAt: string
  updatedAt: string
  analytics?: ProjectAnalytics
  tasks?: Array<{
    id: string
    title: string
    status: string
    priority: string
    xpValue: number
  }>
}