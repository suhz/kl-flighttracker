'use client'

import { useState, useEffect } from 'react'
import { useTimeRange } from '@/contexts/TimeRangeContext'

interface AirlineData {
  airline: string;
  airlineCode: string;
  country: string;
  count: number;
}

export function AirlineChart() {
  const [data, setData] = useState<AirlineData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const { timeRange } = useTimeRange()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/airlines?timeRange=${timeRange}`)
        const chartData = await response.json()
        setData(chartData)
      } catch (error) {
        console.error('Error fetching airlines:', error)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchData()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData()
    }, 30000)

    // Cleanup interval on unmount or timeRange change
    return () => clearInterval(interval)
  }, [timeRange])

  const displayedData = showAll ? data : data.slice(0, 10)
  const hasMore = data.length > 10

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Airlines</h3>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading airlines...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors">
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
        <div className="space-y-1">
          {displayedData.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-6">{index + 1}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.airline || 'Unknown'}</span>
                  {item.airlineCode && item.airlineCode !== item.airline && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.airlineCode}</span>
                  )}
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