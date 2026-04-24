import type { Metadata } from 'next';

require('./globals.css');

export const metadata: Metadata = {
  title: 'Operating System',
  description: 'AI-powered operating system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">{children}</body>
    </html>
  );
}
