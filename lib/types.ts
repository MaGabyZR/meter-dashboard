export interface MeterReading {
  meterId: string;
  timestamp: string;
  cumulativeVolume: number;
}

export interface HourlyConsumption {
  meterId: string;
  hour: string;
  consumption: number;
  flag: 'normal' | 'gap_estimated' | 'counter_reset';
}

export interface MeterSummary {
  meterId: string;
  latestTimestamp: string;
  totalConsumption: number;
  status: 'active' | 'stale';
}
