'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TimeRangeContextType {
  timeRange: string
  setTimeRange: (timeRange: string) => void
}

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined)

export function TimeRangeProvider({ children }: { children: ReactNode }) {
  const [timeRange, setTimeRange] = useState('1w')

  return (
    <TimeRangeContext.Provider value={{ timeRange, setTimeRange }}>
      {children}
    </TimeRangeContext.Provider>
  )
}

export function useTimeRange() {
  const context = useContext(TimeRangeContext)
  if (context === undefined) {
    throw new Error('useTimeRange must be used within a TimeRangeProvider')
  }
  return context
} 