'use client'

import { useEffect, useState, useRef } from 'react'
import React from 'react'
import dynamic from 'next/dynamic'
import { CurrentAircraftData } from './CurrentAircraft'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface AircraftMapProps {
  aircraft: CurrentAircraftData[]
}

// MapController component to handle auto-fitting bounds on first load only
const MapController = dynamic(() => 
  import('react-leaflet').then(mod => {
    const { useMap } = mod
    
    return function MapControllerInner({ aircraft }: { aircraft: CurrentAircraftData[] }) {
      const map = useMap()
      const hasAutoFitted = React.useRef(false)
      
      useEffect(() => {
        // Only auto-fit once on first load
        if (!map || !aircraft.length || hasAutoFitted.current) return
        
        const aircraftWithLocation = aircraft.filter(plane => 
          plane.lat !== null && plane.lon !== null
        )
        
        if (aircraftWithLocation.length === 0) return
        
        // Calculate bounds for all aircraft
        if (aircraftWithLocation.length === 1) {
          // Single aircraft - center on it with reasonable zoom
          const plane = aircraftWithLocation[0]
          map.setView([plane.lat!, plane.lon!], 10)
        } else {
          // Multiple aircraft - fit bounds to show all
          const bounds = aircraftWithLocation.map(plane => [plane.lat!, plane.lon!] as [number, number])
          map.fitBounds(bounds, { padding: [20, 20] })
        }
        
        // Mark as auto-fitted to prevent future auto-fitting
        hasAutoFitted.current = true
      }, [map, aircraft])
      
      return null
    }
  }), 
  { ssr: false }
)

// Calculate heading between two points
function calculateHeading(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = (lon2 - lon1) * Math.PI / 180
  const lat1Rad = lat1 * Math.PI / 180
  const lat2Rad = lat2 * Math.PI / 180
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)
  
  let heading = Math.atan2(y, x) * 180 / Math.PI
  return (heading + 360) % 360 // Normalize to 0-360
}

