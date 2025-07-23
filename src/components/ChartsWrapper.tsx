'use client'

import { AircraftTypeChart } from './AircraftTypeChart'
import { CountryChart } from './CountryChart'
import { AirlineChart } from './AirlineChart'

export function ChartsWrapper() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <CountryChart />
      <AirlineChart />
      <AircraftTypeChart />
    </div>
  )
} 