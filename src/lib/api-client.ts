/**
 * API client with ETag support for efficient caching
 */

interface ETagCache {
  [url: string]: {
    etag: string
    data: any
    timestamp: number
  }
}

class APIClient {
  private cache: ETagCache = {}
  private readonly CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes

  /**
   * Fetch with ETag support
   */
  async fetchWithETag<T>(url: string): Promise<T> {
    const cacheEntry = this.cache[url]
    const headers: HeadersInit = {}
    
    // Add If-None-Match header if we have a cached ETag
    if (cacheEntry && Date.now() - cacheEntry.timestamp < this.CACHE_TIMEOUT) {
      headers['If-None-Match'] = cacheEntry.etag
      console.log(`🔍 Sending If-None-Match for ${url}: ${cacheEntry.etag}`)
    }

    try {
      const response = await fetch(url, { headers })
      
      // 304 Not Modified - return cached data
      if (response.status === 304 && cacheEntry) {
        console.log(`📦 Cache hit (304) for ${url}`)
        return cacheEntry.data
      }
      
      // 200 OK - parse new data and cache it
      if (response.ok) {
        const data = await response.json()
        const etag = response.headers.get('ETag')
        
        if (etag) {
          this.cache[url] = {
            etag,
            data,
            timestamp: Date.now()
          }
          console.log(`🔄 Cache update for ${url}`)
        }
        
        return data
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      console.error(`❌ API error for ${url}:`, error)
      
      // Return cached data if available as fallback
      if (cacheEntry) {
        console.log(`🔄 Fallback to cache for ${url}`)
        return cacheEntry.data
      }
      
      throw error
    }
  }

  /**
   * Clear cache for a specific URL or all URLs
   */
  clearCache(url?: string) {
    if (url) {
      delete this.cache[url]
    } else {
      this.cache = {}
    }
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    const entries = Object.keys(this.cache).length
    const totalSize = JSON.stringify(this.cache).length
    return { entries, totalSize }
  }
}

// Global instance
export const apiClient = new APIClient()

// Convenience methods with proper typing
export const fetchCurrentAircraft = () => apiClient.fetchWithETag<any[]>('/api/current-aircraft')
export const fetchStats = (timeRange: string = '1w') => apiClient.fetchWithETag<any>(`/api/stats?timeRange=${timeRange}`)
export const fetchCountryStats = (timeRange: string = '1w') => apiClient.fetchWithETag<any[]>(`/api/countries?timeRange=${timeRange}`)
export const fetchAirlineStats = (timeRange: string = '1w') => apiClient.fetchWithETag<any[]>(`/api/airlines?timeRange=${timeRange}`)
export const fetchAircraftTypes = (timeRange: string = '1w') => apiClient.fetchWithETag<any[]>(`/api/aircraft-types?timeRange=${timeRange}`)
export const fetchHourlyStats = (hours: number = 24) => apiClient.fetchWithETag<any[]>(`/api/hourly-stats?hours=${hours}`)
export const fetchHourlyAirlineStats = (hours: number = 24) => apiClient.fetchWithETag<any[]>(`/api/hourly-airline-stats?hours=${hours}`)
export const fetchHourlyCountryStats = (hours: number = 24) => apiClient.fetchWithETag<any[]>(`/api/hourly-country-stats?hours=${hours}`) 