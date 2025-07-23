'use client'

import { useState, useEffect } from 'react'

interface LastUpdatedProps {
  className?: string
}

// Use polling interval from environment
const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || '30000')

export function LastUpdated({ className = "" }: LastUpdatedProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    // Update the timestamp using environment interval
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      Last updated: {lastUpdated.toLocaleString()}
    </div>
  )
} 