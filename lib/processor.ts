import { MeterReading, HourlyConsumption } from './types';

export function processReadings(readings: MeterReading[]): HourlyConsumption[] {
  const result: HourlyConsumption[] = [];
  const byMeter = groupByMeter(readings);

  for (const [meterId, meterReadings] of Object.entries(byMeter)) {
    const sorted = meterReadings.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Remove duplicates
    const unique = removeDuplicates(sorted);

    for (let i = 1; i < unique.length; i++) {
      const prev = unique[i - 1];
      const curr = unique[i];

      const prevTime = new Date(prev.timestamp);
      const currTime = new Date(curr.timestamp);
      const hoursDiff = (currTime.getTime() - prevTime.getTime()) / (1000 * 60 * 60);

      // Counter reset detection
      if (curr.cumulativeVolume < prev.cumulativeVolume) {
        result.push({
          meterId,
          hour: toHourBucket(currTime),
          consumption: curr.cumulativeVolume,
          flag: 'counter_reset'
        });
        continue;
      }

      const delta = curr.cumulativeVolume - prev.cumulativeVolume;

      // Normal case: readings in same or adjacent hours
      if (hoursDiff <= 1.5) {
        result.push({
          meterId,
          hour: toHourBucket(prevTime),
          consumption: delta,
          flag: 'normal'
        });
      } else {
        // Gap handling: distribute consumption across hours
        const startHour = new Date(prevTime);
        startHour.setMinutes(0, 0, 0);
        
        const endHour = new Date(currTime);
        endHour.setMinutes(0, 0, 0);

        const buckets: string[] = [];
        let current = new Date(startHour);
        
        while (current <= endHour) {
          buckets.push(toHourBucket(current));
          current.setHours(current.getHours() + 1);
        }

        const perHour = delta / buckets.length;

        for (const bucket of buckets) {
          result.push({
            meterId,
            hour: bucket,
            consumption: perHour,
            flag: 'gap_estimated'
          });
        }
      }
    }
  }

  return result;
}

function groupByMeter(readings: MeterReading[]): Record<string, MeterReading[]> {
  return readings.reduce((acc, reading) => {
    if (!acc[reading.meterId]) {
      acc[reading.meterId] = [];
    }
    acc[reading.meterId].push(reading);
    return acc;
  }, {} as Record<string, MeterReading[]>);
}

function removeDuplicates(readings: MeterReading[]): MeterReading[] {
  const seen = new Set<string>();
  return readings.filter(r => {
    if (seen.has(r.timestamp)) return false;
    seen.add(r.timestamp);
    return true;
  });
}

function toHourBucket(date: Date): string {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 19) + 'Z';
}
