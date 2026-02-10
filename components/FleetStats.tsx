import { HourlyConsumption } from '@/lib/types';

interface FleetStatsProps {
  allRecords: HourlyConsumption[];
}

export function FleetStats({ allRecords }: FleetStatsProps) {
  const totalConsumption = allRecords.reduce((sum, r) => sum + r.consumption, 0);
  const gapEvents = allRecords.filter(r => r.flag === 'gap_estimated').length;
  const resetEvents = allRecords.filter(r => r.flag === 'counter_reset').length;
  const uniqueMeters = new Set(allRecords.map(r => r.meterId)).size;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total Meters</div>
        <div className="stat-value">{uniqueMeters}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Consumption</div>
        <div className="stat-value">{totalConsumption.toFixed(1)} gal</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Gap Events</div>
        <div className="stat-value">{gapEvents}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Reset Events</div>
        <div className="stat-value">{resetEvents}</div>
      </div>
    </div>
  );
}
