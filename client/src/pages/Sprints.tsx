import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CalendarIcon,
    PlayIcon, CheckCircleIcon, TargetIcon,
    UsersIcon, PlusIcon,
    MoreVerticalIcon
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Sprint {
  id: string
  name: string
  goal: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  totalPoints: number
  completedPoints: number
  velocity: number
  tasks: SprintTask[]
  burndownData: BurndownPoint[]
}

interface SprintTask {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'completed'
  points: number
  assignee?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface BurndownPoint {
  date: string
  remaining: number
  ideal: number
}

interface SprintCardProps {
  sprint: Sprint
  onStart: (id: string) => void
  onComplete: (id: string) => void
  onEdit: (sprint: Sprint) => void
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint, onStart, onComplete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false)
  
  const progress = sprint.totalPoints > 0 ? (sprint.completedPoints / sprint.totalPoints) * 100 : 0
  const daysRemaining = Math.ceil((new Date(sprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  
  const getStatusColor = () => {
    switch (sprint.status) {
      case 'planning': return 'bg-gray-100 text-gray-700'
      case 'active': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getActionButton = () => {
    switch (sprint.status) {
      case 'planning':
        return (
          <button
            onClick={() => onStart(sprint.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlayIcon className="w-4 h-4" />
            <span>Start Sprint</span>
          </button>
        )
      case 'active':
        return (
          <button
            onClick={() => onComplete(sprint.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>Complete Sprint</span>
          </button>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{sprint.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
              {sprint.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{sprint.goal}</p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
              >
                <button
                  onClick={() => onEdit(sprint)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit Sprint
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Add Tasks
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Delete Sprint
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">{sprint.completedPoints}</div>
          <div className="text-xs text-gray-600">Completed Points</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">{sprint.totalPoints}</div>
          <div className="text-xs text-gray-600">Total Points</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{sprint.velocity}</div>
          <div className="text-xs text-gray-600">Velocity</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">{daysRemaining}</div>
          <div className="text-xs text-gray-600">Days Left</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-blue-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-1">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <UsersIcon className="w-4 h-4" />
          <span>{sprint.tasks.length} tasks</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => onEdit(sprint)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </button>
        {getActionButton()}
      </div>
    </motion.div>
  )
}

interface BurndownChartProps {
  data: BurndownPoint[]
}

const BurndownChart: React.FC<BurndownChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Burndown Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="remaining" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Actual"
          />
          <Line 
            type="monotone" 
            dataKey="ideal" 
            stroke="#9CA3AF" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Ideal"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const Sprints: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'planning' | 'completed'>('active')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Sample data - replace with real API calls
  const [sprints] = useState<Sprint[]>([
    {
      id: '1',
      name: 'LifeQuest V2 Core Features',
      goal: 'Implement skill trees, analytics, and real-time features',
      status: 'active',
      startDate: '2024-12-01',
      endDate: '2024-12-15',
      totalPoints: 50,
      completedPoints: 32,
      velocity: 25,
      tasks: [
        { id: '1', title: 'Implement GraphQL Schema', status: 'completed', points: 8, priority: 'high' },
        { id: '2', title: 'Build Analytics Dashboard', status: 'in_progress', points: 13, priority: 'high' },
        { id: '3', title: 'Create Skill Tree System', status: 'todo', points: 21, priority: 'medium' },
      ],
      burndownData: [
        { date: '12/01', remaining: 50, ideal: 50 },
        { date: '12/02', remaining: 47, ideal: 46 },
        { date: '12/03', remaining: 42, ideal: 42 },
        { date: '12/04', remaining: 38, ideal: 38 },
        { date: '12/05', remaining: 32, ideal: 34 },
        { date: '12/06', remaining: 28, ideal: 30 },
        { date: '12/07', remaining: 18, ideal: 26 },
      ],
    },
    {
      id: '2',
      name: 'Mobile App Foundation',
      goal: 'Set up React Native infrastructure and basic screens',
      status: 'planning',
      startDate: '2024-12-16',
      endDate: '2024-12-30',
      totalPoints: 34,
      completedPoints: 0,
      velocity: 20,
      tasks: [
        { id: '4', title: 'Setup React Native Project', status: 'todo', points: 5, priority: 'high' },
        { id: '5', title: 'Implement Navigation', status: 'todo', points: 8, priority: 'medium' },
        { id: '6', title: 'Create Core Screens', status: 'todo', points: 13, priority: 'medium' },
        { id: '7', title: 'Setup State Management', status: 'todo', points: 8, priority: 'low' },
      ],
      burndownData: [],
    },
    {
      id: '3',
      name: 'Authentication & Security',
      goal: 'Implement comprehensive user authentication and security measures',
      status: 'completed',
      startDate: '2024-11-15',
      endDate: '2024-11-30',
      totalPoints: 25,
      completedPoints: 25,
      velocity: 30,
      tasks: [
        { id: '8', title: 'Setup Simple Authentication', status: 'completed', points: 8, priority: 'high' },
        { id: '9', title: 'Implement JWT Middleware', status: 'completed', points: 5, priority: 'high' },
        { id: '10', title: 'Add Role-based Access', status: 'completed', points: 8, priority: 'medium' },
        { id: '11', title: 'Security Audit', status: 'completed', points: 4, priority: 'low' },
      ],
      burndownData: [
        { date: '11/15', remaining: 25, ideal: 25 },
        { date: '11/18', remaining: 20, ideal: 20 },
        { date: '11/21', remaining: 15, ideal: 15 },
        { date: '11/24', remaining: 8, ideal: 10 },
        { date: '11/27', remaining: 3, ideal: 5 },
        { date: '11/30', remaining: 0, ideal: 0 },
      ],
    },
  ])

  const filteredSprints = sprints.filter(sprint => sprint.status === activeTab)
  const activeSprint = sprints.find(sprint => sprint.status === 'active')

  const handleStartSprint = (id: string) => {
    console.log('Start sprint:', id)
    // TODO: Implement start sprint functionality
  }

  const handleCompleteSprint = (id: string) => {
    console.log('Complete sprint:', id)
    // TODO: Implement complete sprint functionality
  }

  const handleEditSprint = (sprint: Sprint) => {
    console.log('Edit sprint:', sprint)
    // TODO: Implement edit sprint functionality
  }

  const getTabCounts = () => {
    return {
      active: sprints.filter(s => s.status === 'active').length,
      planning: sprints.filter(s => s.status === 'planning').length,
      completed: sprints.filter(s => s.status === 'completed').length,
    }
  }

  const tabCounts = getTabCounts()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sprints</h1>
          <p className="text-gray-600 mt-1">
            Plan and track your project sprints with velocity-based planning
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Sprint</span>
        </button>
      </motion.div>

      {/* Active Sprint Summary */}
      {activeSprint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Current Sprint</h2>
              <p className="text-blue-100">{activeSprint.name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round((activeSprint.completedPoints / activeSprint.totalPoints) * 100)}%</div>
              <div className="text-blue-100 text-sm">Complete</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{activeSprint.completedPoints}/{activeSprint.totalPoints}</div>
              <div className="text-blue-100 text-sm">Story Points</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{activeSprint.velocity}</div>
              <div className="text-blue-100 text-sm">Velocity</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {Math.ceil((new Date(activeSprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-blue-100 text-sm">Days Left</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200"
      >
        <div className="flex border-b border-gray-200">
          {(['active', 'planning', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="capitalize">{tab}</span>
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {filteredSprints.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSprints.map((sprint, index) => (
                <motion.div
                  key={sprint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <SprintCard
                    sprint={sprint}
                    onStart={handleStartSprint}
                    onComplete={handleCompleteSprint}
                    onEdit={handleEditSprint}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TargetIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} sprints
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'active' && 'No sprints are currently active.'}
                {activeTab === 'planning' && 'No sprints are in planning phase.'}
                {activeTab === 'completed' && 'No sprints have been completed yet.'}
              </p>
              {activeTab === 'planning' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  Create Your First Sprint
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Burndown Chart for Active Sprint */}
      {activeSprint && activeSprint.burndownData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <BurndownChart data={activeSprint.burndownData} />
        </motion.div>
      )}
    </div>
  )
}