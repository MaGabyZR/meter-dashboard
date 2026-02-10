import { HourlyConsumption } from '@/lib/types';

interface ConsumptionChartProps {
  data: HourlyConsumption[];
}

export function ConsumptionChart({ data }: ConsumptionChartProps) {
  const maxConsumption = Math.max(...data.map(d => d.consumption));

  return (
    <div className="chart-container">
      <h2 style={{ marginBottom: '1rem' }}>Hourly Consumption</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px' }}>
        {data.map((record, i) => {
          const height = (record.consumption / maxConsumption) * 180;
          const color = record.flag === 'normal' ? '#4caf50' : 
                       record.flag === 'gap_estimated' ? '#ff9800' : '#e91e63';
          
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${height}px`,
                backgroundColor: color,
                minWidth: '20px',
                position: 'relative'
              }}
              title={`${new Date(record.hour).toLocaleString()}: ${record.consumption.toFixed(1)} gal (${record.flag})`}
            />
          );
        })}
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
        <span style={{ marginRight: '1rem' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#4caf50', marginRight: '4px' }}></span>
          Normal
        </span>
        <span style={{ marginRight: '1rem' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ff9800', marginRight: '4px' }}></span>
          Gap Estimated
        </span>
        <span>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#e91e63', marginRight: '4px' }}></span>
          Counter Reset
        </span>
      </div>
    </div>
  );
}
