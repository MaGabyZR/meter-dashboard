# Meter Telemetry Dashboard

A Next.js application that processes water meter telemetry data and displays hourly consumption in a dashboard.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the URL shown in the terminal (typically [http://localhost:3000](http://localhost:3000), or the next available port if 3000 is in use)

The application should start without any surprises. All dependencies are standard Next.js packages, and the sample data is included in the repository.

## Deployment

### Quick Deploy to Vercel

The fastest way to deploy this application:

```bash
npm install -g vercel
vercel login
vercel --prod
```

Your app will be live at `https://your-project-name.vercel.app`

For detailed deployment instructions including GitHub integration and alternative platforms, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## How to Run Tests

Run the unit tests with:
```bash
npm test
```

The test suite covers the core processing logic in `lib/processor.ts`, including delta calculation, gap estimation, counter reset detection, duplicate removal, and 32-bit integer overflow handling. All 5 tests pass successfully.

## Features

### Core Requirements
- **Data Processing**: Pure TypeScript function that transforms raw meter readings into hourly consumption records
- **Delta Calculation**: Computes consumption between consecutive readings
- **Hourly Bucketing**: Groups consumption into hourly time windows
- **Gap Handling**: Distributes consumption evenly across multi-hour gaps with `gap_estimated` flag
- **Counter Reset Detection**: Identifies when meters reset to zero with `counter_reset` flag
- **Duplicate Removal**: Filters out readings with identical timestamps

### Bonus Features
- **Fleet Summary Stats**: Dashboard displays total meters, total consumption, gap events, and reset events
- **Filtering & Sorting**: Filter meters by status (all/active/stale) and sort by ID, consumption, or status
- **32-bit Integer Overflow**: Handles counter wrapping from 4,294,967,295 back to 0
- **Empty States**: User-friendly messages when no data is available or filters return no results

## Project Structure

```
meter-dashboard/
├── app/
│   ├── page.tsx                    // Fleet overview page
│   ├── meter/[id]/
│   │   └── page.tsx                // Meter detail page
│   ├── layout.tsx                  // Root layout
│   └── globals.css                 // Global styles
├── components/
│   ├── MeterTable.tsx              // Hourly records table component
│   ├── ConsumptionChart.tsx        // Bar chart component
│   └── FleetStats.tsx              // Summary statistics component
├── lib/
│   ├── processor.ts                // Core data processing logic (pure TypeScript)
│   └── types.ts                    // TypeScript interfaces
├── data/
│   └── readings.json               // Sample meter readings
├── __tests__/
│   └── processor.test.ts           // Unit tests for processor
├── package.json
├── tsconfig.json
├── tsconfig.test.json
├── jest.config.js
└── README.md
```

## Design Assumption

An assumption that I made was about handling missing data. 
I approached it by spreading the usage evenly. 
If a meter reading is missing for several hours or arrives with gaps, the system takes the total usage during that "gap" and divides it equally across each hour. 
This assumes a steady usage rate while the meter was “offline” or had a gap period.
Why? Without extra information that can give more context, like typical daily habits, the weather, or when people are usually in the building, I thought splitting the usage evenly is the fairest and most logical way to handle the data.
For this project, I chose a straightforward approach that is easy to understand, reliable, and keeps the focus on building a clean, working, and testable application.
