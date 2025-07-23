'use client'

import { useState, useEffect } from 'react'
import { useTimeRange } from '@/contexts/TimeRangeContext'
import { fetchAirlineStats } from '@/lib/api-client'

interface AirlineData {
  airline: string;
  airlineCode: string;
  country: string;
  count: number;
}

// Use polling interval from environment
const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || '30000')

export function AirlineChart() {
  const [data, setData] = useState<AirlineData[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const { timeRange } = useTimeRange()

  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        const chartData = await fetchAirlineStats(timeRange)
        setData(chartData)
      } catch (error) {
        console.error('Error fetching airlines:', error)
      } finally {
        if (isInitial) {
          setInitialLoading(false)
        }
      }
    }

    // Initial fetch with loading state
    fetchData(true)

    // Set up auto-refresh using environment interval (no loading state)
    const interval = setInterval(() => {
      fetchData(false)
    }, POLL_INTERVAL)

    // Cleanup interval on unmount or timeRange change
    return () => clearInterval(interval)
  }, [timeRange])

  const displayedData = showAll ? data : data.slice(0, 10)
  const hasMore = data.length > 10

  if (initialLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors min-h-[380px]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Airlines</h3>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading airlines...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors min-h-[380px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Airlines</h3>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            {showAll ? 'Show Top 10' : `View All (${data.length})`}
          </button>
        )}
      </div>
      
      {displayedData.length > 0 ? (
        <div>
          {displayedData.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 min-h-[32px]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-6">{index + 1}</span>
                <div className="flex items-center gap-2">
                  {item.airlineCode && item.airlineCode !== item.airline && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 w-10">
                      {item.airlineCode}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.airline || 'Unknown'}
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{item.count}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No airline data available
        </div>
      )}
    </div>
  )
} 