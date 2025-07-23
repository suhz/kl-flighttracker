import { ICAO_HEX_RANGES } from './countries'

/**
 * Get the flag emoji for a country name
 * @param countryName - The name of the country
 * @returns Flag emoji or fallback globe emoji
 */
export function getCountryFlag(countryName: string): string {
  if (!countryName || countryName === 'Unknown') {
    return '🌍'
  }
  
  // Find the country in the ICAO_HEX_RANGES
  const countryInfo = ICAO_HEX_RANGES.find(range => 
    range.country === countryName || 
    range.country.toLowerCase() === countryName.toLowerCase()
  )
  
  return countryInfo?.flag || '🌍'
}

/**
 * Get country flag for airline based on airline country data
 * This is used specifically for airline charts where we have airline->country mapping
 */
export function getAirlineCountryFlag(airlineCountry: string): string {
  return getCountryFlag(airlineCountry)
} 