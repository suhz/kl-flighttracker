import fs from 'fs';
import path from 'path';

interface Airline {
  id: number;
  name: string;
  alias: string;
  iata: string;
  icao: string;
  callsign: string;
  country: string;
  active: boolean;
}

// Simplified structure - just the lookup object
type AirlinesData = Record<string, Airline>;

let airlinesData: AirlinesData | null = null;

export function loadAirlinesData(): AirlinesData {
  if (airlinesData) {
    return airlinesData;
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'airlines.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    airlinesData = parsedData;
    console.log(`✅ Loaded ${Object.keys(parsedData).length} airline codes from database`);
    return parsedData;
  } catch (error) {
    console.error('❌ Failed to load airlines database:', error);
    // Return empty structure instead of fallback
    const emptyData: AirlinesData = {};
    airlinesData = emptyData;
    return emptyData;
  }
}

export function getAirlineName(code: string): string {
  if (!code) return 'Unknown';
  
  const data = loadAirlinesData();
  const airline = data[code.toUpperCase()];
  
  if (airline) {
    return airline.name;
  }
  
  // Return the code itself if not found in our database
  return code;
}

export function getAirlineInfo(code: string): { name: string; country: string } {
  if (!code) return { name: 'Unknown', country: 'Unknown' };
  
  const data = loadAirlinesData();
  const airline = data[code.toUpperCase()];
  
  if (airline) {
    return {
      name: airline.name,
      country: airline.country
    };
  }
  
  // Fallback
  const name = getAirlineName(code);
  return {
    name,
    country: 'Unknown'
  };
}

export function getLastUpdated(): string {
  // Since we removed lastUpdated, return current date
  return new Date().toISOString();
} 