export function AircraftMap({ aircraft }: AircraftMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [previousPositions, setPreviousPositions] = useState<Map<string, {lat: number, lon: number}>>(new Map())

  useEffect(() => {
    setIsClient(true)
    
    // Check initial dark mode state
    if (typeof window !== 'undefined') {
      const checkDarkMode = () => {
        const isDark = document.documentElement.classList.contains('dark')
        setIsDarkMode(isDark)
        console.log('🗺️ Map dark mode:', isDark ? 'ON' : 'OFF')
      }
      
      // Initial check
      checkDarkMode()
      
      // Watch for theme changes
      const observer = new MutationObserver(checkDarkMode)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      })
      
      return () => observer.disconnect()
    }
  }, [])

  useEffect(() => {
    // Fix Leaflet icon issue in Next.js and create airplane icons
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      
      // Create airplane icon with rotation and smooth transitions
      const createAirplaneIcon = (rotation: number = 0, isDark: boolean = false) => {
        const iconColor = isDark ? "#60a5fa" : "#2563eb" // Lighter blue for dark mode
        const airplaneIconHtml = `
          <div style="
            transform: rotate(${rotation}deg); 
            transform-origin: center;
            transition: transform 0.5s ease-in-out;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${iconColor}">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
        `
        
        return L.divIcon({
          html: airplaneIconHtml,
          className: 'airplane-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12]
        })
      }
      
      // Store the function globally so it can be used in the component
      (window as any).createAirplaneIcon = createAirplaneIcon
    }
  }, [])

  // Update previous positions for heading calculation
  useEffect(() => {
    const newPositions = new Map()
    aircraft.forEach(plane => {
      if (plane.lat !== null && plane.lon !== null) {
        newPositions.set(plane.hex, { lat: plane.lat, lon: plane.lon })
      }
    })
    setPreviousPositions(prev => {
      const updated = new Map(prev)
      newPositions.forEach((pos, hex) => {
        updated.set(hex, pos)
      })
      return updated
    })
  }, [aircraft])

  // Filter aircraft with valid coordinates
  const aircraftWithLocation = aircraft.filter(plane => 
    plane.lat !== null && plane.lon !== null
  )

  // Calculate center point (Kuala Lumpur default if no aircraft)
  const defaultCenter: [number, number] = [3.1390, 101.6869] // Kuala Lumpur
  
  let center: [number, number] = defaultCenter
  if (aircraftWithLocation.length > 0) {
    const latSum = aircraftWithLocation.reduce((sum, plane) => sum + (plane.lat || 0), 0)
    const lonSum = aircraftWithLocation.reduce((sum, plane) => sum + (plane.lon || 0), 0)
    center = [latSum / aircraftWithLocation.length, lonSum / aircraftWithLocation.length]
  }

  const formatTimeAgo = (seenAt: string) => {
    const now = new Date()
    const seen = new Date(seenAt)
    const diffInSeconds = Math.floor((now.getTime() - seen.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    }
  }

  // Debug: Log track data availability (simplified logging)
  useEffect(() => {
    const planesWithTrack = aircraft.filter(p => p.track !== null)
    console.log(`✈️ ${planesWithTrack.length}/${aircraft.length} aircraft with heading data`)
  }, [aircraft])

  if (!isClient) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Aircraft Map</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {aircraftWithLocation.length} aircraft visible
        </span>
      </div>
      
      <div className="h-[500px] rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-700">
        <MapContainer
          center={center}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            key={isDarkMode ? 'dark' : 'light'}
            attribution={
              isDarkMode 
                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
            url={
              isDarkMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          <MapController aircraft={aircraft} />
          
          {aircraftWithLocation.map((plane, index) => {
            // Get airplane icon with rotation based on track
            const createIcon = (window as any).createAirplaneIcon
            
            let rotation = 0
            let headingSource = 'No heading data'
            
            // Priority 1: Use actual track data if available
            if (plane.track !== null && plane.track !== undefined) {
              rotation = plane.track
              headingSource = 'Live heading data'
            } 
            // Priority 2: Calculate from previous position if available
            else if (previousPositions.has(plane.hex)) {
              const prev = previousPositions.get(plane.hex)!
              if (prev.lat !== plane.lat || prev.lon !== plane.lon) {
                rotation = calculateHeading(prev.lat, prev.lon, plane.lat!, plane.lon!)
                headingSource = 'Calculated from flight path'
              } else {
                // Priority 3: Use a demo heading based on aircraft hex for consistent direction
                const hash = plane.hex.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                rotation = (hash * 137.5) % 360 // Golden angle for good distribution
                headingSource = 'Estimated heading'
              }
            }
            // Priority 4: Demo heading for new aircraft
            else {
              const hash = plane.hex.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
              rotation = (hash * 137.5) % 360
              headingSource = 'Estimated heading'
            }

            const airplaneIcon = createIcon ? createIcon(rotation, isDarkMode) : undefined

            return (
              <Marker 
                key={plane.hex} // Use hex as key for stable identity
                position={[plane.lat!, plane.lon!]}
                icon={airplaneIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[220px]">
                    <div className="font-semibold text-lg mb-2 text-blue-600">
                      {plane.flight || 'Unknown Flight'}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div><strong>Registration:</strong> {plane.registration || 'N/A'}</div>
                      <div><strong>Aircraft:</strong> {plane.aircraftType || 'Unknown'}</div>
                      <div><strong>Country:</strong> {plane.flag} {plane.country}</div>
                      
                      {plane.altitude > 0 && (
                        <div><strong>Altitude:</strong> {plane.altitude.toLocaleString()} ft</div>
                      )}
                      
                      {plane.groundSpeed > 0 && (
                        <div><strong>Speed:</strong> {plane.groundSpeed} kts</div>
                      )}
                      
                      <div><strong>Heading:</strong> {rotation.toFixed(0)}° <span className="text-xs text-gray-500">({headingSource})</span></div>
                      
                      {plane.squawk && (
                        <div><strong>Squawk:</strong> {plane.squawk}</div>
                      )}
                      
                      <div><strong>Coordinates:</strong> {plane.lat?.toFixed(4)}, {plane.lon?.toFixed(4)}</div>
                      <div><strong>Last Seen:</strong> {formatTimeAgo(plane.seenAt)}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
        
        {aircraftWithLocation.length === 0 && (
          <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${
            isDarkMode 
              ? 'bg-gray-900 bg-opacity-95' 
              : 'bg-gray-50 bg-opacity-95'
          }`}>
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-lg font-medium">No aircraft with location data</div>
              <div className="text-sm">Aircraft locations will appear here when available</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 