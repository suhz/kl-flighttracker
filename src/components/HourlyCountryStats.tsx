'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchHourlyCountryStats } from '@/lib/api-client'

interface CountryData {
  country: string;
  count: number;
}

interface HourlyCountryStatsData {
  hour: string;
  hourLabel: string;
  countries: CountryData[];
  totalAircraft: number;
}

// Use polling interval from environment  
const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || '30000')

export function HourlyCountryStats() {
  const [data, setData] = useState<HourlyCountryStatsData[]>([])
  const [loading, setLoading] = useState(true)
  const [hours, setHours] = useState(24) // Default to 24 hours

  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true)
        const chartData = await fetchHourlyCountryStats(hours)
        setData(chartData)
      } catch (error) {
        console.error('Error fetching hourly country stats:', error)
      } finally {
        if (isInitial) setLoading(false)
      }
    }

    // Initial fetch with loading state
    fetchData(true)

    // Set up auto-refresh using environment interval (no loading state)
    const interval = setInterval(() => {
      fetchData(false)
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [hours])

  // Transform data for line chart - each country becomes a line
  const transformDataForChart = (rawData: HourlyCountryStatsData[]) => {
    if (!rawData.length) return []
    
    // Get all unique countries
    const allCountries = new Set<string>()
    rawData.forEach(hourData => {
      hourData.countries.forEach(country => {
        allCountries.add(country.country)
      })
    })
    
    // Create chart data with each hour as a data point
    return rawData.map(hourData => {
      const chartPoint: any = {
        hour: hourData.hourLabel,
        total: hourData.totalAircraft
      }
      
      // Add each country's count for this hour
      allCountries.forEach(country => {
        const countryData = hourData.countries.find(c => c.country === country)
        chartPoint[country] = countryData ? countryData.count : 0
      })
      
      return chartPoint
    })
  }

  const chartData = transformDataForChart(data)
  const allCountries = chartData.length > 0 ? Object.keys(chartData[0]).filter(key => key !== 'hour' && key !== 'total') : []

  // Generate colors for countries
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ]

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hourly Country Statistics</h3>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value={6}>Last 6 hours</option>
            <option value={12}>Last 12 hours</option>
            <option value={24}>Last 24 hours</option>
            <option value={48}>Last 48 hours</option>
          </select>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading hourly country statistics...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hourly Country Statistics</h3>
        <select
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value={6}>Last 6 hours</option>
          <option value={12}>Last 12 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={48}>Last 48 hours</option>
        </select>
      </div>
      
      {chartData.length > 0 ? (
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis fontSize={12} tick={{ fill: '#6B7280' }} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} aircraft`, 
                  name === 'total' ? 'Total Aircraft' : name
                ]}
                labelFormatter={(label) => `Time: ${label}`}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              {allCountries.map((country, index) => (
                <Line
                  key={country}
                  type="monotone"
                  dataKey={country}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No country data available for the selected time range
        </div>
      )}
    </div>
  )
} 