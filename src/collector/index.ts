import { prisma } from '../lib/db'
import { UltrafeederStats, UltrafeederAircraft } from '../types/aircraft'
import { getCountryFromHex, extractAirlineFromFlight } from '../lib/countries'
import { getAirlineName } from '../lib/airlines'

const ULTRAFEEDER_HOST = process.env.ULTRAFEEDER_HOST || 'http://192.168.1.50:8080';
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '30000'); // 30 seconds
const DATA_RETENTION_DAYS = parseInt(process.env.DATA_RETENTION_DAYS || '30');

class AircraftCollector {
  private isRunning = false;

  async start() {
    console.log('🛫 Starting aircraft data collector...');
    this.isRunning = true;
    
    // Initial collection
    await this.collectData();
    
    // Set up interval
    const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }
      await this.collectData();
    }, POLL_INTERVAL);

    // Cleanup old data every hour
    setInterval(() => this.cleanupOldData(), 60 * 60 * 1000);
  }

  stop() {
    this.isRunning = false;
  }

  private async collectData() {
    try {
      console.log('📡 Collecting aircraft data...');
      
      const [statsResponse, aircraftResponse] = await Promise.all([
        fetch(`${ULTRAFEEDER_HOST}/data/stats.json`),
        fetch(`${ULTRAFEEDER_HOST}/data/aircraft.json`)
      ]);

      if (!statsResponse.ok || !aircraftResponse.ok) {
        throw new Error('Failed to fetch data from ultrafeeder');
      }

      const stats: UltrafeederStats = await statsResponse.json();
      const aircraftData: UltrafeederAircraft = await aircraftResponse.json();

      await this.saveStatsSnapshot(stats);
      await this.saveAircraftSightings(aircraftData);

      console.log(`✅ Saved ${aircraftData.aircraft.length} aircraft sightings`);
    } catch (error) {
      console.error('❌ Error collecting data:', error);
    }
  }

  private async saveStatsSnapshot(stats: UltrafeederStats) {
    await prisma.statsSnapshot.create({
      data: {
        aircraftWithPos: stats.aircraft_with_pos,
        aircraftWithoutPos: stats.aircraft_without_pos,
        messagesTotal: stats.last1min?.messages || 0,
        maxDistance: stats.total?.max_distance || 0,
        snapshotAt: new Date(stats.now * 1000)
      }
    });
  }

  private async saveAircraftSightings(data: UltrafeederAircraft) {
    const sightings = data.aircraft.map(aircraft => {
      const countryInfo = getCountryFromHex(aircraft.hex);
      const airlineCode = extractAirlineFromFlight(aircraft.flight || '');
      const airlineName = airlineCode !== 'Unknown' ? getAirlineName(airlineCode) : null;
      
      return {
        hex: aircraft.hex,
        flight: aircraft.flight?.trim() || null,
        registration: aircraft.r || null,
        aircraftType: aircraft.t || null,
        airline: airlineName,
        country: countryInfo.country !== 'Unknown' ? countryInfo.country : null,
        countryCode: countryInfo.code !== 'XX' ? countryInfo.code : null,
        altitude: aircraft.alt_baro || null,
        groundSpeed: aircraft.gs || null,
        track: aircraft.track || null,
        distance: aircraft.r_dst || null,
        rssi: aircraft.rssi || null,
        lat: aircraft.lat || null,
        lon: aircraft.lon || null,
        squawk: aircraft.squawk || null,
        seenAt: new Date(data.now * 1000)
      };
    });

    // Batch insert for better performance
    await prisma.aircraftSighting.createMany({
      data: sightings
    });
  }

  private async cleanupOldData() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DATA_RETENTION_DAYS);

    const deleted = await prisma.aircraftSighting.deleteMany({
      where: {
        seenAt: {
          lt: cutoffDate
        }
      }
    });

    console.log(`🧹 Cleaned up ${deleted.count} old aircraft sightings`);
  }
}

// Start collector if run directly
if (require.main === module) {
  const collector = new AircraftCollector();
  collector.start();

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('🛑 Shutting down collector...');
    collector.stop();
    process.exit(0);
  });
}

export default AircraftCollector; 