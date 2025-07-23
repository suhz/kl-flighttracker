'use client'

import { useState, useEffect } from 'react'
import { StatsCards } from './StatsCards'
import { DashboardStats } from '@/types/aircraft'
import { useTimeRange } from '@/contexts/TimeRangeContext'
import { fetchStats } from '@/lib/api-client'

// Use polling interval from environment
const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || '30000')
console.log('📊 StatsCardsClient polling interval:', POLL_INTERVAL, 'ms')

export function StatsCardsClient() {
  const { timeRange, setTimeRange } = useTimeRange()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchStatsData = async (isInitial = false) => {
      try {
        const data = await fetchStats(timeRange)
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        if (isInitial) {
          setInitialLoading(false)
        }
      }
    }

    // Initial fetch with loading state
    fetchStatsData(true)

    // Set up auto-refresh using environment interval (no loading state)
    const interval = setInterval(() => {
      fetchStatsData(false)
    }, POLL_INTERVAL)

    // Cleanup interval on unmount or timeRange change
    return () => clearInterval(interval)
  }, [timeRange])

  if (initialLoading || !stats) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Statistics</h2>
        </div>
        <div className="text-center py-8">Loading statistics...</div>
      </div>
    )
  }

  return (
    <StatsCards 
      stats={stats} 
      timeRange={timeRange} 
      onTimeRangeChange={setTimeRange} 
    />
  )
} 