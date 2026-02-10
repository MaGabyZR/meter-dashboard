import { processReadings } from '../lib/processor';
import { MeterReading } from '../lib/types';

describe('processReadings', () => {
  test('calculates delta between consecutive readings', () => {
    const readings: MeterReading[] = [
      { meterId: 'MTR-001', timestamp: '2025-02-05T10:00:00Z', cumulativeVolume: 1000 },
      { meterId: 'MTR-001', timestamp: '2025-02-05T11:00:00Z', cumulativeVolume: 1050 }
    ];

    const result = processReadings(readings);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      meterId: 'MTR-001',
      consumption: 50,
      flag: 'normal'
    });
  });

  test('handles gap estimation across multiple hours', () => {
    const readings: MeterReading[] = [
      { meterId: 'MTR-002', timestamp: '2025-02-05T10:03:00Z', cumulativeVolume: 100 },
      { meterId: 'MTR-002', timestamp: '2025-02-05T14:02:00Z', cumulativeVolume: 400 }
    ];

    const result = processReadings(readings);

    const gapRecords = result.filter(r => r.flag === 'gap_estimated');
    expect(gapRecords.length).toBeGreaterThan(1);
    
    const totalConsumption = gapRecords.reduce((sum, r) => sum + r.consumption, 0);
    expect(totalConsumption).toBeCloseTo(300, 1);
  });

  test('detects counter reset', () => {
    const readings: MeterReading[] = [
      { meterId: 'MTR-003', timestamp: '2025-02-05T12:00:00Z', cumulativeVolume: 500000 },
      { meterId: 'MTR-003', timestamp: '2025-02-05T13:00:00Z', cumulativeVolume: 12 }
    ];

    const result = processReadings(readings);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      meterId: 'MTR-003',
      consumption: 12,
      flag: 'counter_reset'
    });
  });

  test('removes duplicate timestamps', () => {
    const readings: MeterReading[] = [
      { meterId: 'MTR-001', timestamp: '2025-02-05T10:00:00Z', cumulativeVolume: 1000 },
      { meterId: 'MTR-001', timestamp: '2025-02-05T10:00:00Z', cumulativeVolume: 1000 },
      { meterId: 'MTR-001', timestamp: '2025-02-05T11:00:00Z', cumulativeVolume: 1050 }
    ];

    const result = processReadings(readings);

    expect(result).toHaveLength(1);
  });
});
