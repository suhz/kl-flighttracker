'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface HourlyStatsData {
  hourLabel: string
  count: number
}

export function HourlyStats() {
  const [data, setData] = useState<HourlyStatsData[]>([])
  const [loading, setLoading] = useState(true)
  const [hours, setHours] = useState(24)

  useEffect(() => {
    const fetchHourlyStats = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/hourly-stats?hours=${hours}`)
        const statsData = await response.json()
        setData(statsData)
      } catch (error) {
        console.error('Error fetching hourly stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHourlyStats()
    const interval = setInterval(fetchHourlyStats, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [hours])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hourly Aircraft Statistics</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading hourly statistics...</div>
      </div>
    )
  }

  const chartData = data.map(item => ({
    hour: item.hourLabel,
    aircraft: item.count
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hourly Aircraft Statistics</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">Time range:</label>
          <select 
            value={hours} 
            onChange={(e) => setHours(parseInt(e.target.value))}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
            <option value={48}>48 hours</option>
          </select>
        </div>
      </div>
      
      {chartData.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No aircraft data available for the selected time range
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis fontSize={12} tick={{ fill: '#6B7280' }} />
              <Tooltip 
                formatter={(value: number) => [`${value} aircraft`, 'Unique Aircraft']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="aircraft" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Total unique aircraft:</strong> {data.reduce((sum, item) => sum + item.count, 0)}
          </div>
          <div>
            <strong>Average per hour:</strong> {data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.count, 0) / data.length) : 0}
          </div>
        </div>
      </div>
    </div>
  )
} 