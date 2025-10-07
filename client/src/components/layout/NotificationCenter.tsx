import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    X,
    Check,
    Trophy,
    Flame,
    Clock,
    CheckSquare,
    Users,
} from 'lucide-react'
import { useSkillTreeStore } from '../../stores/skillTreeStore'

interface NotificationCenterProps {
  className?: string
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const {
    notifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  } = useSkillTreeStore()
  
  const [isOpen, setIsOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  
  const unreadCount = getUnreadNotificationCount()
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)

  useEffect(() => {
    subscribeToNotifications()
    return () => unsubscribeFromNotifications()
  }, [subscribeToNotifications, unsubscribeFromNotifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ACHIEVEMENT_UNLOCKED':
      case 'BADGE_EARNED':
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'SESSION_REMINDER':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'TASK_DUE':
        return <CheckSquare className="w-5 h-5 text-red-500" />
      case 'SPRINT_COMPLETED':
        return <Flame className="w-5 h-5 text-green-500" />
      case 'COLLABORATION_INVITE':
        return <Users className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'ACHIEVEMENT_UNLOCKED':
      case 'BADGE_EARNED':
        return 'bg-yellow-50 border-yellow-200'
      case 'SESSION_REMINDER':
        return 'bg-blue-50 border-blue-200'
      case 'TASK_DUE':
        return 'bg-red-50 border-red-200'
      case 'SPRINT_COMPLETED':
        return 'bg-green-50 border-green-200'
      case 'COLLABORATION_INVITE':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    markNotificationAsRead(notificationId)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({unreadCount} unread)
                    </span>
                  )}
                </h3>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {displayNotifications.length > 0 ? (
                  <div className="space-y-1 p-2">
                    {displayNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`relative p-3 rounded-lg border transition-colors cursor-pointer ${
                          notification.read 
                            ? 'bg-white border-gray-200 opacity-75' 
                            : getNotificationBgColor(notification.type)
                        }`}
                        onClick={() => handleMarkAsRead(notification.id, {} as React.MouseEvent)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              
                              {!notification.read && (
                                <button
                                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                                  className="ml-2 p-1 text-gray-400 hover:text-green-600 transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            
                            <p className="text-xs text-gray-500 mt-2">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        {!notification.read && (
                          <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      We'll notify you when something important happens
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 5 && (
                <div className="border-t border-gray-200 p-3">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showAll ? 'Show Less' : `View All ${notifications.length} Notifications`}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}