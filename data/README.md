# Airlines Database

This directory contains the curated airlines database used by the ADS-B dashboard.

## Structure

- `airlines.json` - Lookup object containing all airlines indexed by IATA/ICAO codes
- `aircraft.db` - SQLite database containing aircraft sighting data

## Airlines Database Format

The `airlines.json` file contains a simple lookup object:

```json
{
  "MAS": {
    "id": 3378,
    "name": "Malaysia Airlines",
    "alias": "MAS",
    "iata": "MH",
    "icao": "MAS",
    "callsign": "MALAYSIAN",
    "country": "Malaysia",
    "active": true
  },
  "POLIS": {
    "id": 90001,
    "name": "Polis Diraja Malaysia",
    "alias": "Royal Malaysian Police",
    "iata": "",
    "icao": "POLIS",
    "callsign": "POLIS",
    "country": "Malaysia",
    "active": true
  }
}
```

## Adding New Airlines

To add a new airline, edit `airlines.json` directly:

1. Choose an unused ID (use 90000+ for custom entries)
2. Add the airline with both IATA and ICAO codes as keys
3. Follow the existing format

Example - adding a new airline:
```json
{
  "XYZ": {
    "id": 90014,
    "name": "Example Airlines",
    "alias": "Example Air",
    "iata": "EX",
    "icao": "XYZ",
    "callsign": "EXAMPLE",
    "country": "Malaysia",
    "active": true
  },
  "EX": {
    "id": 90014,
    "name": "Example Airlines",
    "alias": "Example Air", 
    "iata": "EX",
    "icao": "XYZ",
    "callsign": "EXAMPLE",
    "country": "Malaysia",
    "active": true
  }
}
```

Note: Add entries for both IATA and ICAO codes if available.

## Government Aircraft

Government aircraft use special callsigns and are mapped accordingly:

- `POLIS` - Polis Diraja Malaysia
- `BOMBA` - Bomba dan Penyelamat Malaysia  
- `TUDM`, `RMAF`, `PUTRA` - Royal Malaysian Air Force
- `TLDM` - Royal Malaysian Navy
- `APMM`, `MMEA` - Maritime agencies

## Database Stats

- **Current entries**: ~2,100 airline codes
- **File size**: ~394KB
- **Last updated**: Maintained manually 