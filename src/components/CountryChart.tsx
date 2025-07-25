'use client'

import { useState, useEffect } from 'react'
import { useTimeRange } from '@/contexts/TimeRangeContext'
import { getCountryFlag } from '@/lib/countryFlags'
import { fetchCountryStats } from '@/lib/api-client'

interface CountryData {
  country: string;
  count: number;
}

// Use polling interval from environment
const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || '30000')

export function CountryChart() {
  const [data, setData] = useState<CountryData[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const { timeRange } = useTimeRange()

  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        const chartData = await fetchCountryStats(timeRange)
        setData(chartData)
      } catch (error) {
        console.error('Error fetching countries:', error)
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Countries</h3>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading countries...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors min-h-[380px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Countries</h3>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            {showAll ? 'Show Top 10' : `View All (${data.length})`}
          </button>
        )}
      </div>
      
      {displayedData.length > 0 ? (
        <div>
          {displayedData.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 min-h-[32px]">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-6">{index + 1}</span>
                <span className="w-6 h-5 text-center mr-2 flex items-center justify-center">{getCountryFlag(item.country || 'Unknown')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.country || 'Unknown'}</span>
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{item.count}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No country data available
        </div>
      )}
    </div>
  )
} 