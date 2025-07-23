import { prisma } from './db'
import { DashboardStats } from '@/types/aircraft'
import { subDays, subHours, subWeeks, subMonths } from 'date-fns'
import { REGISTRATION_PREFIXES, ICAO_HEX_RANGES } from './countries'
import { getAirlineName, getAirlineInfo } from './airlines'

// Helper function to get cutoff date based on time range
function getCutoffDate(timeRange: string) {
  const now = new Date()
  switch (timeRange) {
    case '2h':
      return subHours(now, 2)
    case '8h':
      return subHours(now, 8)
    case '24h':
      return subHours(now, 24)
    case '1w':
      return subWeeks(now, 1)
    case '1m':
      return subMonths(now, 1)
    default:
      return subWeeks(now, 1) // Default to 1 week
  }
}

export async function getDashboardStats(timeRange = '1w'): Promise<DashboardStats> {
  const cutoffDate = getCutoffDate(timeRange)
  
  const [
    totalFlights,
    totalAircraft,
    aircraftTypes,
    countries,
    airlines,
    maxDistanceResult
  ] = await Promise.all([
    // Total unique flights (count distinct flight numbers)
    prisma.aircraftSighting.groupBy({
      by: ['flight'],
      where: {
        seenAt: { gte: cutoffDate },
        flight: { not: null }
      }
    }).then(result => result.length),
    
    // Total unique aircraft (count distinct hex codes)
    prisma.aircraftSighting.groupBy({
      by: ['hex'],
      where: {
        seenAt: { gte: cutoffDate }
      }
    }).then(result => result.length),
    
    // Unique aircraft types (count distinct aircraft types)
    prisma.aircraftSighting.groupBy({
      by: ['aircraftType'],
      where: {
        seenAt: { gte: cutoffDate },
        aircraftType: { not: null }
      }
    }).then(result => result.length),
    
    // Unique countries (count distinct countries)
    prisma.aircraftSighting.groupBy({
      by: ['country'],
      where: {
        seenAt: { gte: cutoffDate },
        country: { not: null }
      }
    }).then(result => result.length),
    
    // Unique airlines (count distinct airlines)
    prisma.aircraftSighting.groupBy({
      by: ['airline'],
      where: {
        seenAt: { gte: cutoffDate },
        airline: { not: null }
      }
    }).then(result => result.length),
    
    // Max distance
    prisma.aircraftSighting.aggregate({
      where: {
        seenAt: { gte: cutoffDate },
        distance: { not: null }
      },
      _max: {
        distance: true
      }
    })
  ])
  
  return {
    totalFlights,
    totalAircraft,
    aircraftTypes,
    countries,
    airlines,
    maxDistance: maxDistanceResult._max.distance || 0
  }
}

export async function getTopAircraftTypes(limit = 50, timeRange = '1w') {
  const cutoffDate = getCutoffDate(timeRange)
  
  // Get unique aircraft by hex and their most common type
  const aircraftWithTypes = await prisma.aircraftSighting.groupBy({
    by: ['hex', 'aircraftType'],
    where: {
      seenAt: { gte: cutoffDate },
      aircraftType: { not: null }
    },
    _count: {
      hex: true
    }
  })
  
  // Group by aircraft type and count unique aircraft
  const typeCounts: Record<string, number> = {}
  aircraftWithTypes.forEach(item => {
    if (item.aircraftType) {
      typeCounts[item.aircraftType] = (typeCounts[item.aircraftType] || 0) + 1
    }
  })
  
  // Convert to array and sort
  const results = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
  
  const total = results.reduce((sum, item) => sum + item.count, 0)
  
  return results.map(item => ({
    aircraftType: item.type,
    count: item.count,
    percentage: (item.count / total) * 100
  }))
}

