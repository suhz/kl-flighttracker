'use client'

import { useState, useEffect } from 'react'

interface LastUpdatedProps {
  className?: string
}

export function LastUpdated({ className = "" }: LastUpdatedProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    // Update the timestamp every 30 seconds (matching our refresh interval)
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      Last updated: {lastUpdated.toLocaleString()}
    </div>
  )
} 