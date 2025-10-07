import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    UserIcon,
    BellIcon,
    PaletteIcon,
    ShieldIcon,
    ClockIcon,
    DatabaseIcon,
    HelpCircleIcon,
    LogOutIcon,
    SaveIcon, DownloadIcon,
    TrashIcon
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { usePomodoroStore } from '../stores/pomodoroStore'
import { ThemePicker } from '../components/ui/ThemePicker'

interface SettingsSection {
  id: string
  title: string
  icon: React.ElementType
}

const sections: SettingsSection[] = [
  { id: 'profile', title: 'Profile', icon: UserIcon },
  { id: 'notifications', title: 'Notifications', icon: BellIcon },
  { id: 'appearance', title: 'Appearance', icon: PaletteIcon },
  { id: 'pomodoro', title: 'Focus Settings', icon: ClockIcon },
  { id: 'privacy', title: 'Privacy & Security', icon: ShieldIcon },
  { id: 'data', title: 'Data Management', icon: DatabaseIcon },
  { id: 'help', title: 'Help & Support', icon: HelpCircleIcon },
]

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  bio: string
  timezone: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sessionReminders: boolean
  dailyGoals: boolean
  weeklyReports: boolean
  achievements: boolean
}

interface PomodoroSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartWork: boolean
  soundEnabled: boolean
  volume: number
}

export const Settings: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { updateSettings } = usePomodoroStore()
  const [activeSection, setActiveSection] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: '',
    timezone: 'UTC',
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sessionReminders: true,
    dailyGoals: true,
    weeklyReports: false,
    achievements: true,
  })

  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
    volume: 50,
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement profile update API call
      console.log('Saving profile:', profileData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement notification settings update API call
      console.log('Saving notifications:', notifications)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePomodoro = async () => {
    setIsSaving(true)
    try {
      updateSettings(pomodoroSettings)
      console.log('Saving pomodoro settings:', pomodoroSettings)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Exporting user data...')
  }

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion functionality
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...')
    }
  }

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            rows={3}
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            value={profileData.timezone}
            onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="btn-primary flex items-center space-x-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <SaveIcon className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-sm text-gray-600">
                  {key === 'email' && 'Receive notifications via email'}
                  {key === 'push' && 'Receive push notifications in browser'}
                  {key === 'sessionReminders' && 'Get reminded to start focus sessions'}
                  {key === 'dailyGoals' && 'Daily goal achievement notifications'}
                  {key === 'weeklyReports' && 'Weekly progress summary reports'}
                  {key === 'achievements' && 'Achievement and badge notifications'}
                </div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleSaveNotifications}
          disabled={isSaving}
          className="btn-primary flex items-center space-x-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <SaveIcon className="w-4 h-4" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <ThemePicker />
    </div>
  )

  const renderPomodoroSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timer Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={pomodoroSettings.workDuration}
              onChange={(e) => setPomodoroSettings({ ...pomodoroSettings, workDuration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={pomodoroSettings.shortBreakDuration}
              onChange={(e) => setPomodoroSettings({ ...pomodoroSettings, shortBreakDuration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={pomodoroSettings.longBreakDuration}
              onChange={(e) => setPomodoroSettings({ ...pomodoroSettings, longBreakDuration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sessions Until Long Break
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={pomodoroSettings.sessionsUntilLongBreak}
              onChange={(e) => setPomodoroSettings({ ...pomodoroSettings, sessionsUntilLongBreak: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto-start Breaks</div>
              <div className="text-sm text-gray-600">Automatically start break timer when work session ends</div>
            </div>
            <button
              onClick={() => setPomodoroSettings({ ...pomodoroSettings, autoStartBreaks: !pomodoroSettings.autoStartBreaks })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pomodoroSettings.autoStartBreaks ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pomodoroSettings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto-start Work</div>
              <div className="text-sm text-gray-600">Automatically start work timer when break ends</div>
            </div>
            <button
              onClick={() => setPomodoroSettings({ ...pomodoroSettings, autoStartWork: !pomodoroSettings.autoStartWork })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pomodoroSettings.autoStartWork ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pomodoroSettings.autoStartWork ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Sound Notifications</div>
              <div className="text-sm text-gray-600">Play sound when timer completes</div>
            </div>
            <button
              onClick={() => setPomodoroSettings({ ...pomodoroSettings, soundEnabled: !pomodoroSettings.soundEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pomodoroSettings.soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pomodoroSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {pomodoroSettings.soundEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {pomodoroSettings.volume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={pomodoroSettings.volume}
                onChange={(e) => setPomodoroSettings({ ...pomodoroSettings, volume: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleSavePomodoro}
          disabled={isSaving}
          className="btn-primary flex items-center space-x-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <SaveIcon className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderDataSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Export Data</div>
                <div className="text-sm text-gray-600">Download all your LifeQuest data</div>
              </div>
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-red-900">Delete Account</div>
                <div className="text-sm text-red-600">Permanently delete your account and all data</div>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection()
      case 'notifications':
        return renderNotificationsSection()
      case 'appearance':
        return renderAppearanceSection()
      case 'pomodoro':
        return renderPomodoroSection()
      case 'data':
        return renderDataSection()
      default:
        return <div>Section under development</div>
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Customize your LifeQuest experience
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="space-y-1 p-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.title}</span>
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => logout()}
                  className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOutIcon className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderSection()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}