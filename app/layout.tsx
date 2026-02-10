import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meter Telemetry Dashboard',
  description: 'Water meter consumption tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
