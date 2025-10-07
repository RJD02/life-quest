import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Trophy,
    Star,
    Target,
    Zap,
    Brain,
    Clock,
    Users,
    Code,
    BookOpen,
    Activity,
    Lock,
} from 'lucide-react'
import { useSkillTreeStore } from '../../stores/skillTreeStore'

interface SkillNode {
  id: string
  name: string
  category: string
  level: number
  maxLevel: number
  xpRequired: number
  currentXp: number
  icon: React.ReactNode
  description: string
  unlocked: boolean
  prerequisites: string[]
  benefits: string[]
}

const skillCategories = {
  productivity: {
    name: 'Productivity',
    icon: <Target className="w-6 h-6" />,
    color: 'blue',
    skills: [
      {
        id: 'focus-master',
        name: 'Focus Master',
        level: 3,
        maxLevel: 5,
        xpRequired: 1000,
        currentXp: 750,
        icon: <Brain className="w-8 h-8" />,
        description: 'Increase your focus session duration and effectiveness',
        unlocked: true,
        prerequisites: [],
        benefits: ['Longer focus sessions', 'Better concentration', '+25% XP from focus tasks']
      },
      {
        id: 'time-warrior',
        name: 'Time Warrior',
        level: 2,
        maxLevel: 5,
        xpRequired: 800,
        currentXp: 320,
        icon: <Clock className="w-8 h-8" />,
        description: 'Master time management and scheduling',
        unlocked: true,
        prerequisites: [],
        benefits: ['Better time estimates', 'Deadline reminders', 'Time blocking features']
      },
      {
        id: 'task-ninja',
        name: 'Task Ninja',
        level: 4,
        maxLevel: 5,
        xpRequired: 1200,
        currentXp: 950,
        icon: <Zap className="w-8 h-8" />,
        description: 'Complete tasks faster and more efficiently',
        unlocked: true,
        prerequisites: ['focus-master'],
        benefits: ['Quick task creation', 'Smart prioritization', 'Batch processing']
      }
    ]
  },
  collaboration: {
    name: 'Collaboration',
    icon: <Users className="w-6 h-6" />,
    color: 'green',
    skills: [
      {
        id: 'team-leader',
        name: 'Team Leader',
        level: 1,
        maxLevel: 5,
        xpRequired: 600,
        currentXp: 150,
        icon: <Users className="w-8 h-8" />,
        description: 'Lead and coordinate team projects effectively',
        unlocked: true,
        prerequisites: [],
        benefits: ['Team invitation system', 'Progress tracking', 'Role assignments']
      },
      {
        id: 'mentor',
        name: 'Mentor',
        level: 0,
        maxLevel: 5,
        xpRequired: 1000,
        currentXp: 0,
        icon: <BookOpen className="w-8 h-8" />,
        description: 'Help and guide other users in their journey',
        unlocked: false,
        prerequisites: ['team-leader'],
        benefits: ['Mentoring features', 'Knowledge sharing', 'Community recognition']
      }
    ]
  },
  development: {
    name: 'Development',
    icon: <Code className="w-6 h-6" />,
    color: 'purple',
    skills: [
      {
        id: 'code-master',
        name: 'Code Master',
        level: 2,
        maxLevel: 5,
        xpRequired: 1500,
        currentXp: 600,
        icon: <Code className="w-8 h-8" />,
        description: 'Excel in programming and development tasks',
        unlocked: true,
        prerequisites: [],
        benefits: ['Code tracking', 'Language-specific goals', 'GitHub integration']
      },
      {
        id: 'architect',
        name: 'Architect',
        level: 0,
        maxLevel: 5,
        xpRequired: 2000,
        currentXp: 0,
        icon: <Activity className="w-8 h-8" />,
        description: 'Design and structure complex systems',
        unlocked: false,
        prerequisites: ['code-master'],
        benefits: ['System design tools', 'Architecture templates', 'Best practices']
      }
    ]
  }
}

