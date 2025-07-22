#!/usr/bin/env node

const { getAirlineName, getAirlineInfo } = require('../src/lib/airlines.ts');

console.log('🧪 Testing airline mapping...\n');

const testCodes = ['AXM', 'MAS', 'SIA', 'MXD', 'UAE', 'TGW', 'XAX', 'QTR', 'CES', 'IGO'];

testCodes.forEach(code => {
  const name = getAirlineName(code);
  const info = getAirlineInfo(code);
  console.log(`${code} -> ${name} (${info.country})`);
});

console.log('\n✅ Test completed!'); 