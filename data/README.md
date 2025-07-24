# ADS-B Dashboard Databases

This directory contains the curated databases used by the ADS-B dashboard.

## Structure

- `airlines.json` - Lookup object containing all airlines indexed by IATA/ICAO codes
- `aircraft-types.json` - Aircraft type database with ICAO codes and full names
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

---

# Aircraft Types Database

The `aircraft-types.json` file contains aircraft type mappings from ICAO codes to full aircraft names.

## Source & Attribution

- **Source**: [VICE (Visual ICAO Enhancement) Project](https://github.com/mmp/vice)
- **Data URL**: https://raw.githubusercontent.com/mmp/vice/refs/heads/master/resources/openscope-aircraft.json
- **License**: GPL-3.0
- **Project**: OpenScope Aircraft Database from the VICE project

## Format

The file contains metadata and a lookup object:

```json
{
  "_metadata": {
    "source": "https://raw.githubusercontent.com/mmp/vice/refs/heads/master/resources/openscope-aircraft.json",
    "sourceProject": "VICE (Visual ICAO Enhancement) - OpenScope Aircraft Database", 
    "license": "GPL-3.0",
    "totalAircraftTypes": 325
  },
  "lookup": {
    "B738": {
      "name": "Boeing 737-800",
      "icao": "B738"
    },
    "A320": {
      "name": "Airbus A320",
      "icao": "A320"
    }
  }
}
```

## Usage

The aircraft types database automatically maps ICAO aircraft type codes to readable names:

- `B738` → "Boeing 737-800"
- `A320` → "Airbus A320" 
- `A388` → "Airbus A380-800"

## Updating

To update the aircraft types database:

1. Download the latest data from the source URL
2. Extract only the `name` and `icao` fields
3. Update the metadata with the new date
4. Maintain the GPL-3.0 license attribution

## Stats

- **Current entries**: 325 aircraft types
- **File size**: ~67KB
- **Last updated**: 2025-07-24 