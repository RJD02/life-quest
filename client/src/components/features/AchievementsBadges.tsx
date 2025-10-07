import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Trophy,
    Star,
    Target,
    Clock,
    Users,
    Flame,
    Zap, Award,
    Crown,
    Medal,
    Shield,
    Bookmark,
    Search, CheckCircle,
    Lock
} from 'lucide-react'
import { useSkillTreeStore } from '../../stores/skillTreeStore'

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'productivity' | 'collaboration' | 'consistency' | 'mastery' | 'special'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  unlocked: boolean
  unlockedAt?: string
  progress: number
  maxProgress: number
  xpReward: number
  requirements: string[]
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  earned: boolean
  earnedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const achievements: Achievement[] = [
  {
    id: 'first-task',
    name: 'Getting Started',
    description: 'Complete your first task',
    icon: <Target className="w-6 h-6" />,
    category: 'productivity',
    tier: 'bronze',
    unlocked: true,
    unlockedAt: '2024-01-15T10:30:00Z',
    progress: 1,
    maxProgress: 1,
    xpReward: 50,
    requirements: ['Complete 1 task'],
    rarity: 'common'
  },
  {
    id: 'task-master',
    name: 'Task Master',
    description: 'Complete 100 tasks',
    icon: <Trophy className="w-6 h-6" />,
    category: 'productivity',
    tier: 'gold',
    unlocked: false,
    progress: 67,
    maxProgress: 100,
    xpReward: 500,
    requirements: ['Complete 100 tasks'],
    rarity: 'rare'
  },
  {
    id: 'focus-warrior',
    name: 'Focus Warrior',
    description: 'Complete 50 focus sessions',
    icon: <Zap className="w-6 h-6" />,
    category: 'productivity',
    tier: 'silver',
    unlocked: false,
    progress: 32,
    maxProgress: 50,
    xpReward: 300,
    requirements: ['Complete 50 focus sessions'],
    rarity: 'common'
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Collaborate on 10 projects',
    icon: <Users className="w-6 h-6" />,
    category: 'collaboration',
    tier: 'silver',
    unlocked: false,
    progress: 3,
    maxProgress: 10,
    xpReward: 250,
    requirements: ['Join 10 collaborative projects'],
    rarity: 'common'
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Maintain a 30-day streak',
    icon: <Flame className="w-6 h-6" />,
    category: 'consistency',
    tier: 'gold',
    unlocked: false,
    progress: 12,
    maxProgress: 30,
    xpReward: 750,
    requirements: ['Maintain 30-day activity streak'],
    rarity: 'epic'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 10 tasks in under 1 hour',
    icon: <Clock className="w-6 h-6" />,
    category: 'mastery',
    tier: 'platinum',
    unlocked: false,
    progress: 2,
    maxProgress: 10,
    xpReward: 1000,
    requirements: ['Complete 10 tasks in under 1 hour each'],
    rarity: 'legendary'
  }
]

const badges: Badge[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete tasks before 8 AM',
    icon: <Star className="w-5 h-5" />,
    category: 'Time Management',
    earned: true,
    earnedAt: '2024-01-10T07:30:00Z',
    rarity: 'common'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Work productively after 10 PM',
    icon: <Crown className="w-5 h-5" />,
    category: 'Time Management',
    earned: false,
    rarity: 'rare'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 20 tasks without any late submissions',
    icon: <Shield className="w-5 h-5" />,
    category: 'Quality',
    earned: false,
    rarity: 'epic'
  },
  {
    id: 'mentor',
    name: 'Mentor',
    description: 'Help 5 team members complete their goals',
    icon: <Award className="w-5 h-5" />,
    category: 'Leadership',
    earned: true,
    earnedAt: '2024-01-20T14:15:00Z',
    rarity: 'rare'
  }
]