export async function getTopCountries(limit = 50, timeRange = '1w') {
  const cutoffDate = getCutoffDate(timeRange)
  
  // Get unique aircraft by hex and their country
  const aircraftWithCountries = await prisma.aircraftSighting.groupBy({
    by: ['hex', 'country'],
    where: {
      seenAt: { gte: cutoffDate },
      country: { not: null }
    },
    _count: {
      hex: true
    }
  })
  
  // Group by country and count unique aircraft
  const countryCounts: Record<string, number> = {}
  aircraftWithCountries.forEach(item => {
    if (item.country) {
      countryCounts[item.country] = (countryCounts[item.country] || 0) + 1
    }
  })
  
  // Convert to array and sort
  const results = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
  
  const total = results.reduce((sum, item) => sum + item.count, 0)
  
  return results.map(item => {
    // Find flag from registration prefixes
    const countryInfo = Object.values(REGISTRATION_PREFIXES).find(
      info => info.country === item.country
    )
    
    return {
      country: item.country,
      flag: countryInfo?.flag || '🏳️',
      count: item.count,
      percentage: (item.count / total) * 100
    }
  })
}

export async function getTopAirlines(limit = 50, timeRange = '1w') {
  const cutoffDate = getCutoffDate(timeRange)
  
  // Get unique aircraft by hex and their airline
  const aircraftWithAirlines = await prisma.aircraftSighting.groupBy({
    by: ['hex', 'airline'],
    where: {
      seenAt: { gte: cutoffDate },
      airline: { not: null }
    },
    _count: {
      hex: true
    }
  })
  
  // Group by airline and count unique aircraft
  const airlineCounts: Record<string, number> = {}
  aircraftWithAirlines.forEach(item => {
    if (item.airline) {
      airlineCounts[item.airline] = (airlineCounts[item.airline] || 0) + 1
    }
  })
  
  // Convert to array and sort
  const results = Object.entries(airlineCounts)
    .map(([airlineCode, count]) => {
      const airlineInfo = getAirlineInfo(airlineCode)
      return { 
        airline: airlineInfo.name, 
        airlineCode: airlineCode,
        country: airlineInfo.country,
        count 
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
  
  const total = results.reduce((sum, item) => sum + item.count, 0)
  
  return results.map(item => ({
    airline: item.airline,
    airlineCode: item.airlineCode,
    country: item.country,
    count: item.count,
    percentage: (item.count / total) * 100
  }))
}

export async function getCurrentAircraft() {
  const recentTime = new Date(Date.now() - 120 * 1000) // Aircraft seen in last 120 seconds
  
  const aircraft = await prisma.aircraftSighting.findMany({
    where: {
      seenAt: { gte: recentTime }
    },
    orderBy: {
      seenAt: 'desc'
    },
    take: 50,
    distinct: ['hex'] // Get unique aircraft only
  })
  
  return aircraft.map(plane => {
    // Get flag from ICAO hex ranges based on country code
    let flag = '❓'
    if (plane.countryCode && plane.countryCode !== 'XX') {
      // Find the flag from our ICAO ranges
      const countryInfo = ICAO_HEX_RANGES.find(range => range.code === plane.countryCode)
      flag = countryInfo?.flag || '❓'
    }
    
    return {
      hex: plane.hex,
      flight: plane.flight || '',
      registration: plane.registration || '',
      aircraftType: plane.aircraftType || '',
      country: plane.country || 'Unknown',
      flag: flag,
      altitude: plane.altitude || 0,
      groundSpeed: plane.groundSpeed || 0,
      track: plane.track || null,
      distance: plane.distance || 0,
      rssi: plane.rssi || 0,
      squawk: plane.squawk || '',
      lat: plane.lat,
      lon: plane.lon,
      seenAt: plane.seenAt
    }
  })
}

export async function getHourlyStats(hours = 24) {
  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - hours)
  
  // Get all aircraft sightings in the time range
  const sightings = await prisma.aircraftSighting.findMany({
    where: {
      seenAt: { gte: cutoffDate }
    },
    select: {
      hex: true,
      seenAt: true
    },
    orderBy: {
      seenAt: 'asc'
    }
  })
  
  // Group by hour and count unique aircraft
  const hourlyStats: Record<string, Set<string>> = {}
  
  sightings.forEach(sighting => {
    const hour = new Date(sighting.seenAt).toISOString().slice(0, 13) + ':00:00.000Z'
    if (!hourlyStats[hour]) {
      hourlyStats[hour] = new Set()
    }
    hourlyStats[hour].add(sighting.hex)
  })
  
  // Convert to array format
  return Object.entries(hourlyStats)
    .map(([hour, aircraftSet]) => ({
      hour: new Date(hour),
      count: aircraftSet.size,
      hourLabel: new Date(hour).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
      })
    }))
    .sort((a, b) => a.hour.getTime() - b.hour.getTime())
} 

