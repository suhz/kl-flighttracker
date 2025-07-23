'use client'

import { useState, useEffect } from 'react'
import { AircraftMap } from './AircraftMap'
import { fetchCurrentAircraft } from '@/lib/api-client'

export interface CurrentAircraftData {
  hex: string
  flight: string
  registration: string
  aircraftType: string
  country: string
  flag: string
  altitude: number
  groundSpeed: number
  track: number | null
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

// Use polling interval from environment
const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || '30000')
console.log('🕐 CurrentAircraft polling interval:', POLL_INTERVAL, 'ms')

export function CurrentAircraft() {
  const [aircraft, setAircraft] = useState<CurrentAircraftData[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        const data = await fetchCurrentAircraft()
        setAircraft(data)
      } catch (error) {
        console.error('Error fetching current aircraft:', error)
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

    return () => clearInterval(interval)
  }, [])

  // Live timer for "Last Seen" that updates every second (only when aircraft are visible)
  useEffect(() => {
    if (aircraft.length === 0) return

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [aircraft.length])

  const formatTimeAgo = (seenAt: string) => {
    const seen = new Date(seenAt)
    const diffInSeconds = Math.floor((currentTime.getTime() - seen.getTime()) / 1000)
    
    let text = `${diffInSeconds}s ago`
    let className = "text-sm flex items-center gap-1"
    let dotColor = ""
    
    if (diffInSeconds < 30) {
      // Very fresh - green with pulse
      className += " text-green-600 dark:text-green-400 animate-pulse font-medium"
      dotColor = "bg-green-500 animate-pulse"
    } else if (diffInSeconds < 60) {
      // Fresh - green
      className += " text-green-600 dark:text-green-400"
      dotColor = "bg-green-500"
    } else {
      // Getting old (60-120s) - yellow/amber
      className += " text-amber-600 dark:text-amber-400"
      dotColor = "bg-amber-500"
    }
    
    return { text, className, dotColor }
  }

  const formatCoordinates = (lat: number | null, lon: number | null) => {
    if (lat === null || lon === null) return '-'
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  }

  const openGoogleMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lon}`
    window.open(url, '_blank')
  }

  if (initialLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Aircraft</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading current aircraft...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      {/* Live Aircraft Map */}
      <AircraftMap aircraft={aircraft} />

      {/* Aircraft Data Table */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aircraft Data</h2>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              Status: 
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>&lt;60s</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>60s+</span>
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{aircraft.length} aircraft</span>
          </div>
        </div>
      
      {aircraft.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Flight</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Registration</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reg. Country</th>
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
                    <td className="px-3 py-2 whitespace-nowrap">
                      {(() => {
                        const timeInfo = formatTimeAgo(plane.seenAt)
                        return (
                          <span className={timeInfo.className} title={`Last seen at ${new Date(plane.seenAt).toLocaleString()}`}>
                            <span className={`w-2 h-2 rounded-full ${timeInfo.dotColor}`}></span>
                            {timeInfo.text}
                          </span>
                        )
                      })()}
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
    </div>
  )
} 