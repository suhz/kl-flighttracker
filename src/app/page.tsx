'use client'

import { Suspense } from 'react'
import { CurrentAircraft } from '@/components/CurrentAircraft'
import { StatsCardsClient } from '@/components/StatsCardsClient'
import { ChartsWrapper } from '@/components/ChartsWrapper'
import { TimeRangeProvider } from '@/contexts/TimeRangeContext'
import { ThemeSelector } from '@/components/ThemeSelector'
import Link from 'next/link'

export default function HomePage() {
  return (
    <TimeRangeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">KL FlightTracker</h1>
                <p className="text-gray-600 dark:text-gray-300">Real-time flight data captured by Suhaimi Amir's ADS-B station in Kuala Lumpur</p>
              </div>
              <div className="flex items-center gap-4">
                <ThemeSelector />
                <Link 
                  href="/stats" 
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Detailed Stats
                </Link>
              </div>
            </div>
          </header>
          
          <Suspense fallback={<div>Loading statistics...</div>}>
            <StatsCardsClient />
          </Suspense>
          
          <Suspense fallback={<div>Loading charts...</div>}>
            <ChartsWrapper />
          </Suspense>

          <Suspense fallback={<div>Loading current aircraft...</div>}>
            <CurrentAircraftWrapper />
          </Suspense>
        </div>
      </div>
    </TimeRangeProvider>
  )
}

async function CurrentAircraftWrapper() {
  return <CurrentAircraft />
} 