export async function getHourlyCountryStats(hours = 24) {
  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - hours)
  
  // Get all aircraft sightings in the time range
  const sightings = await prisma.aircraftSighting.findMany({
    where: {
      seenAt: { gte: cutoffDate },
      country: { not: null }
    },
    select: {
      hex: true,
      country: true,
      seenAt: true
    },
    orderBy: {
      seenAt: 'asc'
    }
  })
  
  // Group by hour and count aircraft per country
  const hourlyStats: Record<string, Record<string, Set<string>>> = {}
  
  sightings.forEach(sighting => {
    const hour = new Date(sighting.seenAt).toISOString().slice(0, 13) + ':00:00.000Z'
    if (!hourlyStats[hour]) {
      hourlyStats[hour] = {}
    }
    if (!hourlyStats[hour][sighting.country!]) {
      hourlyStats[hour][sighting.country!] = new Set()
    }
    hourlyStats[hour][sighting.country!].add(sighting.hex)
  })
  
  // Convert to array format with country breakdown
  return Object.entries(hourlyStats)
    .map(([hour, countryData]) => {
      const countryCounts = Object.entries(countryData).map(([country, aircraftSet]) => ({
        country,
        count: aircraftSet.size
      })).sort((a, b) => b.count - a.count) // Sort by count descending
      
      return {
        hour: new Date(hour),
        hourLabel: new Date(hour).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: true 
        }),
        countries: countryCounts,
        totalAircraft: countryCounts.reduce((sum, item) => sum + item.count, 0)
      }
    })
    .sort((a, b) => a.hour.getTime() - b.hour.getTime())
}

export async function getHourlyAirlineStats(hours = 24) {
  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - hours)
  
  // Get all aircraft sightings in the time range
  const sightings = await prisma.aircraftSighting.findMany({
    where: {
      seenAt: { gte: cutoffDate },
      airline: { not: null }
    },
    select: {
      hex: true,
      airline: true,
      seenAt: true
    },
    orderBy: {
      seenAt: 'asc'
    }
  })
  
  // Group by hour and count aircraft per airline
  const hourlyStats: Record<string, Record<string, Set<string>>> = {}
  
  sightings.forEach(sighting => {
    const hour = new Date(sighting.seenAt).toISOString().slice(0, 13) + ':00:00.000Z'
    if (!hourlyStats[hour]) {
      hourlyStats[hour] = {}
    }
    if (!hourlyStats[hour][sighting.airline!]) {
      hourlyStats[hour][sighting.airline!] = new Set()
    }
    hourlyStats[hour][sighting.airline!].add(sighting.hex)
  })
  
  // Convert to array format with airline breakdown
  return Object.entries(hourlyStats)
    .map(([hour, airlineData]) => {
      const airlineCounts = Object.entries(airlineData).map(([airlineCode, aircraftSet]) => ({
        airline: getAirlineName(airlineCode),
        airlineCode: airlineCode,
        count: aircraftSet.size
      })).sort((a, b) => b.count - a.count) // Sort by count descending
      
      return {
        hour: new Date(hour),
        hourLabel: new Date(hour).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: true 
        }),
        airlines: airlineCounts,
        totalAircraft: airlineCounts.reduce((sum, item) => sum + item.count, 0)
      }
    })
    .sort((a, b) => a.hour.getTime() - b.hour.getTime())
} 