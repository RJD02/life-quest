import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
// Removed Clerk import - using simple auth instead

// HTTP Link for queries and mutations
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8080/query',
})

// WebSocket Link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_GRAPHQL_WS_ENDPOINT || 'ws://localhost:8080/query',
  })
)

// Split link to route queries/mutations to HTTP and subscriptions to WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

// Auth link to add authentication headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage (simple auth)
  const token = localStorage.getItem('auth-token')
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          skillTrees: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
          badges: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
          achievements: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
        },
      },
      Project: {
        fields: {
          tasks: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
          collaborators: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
        },
      },
      Sprint: {
        fields: {
          tasks: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

// GraphQL Queries and Mutations
export const GET_USER_PROFILE = `
  query GetUserProfile {
    me {
      id
      email
      firstName
      lastName
      avatarUrl
      level
      totalXp
      currentStreak
      maxStreak
      createdAt
      updatedAt
      preferences {
        theme
        notifications {
          email
          push
          sessionReminders
          dailyGoals
          weeklyReports
        }
        pomodoroSettings {
          workDuration
          shortBreakDuration
          longBreakDuration
          sessionsUntilLongBreak
          autoStartBreaks
          autoStartWork
        }
        timezone
      }
      skillTrees {
        id
        name
        category
        totalXp
        level
        skills {
          id
          name
          description
          icon
          requiredXp
          unlocked
          level
          maxLevel
          category
        }
      }
      badges {
        id
        name
        description
        icon
        rarity
        unlockedAt
        criteria
      }
      achievements {
        id
        name
        description
        icon
        progress
        maxProgress
        completed
        xpReward
        unlockedAt
      }
    }
  }
`

export const GET_PROJECTS = `
  query GetProjects {
    projects {
      id
      name
      description
      color
      status
      priority
      startDate
      endDate
      isArchived
      analytics {
        totalTasks
        completedTasks
        overdueTasks
        completionRate
        timeSpent
        xpEarned
      }
      tasks {
        id
        title
        status
        priority
        xpValue
        dueDate
        completedAt
      }
      collaborators {
        id
        role
        user {
          id
          firstName
          lastName
          avatarUrl
        }
      }
    }
  }
`

export const GET_TASKS = `
  query GetTasks($status: TaskStatus, $projectId: ID, $sprintId: ID) {
    tasks(status: $status, projectId: $projectId, sprintId: $sprintId) {
      id
      title
      description
      status
      priority
      xpValue
      estimatedDuration
      actualDuration
      tags
      dueDate
      completedAt
      isArchived
      project {
        id
        name
        color
      }
      sprint {
        id
        name
      }
      pomodoroSessions {
        id
        duration
        completed
        startTime
        endTime
        focusScore
      }
      subtasks {
        id
        title
        completed
      }
      comments {
        id
        content
        user {
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`

export const GET_SPRINTS = `
  query GetSprints($status: SprintStatus) {
    sprints(status: $status) {
      id
      name
      description
      goal
      status
      startDate
      endDate
      velocity
      analytics {
        plannedStoryPoints
        completedStoryPoints
        burndownData {
          date
          remainingPoints
          idealRemaining
        }
        velocityTrend
        completionRate
      }
      tasks {
        id
        storyPoints
        task {
          id
          title
          status
          priority
          xpValue
        }
      }
    }
  }
`

export const GET_USER_ANALYTICS = `
  query GetUserAnalytics($startDate: Time!, $endDate: Time!) {
    userAnalytics(startDate: $startDate, endDate: $endDate) {
      dailyStats {
        date
        tasksCompleted
        xpEarned
        pomodoroSessions
        focusTime
        projectsWorkedOn
      }
      weeklyStats {
        weekStart
        tasksCompleted
        xpEarned
        pomodoroSessions
        focusTime
        averageProductivity
      }
      monthlyStats {
        month
        year
        tasksCompleted
        xpEarned
        pomodoroSessions
        focusTime
        goalsAchieved
      }
      productivity {
        averageTasksPerDay
        peakProductivityHour
        mostProductiveDay
        taskCompletionRate
        averageTaskDuration
      }
      focus {
        averageSessionDuration
        totalFocusTime
        focusStreakDays
        preferredFocusTime
        focusEfficiency
      }
    }
  }
`

export const CREATE_TASK = `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      xpValue
      estimatedDuration
      tags
      dueDate
      skillCategory
      project {
        id
        name
      }
    }
  }
`

export const UPDATE_TASK = `
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      xpValue
      estimatedDuration
      tags
      dueDate
      completedAt
      skillCategory
    }
  }
`

export const TOGGLE_TASK_STATUS = `
  mutation ToggleTaskStatus($id: ID!) {
    toggleTaskStatus(id: $id) {
      id
      status
      completedAt
    }
  }
`

export const START_POMODORO_SESSION = `
  mutation StartPomodoroSession($input: CreatePomodoroSessionInput!) {
    startPomodoroSession(input: $input) {
      id
      duration
      sessionType
      startTime
      task {
        id
        title
      }
    }
  }
`

export const COMPLETE_POMODORO_SESSION = `
  mutation CompletePomodoroSession($id: ID!) {
    completePomodoroSession(id: $id) {
      id
      completed
      endTime
      actualDuration
    }
  }
`

export const CREATE_PROJECT = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      color
      status
      priority
      startDate
      endDate
      folder {
        id
        name
      }
    }
  }
`

export const CREATE_SPRINT = `
  mutation CreateSprint($input: CreateSprintInput!) {
    createSprint(input: $input) {
      id
      name
      description
      goal
      status
      startDate
      endDate
      project {
        id
        name
      }
    }
  }
`

// Subscriptions
export const NOTIFICATION_ADDED = `
  subscription NotificationAdded {
    notificationAdded {
      id
      title
      message
      type
      read
      data
      createdAt
    }
  }
`

export const POMODORO_SESSION_UPDATED = `
  subscription PomodoroSessionUpdated($userId: ID!) {
    pomodoroSessionUpdated(userId: $userId) {
      id
      duration
      completed
      startTime
      endTime
      task {
        id
        title
      }
    }
  }
`

export const TASK_UPDATED = `
  subscription TaskUpdated($projectId: ID!) {
    taskUpdated(projectId: $projectId) {
      id
      title
      status
      priority
      project {
        id
        name
      }
    }
  }
`