export const AchievementsBadges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>('achievements')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Achievement | Badge | null>(null)

  const { addXp } = useSkillTreeStore()

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'text-orange-600',
      silver: 'text-gray-500',
      gold: 'text-yellow-500',
      platinum: 'text-purple-500',
      diamond: 'text-blue-500'
    }
    return colors[tier as keyof typeof colors] || 'text-gray-500'
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    }
    return colors[rarity as keyof typeof colors] || 'border-gray-300 bg-gray-50'
  }

  const getRarityBadge = (rarity: string) => {
    const styles = {
      common: 'bg-gray-100 text-gray-700',
      rare: 'bg-blue-100 text-blue-700',
      epic: 'bg-purple-100 text-purple-700',
      legendary: 'bg-yellow-100 text-yellow-700'
    }
    return styles[rarity as keyof typeof styles] || 'bg-gray-100 text-gray-700'
  }

  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory
      const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesUnlocked = !showOnlyUnlocked || achievement.unlocked
      
      return matchesCategory && matchesSearch && matchesUnlocked
    })
  }, [selectedCategory, searchQuery, showOnlyUnlocked])

  const filteredBadges = useMemo(() => {
    return badges.filter(badge => {
      const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory
      const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           badge.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesUnlocked = !showOnlyUnlocked || badge.earned
      
      return matchesCategory && matchesSearch && matchesUnlocked
    })
  }, [selectedCategory, searchQuery, showOnlyUnlocked])

  const getCategories = () => {
    if (activeTab === 'achievements') {
      return ['all', ...new Set(achievements.map(a => a.category))]
    }
    return ['all', ...new Set(badges.map(b => b.category))]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedItem(achievement)}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
        ${achievement.unlocked 
          ? `${getRarityColor(achievement.rarity)} shadow-lg hover:shadow-xl`
          : 'border-gray-200 bg-gray-50 opacity-75'
        }
      `}
    >
      {/* Rarity Badge */}
      <div className={`
        absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium
        ${getRarityBadge(achievement.rarity)}
      `}>
        {achievement.rarity}
      </div>

      {/* Lock icon for locked achievements */}
      {!achievement.unlocked && (
        <div className="absolute top-2 left-2">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}

      {/* Icon and Tier */}
      <div className="flex items-center space-x-3 mb-3">
        <div className={`
          p-3 rounded-lg flex items-center justify-center
          ${achievement.unlocked 
            ? getRarityColor(achievement.rarity)
            : 'bg-gray-200'
          }
        `}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className={`text-lg font-bold ${getTierColor(achievement.tier)}`}>
            {achievement.tier.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Achievement Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
        <p className="text-sm text-gray-600">{achievement.description}</p>
        
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{achievement.progress}/{achievement.maxProgress}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`
                h-2 rounded-full
                ${achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'}
              `}
            />
          </div>
        </div>

        {/* XP Reward */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">XP Reward</span>
          <span className="text-sm font-semibold text-yellow-600">
            +{achievement.xpReward} XP
          </span>
        </div>

        {/* Unlock Date */}
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>Unlocked {formatDate(achievement.unlockedAt)}</span>
          </div>
        )}
      </div>
    </motion.div>
  )

  const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedItem(badge)}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
        ${badge.earned 
          ? `${getRarityColor(badge.rarity)} shadow-lg hover:shadow-xl`
          : 'border-gray-200 bg-gray-50 opacity-75'
        }
      `}
    >
      {/* Rarity Badge */}
      <div className={`
        absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium
        ${getRarityBadge(badge.rarity)}
      `}>
        {badge.rarity}
      </div>

      {/* Lock icon for unearned badges */}
      {!badge.earned && (
        <div className="absolute top-2 left-2">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}

      {/* Icon */}
      <div className={`
        mb-3 flex items-center justify-center w-16 h-16 rounded-full mx-auto
        ${badge.earned 
          ? getRarityColor(badge.rarity)
          : 'bg-gray-200'
        }
      `}>
        {badge.icon}
      </div>

      {/* Badge Info */}
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-gray-900">{badge.name}</h3>
        <p className="text-sm text-gray-600">{badge.description}</p>
        <p className="text-xs text-gray-500">{badge.category}</p>
        
        {/* Earned Date */}
        {badge.earned && badge.earnedAt && (
          <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
            <Medal className="w-3 h-3" />
            <span>Earned {formatDate(badge.earnedAt)}</span>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Achievements & Badges
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your progress and celebrate your accomplishments. Unlock achievements and earn badges as you master your productivity journey.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`
              px-6 py-2 rounded-md font-medium transition-all duration-200
              ${activeTab === 'achievements'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`
              px-6 py-2 rounded-md font-medium transition-all duration-200
              ${activeTab === 'badges'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Medal className="w-4 h-4 inline mr-2" />
            Badges
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getCategories().map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyUnlocked}
              onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {activeTab === 'achievements' ? 'Unlocked only' : 'Earned only'}
            </span>
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'achievements' 
          ? filteredAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))
          : filteredBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))
        }
      </div>

      {/* Empty State */}
      {((activeTab === 'achievements' && filteredAchievements.length === 0) ||
        (activeTab === 'badges' && filteredBadges.length === 0)) && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className={`
                  inline-flex items-center justify-center w-20 h-20 rounded-full mb-4
                  ${('unlocked' in selectedItem ? selectedItem.unlocked : selectedItem.earned)
                    ? getRarityColor(selectedItem.rarity)
                    : 'bg-gray-200'
                  }
                `}>
                  {selectedItem.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedItem.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedItem.description}
                </p>
                
                {/* Rarity */}
                <div className={`
                  inline-block px-3 py-1 rounded-full text-sm font-medium mb-4
                  ${getRarityBadge(selectedItem.rarity)}
                `}>
                  {selectedItem.rarity.toUpperCase()} {activeTab === 'achievements' ? 'ACHIEVEMENT' : 'BADGE'}
                </div>
              </div>

              {/* Achievement specific details */}
              {'progress' in selectedItem && (
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                      <span>Progress</span>
                      <span>{selectedItem.progress}/{selectedItem.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`
                          h-3 rounded-full
                          ${selectedItem.unlocked ? 'bg-green-500' : 'bg-blue-500'}
                        `}
                        style={{ width: `${(selectedItem.progress / selectedItem.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-yellow-800">
                        XP Reward: {selectedItem.xpReward}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {selectedItem.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <Bookmark className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Date info */}
              {(('unlocked' in selectedItem && selectedItem.unlocked && selectedItem.unlockedAt) ||
                ('earned' in selectedItem && selectedItem.earned && selectedItem.earnedAt)) && (
                <div className="bg-green-50 p-3 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      {'unlocked' in selectedItem ? 'Unlocked' : 'Earned'} on{' '}
                      {formatDate(
                        ('unlocked' in selectedItem ? selectedItem.unlockedAt : selectedItem.earnedAt) || ''
                      )}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}