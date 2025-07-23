'use client'

import { useState, useEffect } from 'react'
import { StatsCards } from './StatsCards'
import { DashboardStats } from '@/types/aircraft'
import { useTimeRange } from '@/contexts/TimeRangeContext'

export function StatsCardsClient() {
  const { timeRange, setTimeRange } = useTimeRange()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/stats?timeRange=${timeRange}`)
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchStats()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats()
    }, 30000)

    // Cleanup interval on unmount or timeRange change
    return () => clearInterval(interval)
  }, [timeRange])

  if (loading || !stats) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Statistics</h2>
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