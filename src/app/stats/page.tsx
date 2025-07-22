'use client'

import { Suspense } from 'react'
import { HourlyStats } from '@/components/HourlyStats'
import { HourlyCountryStats } from '@/components/HourlyCountryStats'
import { HourlyAirlineStats } from '@/components/HourlyAirlineStats'
import { TimeRangeProvider } from '@/contexts/TimeRangeContext'
import { ThemeSelector } from '@/components/ThemeSelector'
import Link from 'next/link'

export default function StatsPage() {
  return (
    <TimeRangeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistics</h1>
                <p className="text-gray-600 dark:text-gray-300">Detailed hourly statistics and trends</p>
              </div>
              <div className="flex items-center gap-4">
                <ThemeSelector />
                <Link 
                  href="/" 
                  className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </header>
          
          <div className="space-y-8">
            {/* Hourly Aircraft Stats */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hourly Aircraft Statistics</h2>
              <Suspense fallback={<div>Loading hourly aircraft statistics...</div>}>
                <HourlyStats />
              </Suspense>
            </div>

            {/* Hourly Country Stats */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hourly Country Statistics</h2>
              <Suspense fallback={<div>Loading hourly country statistics...</div>}>
                <HourlyCountryStats />
              </Suspense>
            </div>

            {/* Hourly Airline Stats */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hourly Airline Statistics</h2>
              <Suspense fallback={<div>Loading hourly airline statistics...</div>}>
                <HourlyAirlineStats />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </TimeRangeProvider>
  )
} 