export const SkillTreeVisualization: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const { getXpByCategory, addXp } = useSkillTreeStore()

  const getSkillProgress = (skill: any) => {
    return (skill.currentXp / skill.xpRequired) * 100
  }

  const getSkillColor = (category: string, unlocked: boolean) => {
    if (!unlocked) return 'gray'
    const colors = {
      productivity: 'blue',
      collaboration: 'green',
      development: 'purple'
    }
    return colors[category as keyof typeof colors] || 'gray'
  }

  const SkillNodeComponent: React.FC<{ skill: any; category: string }> = ({ skill, category }) => {
    const color = getSkillColor(category, skill.unlocked)
    const progress = getSkillProgress(skill)

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSelectedSkill({ ...skill, category })}
        className={`
          relative p-4 rounded-xl cursor-pointer transition-all duration-300
          ${skill.unlocked 
            ? `bg-${color}-50 border-${color}-200 shadow-lg hover:shadow-xl`
            : 'bg-gray-100 border-gray-300 opacity-75'
          }
          border-2
        `}
      >
        {/* Lock icon for locked skills */}
        {!skill.unlocked && (
          <div className="absolute top-2 right-2">
            <Lock className="w-4 h-4 text-gray-500" />
          </div>
        )}

        {/* Skill Icon */}
        <div className={`
          mb-3 flex items-center justify-center w-16 h-16 rounded-full mx-auto
          ${skill.unlocked 
            ? `bg-${color}-100 text-${color}-600`
            : 'bg-gray-200 text-gray-500'
          }
        `}>
          {skill.icon}
        </div>

        {/* Skill Name */}
        <h3 className="text-sm font-semibold text-center mb-2">
          {skill.name}
        </h3>

        {/* Level */}
        <div className="text-center mb-3">
          <span className={`
            text-xs px-2 py-1 rounded-full
            ${skill.unlocked 
              ? `bg-${color}-200 text-${color}-800`
              : 'bg-gray-200 text-gray-600'
            }
          `}>
            Level {skill.level}/{skill.maxLevel}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`
              h-2 rounded-full transition-all duration-500
              ${skill.unlocked 
                ? `bg-${color}-500`
                : 'bg-gray-400'
              }
            `}
          />
        </div>

        {/* XP Progress */}
        <p className="text-xs text-center text-gray-600">
          {skill.currentXp}/{skill.xpRequired} XP
        </p>

        {/* Stars for level */}
        <div className="flex justify-center mt-2 space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < skill.level
                  ? `text-${color}-500 fill-current`
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Skill Tree
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Level up your skills by completing tasks and achieving goals. 
          Each skill unlocks new features and abilities to enhance your productivity.
        </p>
      </div>

      {/* Skill Categories */}
      <div className="space-y-12">
        {Object.entries(skillCategories).map(([categoryKey, category]) => {
          const categoryXp = getXpByCategory(categoryKey)
          
          return (
            <div key={categoryKey} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center space-x-4">
                <div className={`
                  p-3 rounded-lg
                  bg-${category.color}-100 text-${category.color}-600
                `}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Total XP: {categoryXp.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.skills.map((skill) => (
                  <SkillNodeComponent
                    key={skill.id}
                    skill={skill}
                    category={categoryKey}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSkill(null)}
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
                bg-${getSkillColor(selectedSkill.category, selectedSkill.unlocked)}-100
                text-${getSkillColor(selectedSkill.category, selectedSkill.unlocked)}-600
              `}>
                {selectedSkill.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedSkill.name}
              </h3>
              <p className="text-gray-600">
                {selectedSkill.description}
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Level {selectedSkill.level}/{selectedSkill.maxLevel}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedSkill.currentXp}/{selectedSkill.xpRequired} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`
                    h-3 rounded-full bg-${getSkillColor(selectedSkill.category, selectedSkill.unlocked)}-500
                  `}
                  style={{ width: `${getSkillProgress(selectedSkill)}%` }}
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Benefits
              </h4>
              <ul className="space-y-2">
                {selectedSkill.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            {selectedSkill.prerequisites.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Prerequisites
                </h4>
                <ul className="space-y-1">
                  {selectedSkill.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedSkill(null)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}