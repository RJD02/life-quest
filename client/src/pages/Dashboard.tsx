import type { FC } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  ClockIcon,
  FolderIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import { usePomodoroStore } from '../stores/pomodoroStore'
import { useProjectStore } from '../stores/projectStore'

interface StatCardProps {
  title: string
  value: string | number
  icon: any
  color: 'blue' | 'green' | 'purple' | 'orange'
  trend?: string
}

const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-700 bg-blue-50',
    green: 'bg-green-500 text-green-700 bg-green-50', 
    purple: 'bg-purple-500 text-purple-700 bg-purple-50',
    orange: 'bg-orange-500 text-orange-700 bg-orange-50',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[2]}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[1]}`} />
        </div>
      </div>
    </motion.div>
  )
}

export const Dashboard: FC = () => {
  const { user } = useAuthStore()
  const { getTodaysStats } = usePomodoroStore()
  const { projects, tasks } = useProjectStore()

  const todayStats = getTodaysStats()
  const activeTasks = tasks.filter(task => task.status === 'in-progress').length
  const completedTasks = tasks.filter(task => task.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || 'Adventurer'}! 🚀
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to level up your life today?
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{user?.level || 5}</div>
            <div className="text-sm text-primary-200">Level</div>
            <div className="mt-2">
              <div className="text-2xl font-semibold">{user?.xp || 1250}</div>
              <div className="text-xs text-primary-200">XP</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Focus Sessions Today"
          value={todayStats.totalSessions}
          icon={ClockIcon}
          color="blue"
          trend="+2 from yesterday"
        />
        <StatCard
          title="XP Earned Today"
          value={todayStats.xpEarned}
          icon={StarIcon}
          color="purple"
          trend="+15% this week"
        />
        <StatCard
          title="Active Projects"
          value={projects.length}
          icon={FolderIcon}
          color="green"
        />
        <StatCard
          title="Tasks Completed"
          value={completedTasks}
          icon={TrophyIcon}
          color="orange"
          trend={`${activeTasks} in progress`}
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              🍅 Start Focus Session
            </button>
            <button className="w-full btn-secondary text-left">
              ➕ Add New Task
            </button>
            <button className="w-full btn-secondary text-left">
              📁 Create Project
            </button>
            <button className="w-full btn-secondary text-left">
              🎯 Plan Sprint
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Completed "Set up project structure"
                </p>
                <p className="text-xs text-gray-500">2 hours ago • +25 XP</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Completed 25-min focus session
                </p>
                <p className="text-xs text-gray-500">3 hours ago • +15 XP</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FireIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  5-day streak milestone reached!
                </p>
                <p className="text-xs text-gray-500">Yesterday • +50 XP</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Today's Focus & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Focus</h3>
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task, index) => (
              <div key={task.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">{task.xpValue} XP</p>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No tasks for today. Add some to get started!
              </p>
            )}
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Progress</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              Level {user?.level || 5}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full" 
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {user?.xp || 1250} / 2000 XP to Level {(user?.level || 5) + 1}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              750 XP remaining
            </p>
          </div>
        </motion.div>

        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Streak</h3>
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {user?.streak || 5} Days
            </div>
            <p className="text-sm text-gray-600">
              Keep it up! You're on fire!
            </p>
            <div className="mt-4 flex justify-center space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < (user?.streak || 5) ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}