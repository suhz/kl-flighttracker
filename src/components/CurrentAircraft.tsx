'use client'

import { useState, useEffect } from 'react'

interface CurrentAircraftData {
  hex: string
  flight: string
  registration: string
  aircraftType: string
  country: string
  flag: string
  altitude: number
  groundSpeed: number
  squawk: string
  lat: number | null
  lon: number | null
  seenAt: string
}

// Emergency and special squawk codes
const EMERGENCY_SQUAWKS = {
  '7500': { type: 'Hijack', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  '7600': { type: 'Radio Failure', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  '7700': { type: 'Emergency', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  '7777': { type: 'Intercept', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  '2000': { type: 'IFR', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  '1200': { type: 'VFR', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
}

function getSquawkInfo(squawk: string) {
  if (!squawk) return null
  return EMERGENCY_SQUAWKS[squawk as keyof typeof EMERGENCY_SQUAWKS] || null
}

export function CurrentAircraft() {
  const [aircraft, setAircraft] = useState<CurrentAircraftData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/current-aircraft')
        const data = await response.json()
        setAircraft(data)
      } catch (error) {
        console.error('Error fetching current aircraft:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (seenAt: string) => {
    const now = new Date()
    const seen = new Date(seenAt)
    const diffInSeconds = Math.floor((now.getTime() - seen.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    }
  }

  const formatCoordinates = (lat: number | null, lon: number | null) => {
    if (lat === null || lon === null) return '-'
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  }

  const openGoogleMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lon}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Aircraft</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading current aircraft...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Aircraft</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{aircraft.length} aircraft currently tracked</span>
      </div>
      
      {aircraft.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Flight</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Registration</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Altitude</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Speed</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Squawk</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Seen At</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {aircraft.map((plane, index) => {
                const squawkInfo = getSquawkInfo(plane.squawk)
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {plane.flight || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {plane.registration || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {plane.aircraftType || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className="flex items-center">
                        <span className="mr-2">{plane.flag}</span>
                        {plane.country}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {plane.altitude > 0 ? `${plane.altitude.toLocaleString()} ft` : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {plane.groundSpeed > 0 ? `${plane.groundSpeed} kts` : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {plane.squawk ? (
                        squawkInfo ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${squawkInfo.color} ${squawkInfo.bg} ${squawkInfo.border} border`}>
                            {plane.squawk}
                            <span className="ml-1 text-xs">({squawkInfo.type})</span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-900 dark:text-white">{plane.squawk}</span>
                        )
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {plane.lat && plane.lon ? (
                        <button
                          onClick={() => openGoogleMaps(plane.lat!, plane.lon!)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          title="Click to open in Google Maps"
                        >
                          {formatCoordinates(plane.lat, plane.lon)}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatTimeAgo(plane.seenAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No aircraft currently in range
        </div>
      )}
    </div>
  )
} 