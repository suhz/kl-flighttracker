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

interface AirlinesData {
  lastUpdated: string;
  totalAirlines: number;
  airlines: Airline[];
  lookup: Record<string, Airline>;
}

let airlinesData: AirlinesData | null = null;

export function loadAirlinesData(): AirlinesData {
  if (airlinesData) {
    return airlinesData;
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'airlines.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    airlinesData = JSON.parse(rawData);
    return airlinesData;
  } catch (error) {
    console.warn('⚠️  Airlines data not found, using fallback mapping');
    return {
      lastUpdated: new Date().toISOString(),
      totalAirlines: 0,
      airlines: [],
      lookup: {}
    };
  }
}

export function getAirlineName(code: string): string {
  if (!code) return 'Unknown';
  
  const data = loadAirlinesData();
  const airline = data.lookup[code.toUpperCase()];
  
  if (airline) {
    return airline.name;
  }
  
  // Fallback to common airlines if data not available
  const fallbackAirlines: Record<string, string> = {
    'AXM': 'AirAsia',
    'MAS': 'Malaysia Airlines',
    'SIA': 'Singapore Airlines',
    'MXD': 'Malindo Air',
    'UAE': 'Emirates',
    'TGW': 'Tiger Airways',
    'XAX': 'AirAsia X',
    'QTR': 'Qatar Airways',
    'CES': 'China Eastern Airlines',
    'IGO': 'IndiGo',
    'AK': 'AirAsia',
    'MH': 'Malaysia Airlines',
    'SQ': 'Singapore Airlines',
    'OD': 'Malindo Air',
    'EK': 'Emirates',
    'TR': 'Tiger Airways',
    'D7': 'AirAsia X',
    'QR': 'Qatar Airways',
    'MU': 'China Eastern Airlines',
    '6E': 'IndiGo'
  };
  
  return fallbackAirlines[code.toUpperCase()] || code;
}

export function getAirlineInfo(code: string): { name: string; country: string } {
  if (!code) return { name: 'Unknown', country: 'Unknown' };
  
  const data = loadAirlinesData();
  const airline = data.lookup[code.toUpperCase()];
  
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
  const data = loadAirlinesData();
  return data.lastUpdated;
} 