# Aircraft Dashboard

Real-time aircraft tracking dashboard with statistics, charts, and live data from tar1090/Ultrafeeder.

## Features

- **Real-time Statistics**: Live dashboard with aircraft counts, types, countries, and airlines
- **Interactive Charts**: Configurable time ranges (2h, 8h, 24h, 1w, 1m) for all statistics
- **Current Aircraft**: Live table showing aircraft currently in range
- **Hourly Statistics**: Detailed breakdowns by hour with country and airline breakdowns
- **Country Detection**: Accurate country identification using ICAO hex code ranges
- **Airline Mapping**: Full airline names from OpenFlights database
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd adsb-dashboard
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Fetch airlines data:**
   ```bash
   npm run fetch-airlines
   ```

5. **Start the collector (in background):**
   ```bash
   npm run collector
   ```

6. **Start the dashboard:**
   ```bash
   npm run dev
   ```

7. **Visit the dashboard:**
   ```
   http://localhost:3000
   ```

## Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
DATABASE_URL="file:./data/aircraft.db"
ULTRAFEEDER_HOST="http://192.168.1.50:8080"
POLL_INTERVAL=10
DATA_RETENTION_DAYS=30
NODE_ENV=development
PORT=3000
```

### Data Sources

- **Ultrafeeder/tar1090**: Aircraft tracking data via HTTP API
- **OpenFlights**: Airline database for accurate airline names
- **ICAO Hex Ranges**: Country detection using official ICAO assignments

## Airlines Data Management

The dashboard uses the [OpenFlights airlines database](https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat) to provide accurate airline names instead of just codes.

### Manual Update

```bash
npm run fetch-airlines
```

### Automated Updates

Set up a daily cron job to keep airlines data current:

```bash
# Run the setup script (macOS/Linux)
chmod +x scripts/setup-cron.sh
./scripts/setup-cron.sh

# Or manually add to crontab
0 2 * * * cd /path/to/adsb-dashboard && npm run fetch-airlines >> logs/airlines-update.log 2>&1
```

### Data Structure

The airlines data is stored in `data/airlines.json` with the following structure:

```json
{
  "lastUpdated": "2025-07-22T22:10:58.409Z",
  "totalAirlines": 1255,
  "airlines": [...],
  "lookup": {
    "AXM": {"name": "AirAsia", "country": "Malaysia", ...},
    "MAS": {"name": "Malaysia Airlines", "country": "Malaysia", ...}
  }
}
```

### Testing Airlines Data

```bash
node scripts/test-airlines-simple.js
```

## Monitoring

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Data Collection

The collector runs continuously and:
- Fetches data from Ultrafeeder every 10 seconds
- Saves aircraft sightings to SQLite database
- Prevents duplicate entries
- Handles connection errors gracefully

### Logs

- **Collector logs**: Check terminal output
- **Airlines updates**: `logs/airlines-update.log`
- **Database**: `data/aircraft.db`

## Development

### Project Structure

```
adsb-dashboard/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── lib/                 # Utilities and database
│   ├── collector/           # Data collection service
│   └── contexts/           # React contexts
├── data/                   # Database and airlines data
├── scripts/                # Utility scripts
├── prisma/                 # Database schema
└── logs/                   # Application logs
```

### Database Schema

```sql
-- Aircraft sightings
AircraftSighting {
  id, hex, flight, registration, aircraftType,
  airline, country, countryCode, altitude,
  groundSpeed, distance, rssi, lat, lon,
  squawk, seenAt
}

-- Statistics snapshots
StatsSnapshot {
  id, totalFlights, totalAircraft, aircraftTypes,
  countries, airlines, messagesTotal, seenAt
}
```

### Key Components

- **TimeRangeContext**: Manages time range selection across dashboard
- **StatsCardsClient**: Fetches and displays dashboard statistics
- **ChartsWrapper**: Manages chart components with time range
- **CurrentAircraft**: Real-time aircraft table with filtering
- **HourlyStats**: Time-series charts for detailed analysis

## Deployment

### Docker

```bash
docker-compose up -d
```

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Run the collector:
   ```bash
   npm run collector
   ```

## Troubleshooting

### Common Issues

1. **No data appearing**: Check Ultrafeeder connection and collector logs
2. **Database errors**: Run `npm run db:push` to sync schema
3. **Airline codes only**: Run `npm run fetch-airlines` to get airline names
4. **Performance issues**: Check data retention settings and database size

### Logs and Debugging

- **Collector**: Check terminal output for connection issues
- **Database**: Use SQLite browser to inspect data
- **API**: Test endpoints with curl or browser dev tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 