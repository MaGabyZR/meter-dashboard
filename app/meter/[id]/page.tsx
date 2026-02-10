import Link from 'next/link';
import { processReadings } from '@/lib/processor';
import { HourlyConsumption } from '@/lib/types';
import { ConsumptionChart } from '@/components/ConsumptionChart';
import { MeterTable } from '@/components/MeterTable';
import readingsData from '@/data/readings.json';

export function generateStaticParams() {
  const meterIds = [...new Set(readingsData.map(r => r.meterId))];
  return meterIds.map(id => ({ id }));
}

function getMeterData(meterId: string): HourlyConsumption[] {
  const processed = processReadings(readingsData);
  return processed
    .filter(r => r.meterId === meterId)
    .sort((a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime());
}

export default function MeterDetail({ params }: { params: { id: string } }) {
  const data = getMeterData(params.id);

  if (data.length === 0) {
    return (
      <>
        <div className="header">
          <h1>Meter Detail: {params.id}</h1>
        </div>
        <div className="container">
          <Link href="/" className="back-link">← Back to Fleet</Link>
          <div className="empty-state">
            <p>No data found for meter {params.id}</p>
            <p>This meter may not exist in the dataset.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="header">
        <h1>Meter Detail: {params.id}</h1>
      </div>
      <div className="container">
        <Link href="/" className="back-link">← Back to Fleet</Link>
        <ConsumptionChart data={data} />
        <MeterTable data={data} />
      </div>
    </>
  );
}
