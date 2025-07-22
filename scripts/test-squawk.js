#!/usr/bin/env node

// Test script to simulate emergency squawk codes
const testData = [
  {
    hex: "test1",
    flight: "TEST001",
    registration: "N12345",
    aircraftType: "B738",
    country: "United States",
    flag: "🇺🇸",
    altitude: 35000,
    groundSpeed: 450,
    squawk: "7700", // Emergency
    seenAt: new Date().toISOString()
  },
  {
    hex: "test2", 
    flight: "TEST002",
    registration: "N67890",
    aircraftType: "A320",
    country: "Canada",
    flag: "🇨🇦",
    altitude: 28000,
    groundSpeed: 380,
    squawk: "7500", // Hijack
    seenAt: new Date().toISOString()
  },
  {
    hex: "test3",
    flight: "TEST003", 
    registration: "G-ABCD",
    aircraftType: "B789",
    country: "United Kingdom",
    flag: "🇬🇧",
    altitude: 41000,
    groundSpeed: 520,
    squawk: "7600", // Radio Failure
    seenAt: new Date().toISOString()
  },
  {
    hex: "test4",
    flight: "TEST004",
    registration: "D-EFGH",
    aircraftType: "A350",
    country: "Germany", 
    flag: "🇩🇪",
    altitude: 33000,
    groundSpeed: 420,
    squawk: "1200", // VFR
    seenAt: new Date().toISOString()
  },
  {
    hex: "test5",
    flight: "TEST005",
    registration: "F-IJKL",
    aircraftType: "A380",
    country: "France",
    flag: "🇫🇷", 
    altitude: 39000,
    groundSpeed: 480,
    squawk: "2000", // IFR
    seenAt: new Date().toISOString()
  }
]

console.log('🧪 Testing Squawk Code Highlighting...\n')

const EMERGENCY_SQUAWKS = {
  '7500': { type: 'Hijack', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  '7600': { type: 'Radio Failure', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  '7700': { type: 'Emergency', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  '7777': { type: 'Intercept', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  '2000': { type: 'IFR', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  '1200': { type: 'VFR', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
}

function getSquawkInfo(squawk) {
  if (!squawk) return null
  return EMERGENCY_SQUAWKS[squawk] || null
}

testData.forEach((aircraft, index) => {
  const squawkInfo = getSquawkInfo(aircraft.squawk)
  console.log(`${index + 1}. ${aircraft.flight} (${aircraft.registration})`)
  console.log(`   Aircraft: ${aircraft.aircraftType}`)
  console.log(`   Country: ${aircraft.flag} ${aircraft.country}`)
  console.log(`   Altitude: ${aircraft.altitude.toLocaleString()} ft`)
  console.log(`   Speed: ${aircraft.groundSpeed} kts`)
  
  if (squawkInfo) {
    console.log(`   Squawk: ${aircraft.squawk} - ${squawkInfo.type} (${squawkInfo.color})`)
  } else {
    console.log(`   Squawk: ${aircraft.squawk || 'None'}`)
  }
  console.log('')
})

console.log('✅ Test completed!')
console.log('\n📋 Emergency Squawk Codes:')
console.log('  7500 - Hijack (Red)')
console.log('  7600 - Radio Failure (Orange)') 
console.log('  7700 - Emergency (Red)')
console.log('  7777 - Intercept (Red)')
console.log('  2000 - IFR (Blue)')
console.log('  1200 - VFR (Green)') 