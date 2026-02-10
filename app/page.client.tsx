'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MeterSummary } from '@/lib/types';

interface FleetTableProps {
  initialMeters: MeterSummary[];
}

export function FleetTable({ initialMeters }: FleetTableProps) {
  const [meters, setMeters] = useState(initialMeters);
  const [sortBy, setSortBy] = useState<'id' | 'consumption' | 'status'>('id');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'stale'>('all');

  const filteredMeters = meters.filter(m => 
    filterStatus === 'all' || m.status === filterStatus
  );

  const sortedMeters = [...filteredMeters].sort((a, b) => {
    if (sortBy === 'id') return a.meterId.localeCompare(b.meterId);
    if (sortBy === 'consumption') return b.totalConsumption - a.totalConsumption;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <>
      <div className="filters">
        <div>
          <label>Filter by Status: </label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="stale">Stale</option>
          </select>
        </div>
        <div>
          <label>Sort by: </label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="id">Meter ID</option>
            <option value="consumption">Total Consumption</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {sortedMeters.length === 0 ? (
        <div className="empty-state">
          <p>No meters found matching the selected filters.</p>
        </div>
      ) : (
        <div className="meter-grid">
          {sortedMeters.map(meter => (
            <Link 
              key={meter.meterId} 
              href={`/meter/${meter.meterId}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card">
                <div className="meter-id">{meter.meterId}</div>
                <div className="meter-info">
                  <div>Latest: {new Date(meter.latestTimestamp).toLocaleString()}</div>
                  <div>Total Consumption: {meter.totalConsumption.toFixed(1)} gal</div>
                </div>
                <span className={`status ${meter.status}`}>
                  {meter.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
