#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const AIRLINES_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat';
const OUTPUT_FILE = path.join(__dirname, '../data/airlines.json');

async function fetchAirlinesData() {
  console.log('🛩️  Fetching airlines data from OpenFlights...');
  
  return new Promise((resolve, reject) => {
    https.get(AIRLINES_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('✅ Data fetched successfully');
        resolve(data);
      });
    }).on('error', (err) => {
      console.error('❌ Error fetching airlines data:', err.message);
      reject(err);
    });
  });
}

function parseAirlinesData(rawData) {
  console.log('📊 Parsing airlines data...');
  
  const lines = rawData.split('\n').filter(line => line.trim());
  const airlines = [];
  
  for (const line of lines) {
    // Split by comma, but handle quoted fields properly
    const fields = line.split(',').map(field => {
      // Remove quotes if present
      return field.replace(/^"/, '').replace(/"$/, '');
    });
    
    if (fields.length >= 8) {
      const [
        id,
        name,
        alias,
        iata,
        icao,
        callsign,
        country,
        active
      ] = fields;
      
      // Only include active airlines with valid codes
      if (active === 'Y' && (iata || icao)) {
        airlines.push({
          id: parseInt(id),
          name: name || 'Unknown',
          alias: alias || '',
          iata: iata || '',
          icao: icao || '',
          callsign: callsign || '',
          country: country || '',
          active: active === 'Y'
        });
      }
    }
  }
  
  console.log(`📈 Found ${airlines.length} active airlines`);
  return airlines;
}

function saveAirlinesData(airlines) {
  console.log('💾 Saving airlines data...');
  
  // Ensure data directory exists
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create a lookup object for easy access
  const airlinesLookup = {};
  
  // Index by IATA code
  airlines.forEach(airline => {
    if (airline.iata) {
      airlinesLookup[airline.iata] = airline;
    }
  });
  
  // Index by ICAO code
  airlines.forEach(airline => {
    if (airline.icao) {
      airlinesLookup[airline.icao] = airline;
    }
  });
  
  const output = {
    lastUpdated: new Date().toISOString(),
    totalAirlines: airlines.length,
    airlines: airlines,
    lookup: airlinesLookup
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✅ Airlines data saved to ${OUTPUT_FILE}`);
}

async function main() {
  try {
    const rawData = await fetchAirlinesData();
    const airlines = parseAirlinesData(rawData);
    saveAirlinesData(airlines);
    
    console.log('🎉 Airlines data update completed successfully!');
    
    // Show some examples
    const examples = airlines.slice(0, 5);
    console.log('\n📋 Sample airlines:');
    examples.forEach(airline => {
      console.log(`  ${airline.iata || airline.icao} - ${airline.name} (${airline.country})`);
    });
    
  } catch (error) {
    console.error('❌ Failed to update airlines data:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { fetchAirlinesData, parseAirlinesData, saveAirlinesData }; 