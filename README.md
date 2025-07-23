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
- **Dark Mode**: Full dark mode support with theme selector
- **Aircraft Coordinates**: Clickable coordinates with Google Maps integration

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Ultrafeeder/tar1090 running and accessible

### 1. Clone and Setup
```bash
git clone <repository-url>
cd adsb-dashboard
```

### 2. Run Setup Script (Recommended)
```bash
# This will do everything automatically
./setup.sh
```

The setup script will:
- ✅ Check Docker installation
- ✅ Create data directory
- ✅ Create .env file with default settings
- ✅ Build and start containers
- ✅ Initialize database
- ✅ Fetch airlines data
- ✅ Show status and next steps

### 3. Manual Setup (Alternative)
If you prefer to do it manually:

```bash
# Create data directory
mkdir -p data

# Create .env file
cp env.example .env

# Edit .env with your Ultrafeeder settings
nano .env

# Start containers
docker compose up -d --build

# Initialize database
docker compose exec collector npx prisma db push

# Airlines data is included (curated database)
# No additional setup required
```

### 4. Access Dashboard
Open your browser and visit: `http://localhost:3000`

## Docker Options

### Run Both Services (Dashboard + Collector)
```bash
docker compose up -d
```

### Run Dashboard Only
```bash
# Stop collector and run only dashboard
docker compose stop collector
docker compose up dashboard -d
```

### Run Collector Only
```bash
docker compose up collector -d
```

### View Logs
```bash
# All services
docker compose logs -f

# Dashboard only
docker compose logs -f dashboard

# Collector only
docker compose logs -f collector
```

### Stop Services
```bash
docker compose down
```

### Rebuild and Restart
```bash
docker compose down
docker compose up -d --build
```

### Migrate Airlines Data
```bash
# If you have existing data with airline names, migrate to codes:
docker compose exec dashboard node scripts/migrate-airline-data.js
```

### Update Installation
```bash
# Update to latest version
./update.sh
```
docker compose up -d --build
```

## Manual Setup (Alternative)

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

4. **Airlines data is included (curated database)**
   - No additional setup required
   - Run migration if you have existing data:

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
POLL_INTERVAL=30000
DATA_RETENTION_DAYS=30
NODE_ENV=production
PORT=3000
```

### Docker Configuration

The project includes multiple Docker Compose files:

- `docker-compose.yml` - Full setup (dashboard + collector)
- `docker-compose.dashboard.yml` - Dashboard only

### Data Sources

- **Ultrafeeder/tar1090**: Aircraft tracking data via HTTP API
- **Curated Airlines Database**: Comprehensive airline database for accurate names
- **ICAO Hex Ranges**: Country detection using official ICAO assignments

## Airlines Data Management

The dashboard uses a curated airlines database stored in `data/airlines.json` to provide accurate airline names instead of just codes. This includes:

- Major international airlines (Air France, British Airways, Lufthansa, etc.)
- Regional airlines and low-cost carriers
- Cargo airlines (FedEx, DHL, etc.)  
- Malaysian government aircraft (with Malay names)

### Data Migration

If you have existing data with airline names stored in the database, migrate to the new code-based system:

```bash
# Run the migration script
docker compose exec dashboard node scripts/migrate-airline-data.js
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
- Fetches data from Ultrafeeder every 30 seconds (configurable)
- Saves aircraft sightings to SQLite database
- Prevents duplicate entries
- Handles connection errors gracefully

### Logs

- **Collector logs**: Check terminal output or `docker compose logs collector`
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

### Docker (Recommended)

```bash
# Full deployment
docker compose up -d

# Dashboard only
docker compose -f docker-compose.dashboard.yml up -d
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

### Docker Issues

1. **Container restarting**: Check logs with `docker compose logs collector`
2. **Database permission errors**: Run `docker compose exec dashboard chown -R nextjs:nodejs /app/data`
3. **Build failures**: Ensure Docker has enough memory and disk space
4. **Port conflicts**: Change port in docker-compose.yml if 3000 is in use

### Common Issues

1. **No data appearing**: Check Ultrafeeder connection and collector logs
2. **Database errors**: Run `npm run db:push` to sync schema
3. **Airline codes only**: Check that `data/airlines.json` exists and run migration if needed
4. **Performance issues**: Check data retention settings and database size

### Logs and Debugging

- **Collector**: Check terminal output for connection issues
- **Database**: Use SQLite browser to inspect data
- **API**: Test endpoints with curl or browser dev tools
- **Docker logs**: `docker compose logs -f [service-name]`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 