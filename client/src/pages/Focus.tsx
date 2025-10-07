import React from 'react'
import { SessionTracker } from '../components/features/SessionTracker'

export const Focus: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SessionTracker />
      </div>
    </div>
  )
}