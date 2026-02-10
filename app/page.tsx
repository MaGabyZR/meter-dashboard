import Link from 'next/link';
import { processReadings } from '@/lib/processor';
import { MeterSummary } from '@/lib/types';
import { FleetStats } from '@/components/FleetStats';
import { FleetTable } from './page.client';
import readingsData from '@/data/readings.json';

function getMeterSummaries(): MeterSummary[] {
  const processed = processReadings(readingsData);
  const meterMap = new Map<string, MeterSummary>();

  // Get latest timestamp from raw data
  const latestByMeter = new Map<string, string>();
  for (const reading of readingsData) {
    const current = latestByMeter.get(reading.meterId);
    if (!current || reading.timestamp > current) {
      latestByMeter.set(reading.meterId, reading.timestamp);
    }
  }

  // Calculate total consumption per meter
  for (const record of processed) {
    const existing = meterMap.get(record.meterId);
    if (existing) {
      existing.totalConsumption += record.consumption;
    } else {
      meterMap.set(record.meterId, {
        meterId: record.meterId,
        latestTimestamp: latestByMeter.get(record.meterId) || '',
        totalConsumption: record.consumption,
        status: 'active'
      });
    }
  }

  // Determine status based on latest reading
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  for (const summary of meterMap.values()) {
    const latestTime = new Date(summary.latestTimestamp);
    summary.status = latestTime > twoHoursAgo ? 'active' : 'stale';
  }

  return Array.from(meterMap.values()).sort((a, b) => 
    a.meterId.localeCompare(b.meterId)
  );
}

export default function FleetOverview() {
  const meters = getMeterSummaries();
  const allRecords = processReadings(readingsData);

  return (
    <>
      <div className="header">
        <h1>Fleet Overview</h1>
      </div>
      <div className="container">
        <FleetStats allRecords={allRecords} />
        <FleetTable initialMeters={meters} />
      </div>
    </>
  );
}
