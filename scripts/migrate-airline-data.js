#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Map of airline names to codes for migration
const airlineNameToCode = {
  'Malindo Air': 'MXD',
  'Batik Air': 'MXD',
  'Malaysia Airlines': 'MAS',
  'AirAsia': 'AXM',
  'Singapore Airlines': 'SIA',
  'Emirates': 'UAE',
  'Tiger Airways': 'TGW',
  'AirAsia X': 'XAX',
  'Qatar Airways': 'QTR',
  'China Eastern Airlines': 'CES',
  'IndiGo': 'IGO',
  'VistaJet': 'VJT',
  'MJets Air': 'KXP',
  'MJets': 'KXP',
  'Polis Diraja Malaysia': 'POLIS',
  'Bomba dan Penyelamat Malaysia': 'BOMBA',
  'Agensi Penguatkuasaan Maritim Malaysia': 'APMM',
  'Malaysian Maritime Enforcement Agency': 'MMEA',
  'Tentera Udara Diraja Malaysia': 'TUDM',
  'Tentera Laut Diraja Malaysia': 'TLDM',
  'Republic of Singapore Air Force': 'RSAF',
  'Royal Thai Air Force': 'RTAF',
  'Japan Air Self-Defense Force': 'JASDF',
  'Royal Australian Air Force': 'RAAF',
  'Royal New Zealand Air Force': 'RZNAF'
};

async function migrateAirlineData() {
  console.log('🛫 Starting airline data migration...');
  
  try {
    // Get all unique airline names from the database
    const uniqueAirlines = await prisma.aircraftSighting.findMany({
      select: { airline: true },
      where: { airline: { not: null } },
      distinct: ['airline']
    });
    
    console.log(`📊 Found ${uniqueAirlines.length} unique airline entries`);
    
    let migrated = 0;
    let skipped = 0;
    
    for (const { airline } of uniqueAirlines) {
      if (!airline) continue;
      
      const airlineCode = airlineNameToCode[airline];
      
      if (airlineCode) {
        console.log(`🔄 Migrating: "${airline}" -> "${airlineCode}"`);
        
        const result = await prisma.aircraftSighting.updateMany({
          where: { airline: airline },
          data: { airline: airlineCode }
        });
        
        console.log(`   ✅ Updated ${result.count} records`);
        migrated += result.count;
      } else {
        console.log(`⚠️  Skipping unknown airline: "${airline}"`);
        skipped++;
      }
    }
    
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Migrated: ${migrated} records`);
    console.log(`⚠️  Skipped: ${skipped} unknown airlines`);
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateAirlineData(); 