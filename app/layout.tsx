import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'OpsFlow | IT Helpdesk & Infrastructure Ticketing',
  description: 'Enterprise IT Helpdesk & Infrastructure Ticketing System featuring real-time ticket management, asset directory, and telemetry logs.',
  openGraph: {
    title: 'OpsFlow | IT Helpdesk & Infrastructure Ticketing',
    description: 'Enterprise IT Helpdesk & Infrastructure Ticketing System featuring real-time ticket management, asset directory, and telemetry logs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpsFlow | IT Helpdesk & Infrastructure Ticketing',
    description: 'Enterprise IT Helpdesk & Infrastructure Ticketing System featuring real-time ticket management, asset directory, and telemetry logs.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-blue-600/30 selection:text-blue-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
