export interface Aircraft {
  hex: string;
  type: string;
  flight?: string;
  r?: string; // registration
  t?: string; // aircraft type
  desc?: string;
  alt_baro?: number;
  alt_geom?: number;
  gs?: number;
  track?: number;
  lat?: number;
  lon?: number;
  r_dst?: number; // distance from receiver
  squawk?: string;
  category?: string;
  messages?: number;
  seen?: number;
  rssi?: number;
}

export interface UltrafeederAircraft {
  now: number;
  messages: number;
  aircraft: Aircraft[];
}

export interface UltrafeederStats {
  now: number;
  aircraft_with_pos: number;
  aircraft_without_pos: number;
  last1min: {
    messages: number;
  };
  total: {
    max_distance: number;
  };
}

export interface DashboardStats {
  totalFlights: number;
  totalAircraft: number;
  aircraftTypes: number;
  countries: number;
  airlines: number;
  maxDistance: number;
}

export interface CountryInfo {
  country: string;
  code: string;
  flag: string;
} 