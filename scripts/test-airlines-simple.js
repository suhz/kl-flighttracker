#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple test of the airlines data
const airlinesPath = path.join(__dirname, '../data/airlines.json');

if (fs.existsSync(airlinesPath)) {
  const data = JSON.parse(fs.readFileSync(airlinesPath, 'utf-8'));
  
  console.log('🧪 Testing airlines data...\n');
  console.log(`📊 Total airlines: ${data.totalAirlines}`);
  console.log(`🕒 Last updated: ${data.lastUpdated}\n`);
  
  const testCodes = ['AXM', 'MAS', 'SIA', 'MXD', 'UAE'];
  
  testCodes.forEach(code => {
    const airline = data.lookup[code];
    if (airline) {
      console.log(`${code} -> ${airline.name} (${airline.country})`);
    } else {
      console.log(`${code} -> Not found in database`);
    }
  });
  
  console.log('\n✅ Test completed!');
} else {
  console.log('❌ Airlines data not found. Run: npm run fetch-airlines');
} 