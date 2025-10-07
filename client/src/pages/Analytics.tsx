import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip, PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts'
import {
    Trophy,
    Flame,
    TrendingUp,
    TrendingDown,
    User,
    CheckSquare
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

interface AnalyticsCardProps {
  title: string
  value: string | number
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ElementType
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTrendIcon = () => {
    if (changeType === 'increase') return TrendingUp
    if (changeType === 'decrease') return TrendingDown
    return null
  }

  const TrendIcon = getTrendIcon()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          {TrendIcon && <TrendIcon className="w-4 h-4" />}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
    </motion.div>
  )
}

interface ProductivityData {
  date: string
  tasks: number
  xp: number
  focusTime: number
}

interface SkillProgressData {
  skill: string
  level: number
  xp: number
  maxXp: number
}

export const Analytics: React.FC = () => {
  const { user } = useAuthStore()
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week')
  const [selectedMetric, setSelectedMetric] = useState<'tasks' | 'xp' | 'focus'>('tasks')

  // Sample data - replace with real API calls
  const [productivityData] = useState<ProductivityData[]>([
    { date: 'Mon', tasks: 8, xp: 120, focusTime: 180 },
    { date: 'Tue', tasks: 12, xp: 200, focusTime: 240 },
    { date: 'Wed', tasks: 6, xp: 90, focusTime: 120 },
    { date: 'Thu', tasks: 15, xp: 250, focusTime: 300 },
    { date: 'Fri', tasks: 10, xp: 180, focusTime: 200 },
    { date: 'Sat', tasks: 4, xp: 60, focusTime: 90 },
    { date: 'Sun', tasks: 7, xp: 100, focusTime: 150 },
  ])

  const [skillProgress] = useState<SkillProgressData[]>([
    { skill: 'Productivity', level: 12, xp: 2400, maxXp: 3000 },
    { skill: 'Health', level: 8, xp: 1600, maxXp: 2000 },
    { skill: 'Learning', level: 15, xp: 3750, maxXp: 4000 },
    { skill: 'Creativity', level: 6, xp: 900, maxXp: 1200 },
    { skill: 'Social', level: 9, xp: 1800, maxXp: 2200 },
  ])

  const categoryData = [
    { name: 'Work', value: 35, color: '#3B82F6' },
    { name: 'Health', value: 25, color: '#10B981' },
    { name: 'Learning', value: 20, color: '#8B5CF6' },
    { name: 'Personal', value: 15, color: '#F59E0B' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ]

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'xp':
        return productivityData.map(d => ({ ...d, value: d.xp }))
      case 'focus':
        return productivityData.map(d => ({ ...d, value: d.focusTime }))
      default:
        return productivityData.map(d => ({ ...d, value: d.tasks }))
    }
  }

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'xp':
        return 'XP Earned'
      case 'focus':
        return 'Focus Time (minutes)'
      default:
        return 'Tasks Completed'
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your progress and understand your productivity patterns
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total XP"
          value={user?.totalXp?.toLocaleString() || '0'}
          change="+12%"
          changeType="increase"
          icon={Trophy}
        />
        <AnalyticsCard
          title="Current Level"
          value={user?.level || 1}
          change="+1 level"
          changeType="increase"
          icon={User}
        />
        <AnalyticsCard
          title="Streak Days"
          value={user?.streak || 0}
          change="+2 days"
          changeType="increase"
          icon={Flame}
        />
        <AnalyticsCard
          title="Tasks This Week"
          value="47"
          change="-5%"
          changeType="decrease"
          icon={CheckSquare}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Productivity Trend</h3>
            <div className="flex items-center space-x-2">
              {(['tasks', 'xp', 'focus'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedMetric === metric
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getMetricData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `Day: ${label}`}
                formatter={(value) => [value, getMetricLabel()]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Categories</h3>
          
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }: any) => `${name} ${value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Skill Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Tree Progress</h3>
        
        <div className="space-y-4">
          {skillProgress.map((skill, index) => {
            const progress = (skill.xp / skill.maxXp) * 100
            
            return (
              <div key={skill.skill} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {skill.skill}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Level {skill.level}</span>
                    <span className="text-sm text-gray-600">
                      {skill.xp} / {skill.maxXp} XP
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Focus Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Focus Sessions</h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="focusTime" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Achievement Progress</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  🏆
                </div>
                <div>
                  <p className="font-medium text-gray-900">Task Master</p>
                  <p className="text-sm text-gray-600">Complete 100 tasks</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">87/100</p>
                <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                  <div className="bg-yellow-500 h-1 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  🔥
                </div>
                <div>
                  <p className="font-medium text-gray-900">Focus Warrior</p>
                  <p className="text-sm text-gray-600">Complete 50 focus sessions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">32/50</p>
                <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                  <div className="bg-green-500 h-1 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  ⭐
                </div>
                <div>
                  <p className="font-medium text-gray-900">XP Collector</p>
                  <p className="text-sm text-gray-600">Earn 10,000 XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">7,234/10,000</p>
                <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}