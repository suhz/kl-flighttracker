import aircraftTypesData from '../../data/aircraft-types.json'

export interface AircraftType {
  name: string
  icao: string
}

interface AircraftTypesDatabase {
  _metadata: {
    description: string
    lastUpdated: string
    totalAircraftTypes: number
    sources: string
    note: string
  }
  lookup: Record<string, AircraftType>
}

// Type the imported data and extract the lookup object
const aircraftTypesDb = aircraftTypesData as AircraftTypesDatabase
const aircraftTypes = aircraftTypesDb.lookup

/**
 * Get aircraft type name from ICAO aircraft type code
 * @param icaoCode - Aircraft type ICAO code (e.g., 'B738', 'A320')
 * @returns Aircraft type name or the original code if not found
 */
export function getAircraftTypeName(icaoCode: string): string {
  if (!icaoCode || icaoCode.trim() === '') {
    return 'Unknown'
  }

  const aircraftType = aircraftTypes[icaoCode.trim()]
  return aircraftType ? aircraftType.name : icaoCode
}

/**
 * Get aircraft type info from ICAO aircraft type code
 * @param icaoCode - Aircraft type ICAO code
 * @returns Aircraft type object or null if not found
 */
export function getAircraftTypeInfo(icaoCode: string): AircraftType | null {
  if (!icaoCode || icaoCode.trim() === '') {
    return null
  }

  return aircraftTypes[icaoCode.trim()] || null
}

/**
 * Check if an aircraft type code exists in our database
 * @param icaoCode - Aircraft type ICAO code
 * @returns true if the code exists in our database
 */
export function hasAircraftType(icaoCode: string): boolean {
  return !!(icaoCode && aircraftTypes[icaoCode.trim()])
}

/**
 * Get all aircraft types
 * @returns Record of all aircraft types
 */
export function getAllAircraftTypes(): Record<string, AircraftType> {
  return aircraftTypes
}

/**
 * Get metadata about the aircraft types database
 * @returns Metadata including source, license, and update information
 */
export function getAircraftTypesMetadata() {
  return aircraftTypesDb._metadata
} 