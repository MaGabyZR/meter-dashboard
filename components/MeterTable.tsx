import { HourlyConsumption } from '@/lib/types';

interface MeterTableProps {
  data: HourlyConsumption[];
}

export function MeterTable({ data }: MeterTableProps) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem' }}>Hourly Records</h2>
      <table>
        <thead>
          <tr>
            <th>Hour</th>
            <th>Consumption (gal)</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, i) => (
            <tr key={i}>
              <td>{new Date(record.hour).toLocaleString()}</td>
              <td>{record.consumption.toFixed(2)}</td>
              <td>
                <span className={`flag-badge flag-${record.flag}`}>
                  {record.flag}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
