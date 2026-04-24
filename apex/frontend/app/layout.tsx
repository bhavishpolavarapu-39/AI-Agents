import type { Metadata } from 'next';

require('./globals.css');

export const metadata: Metadata = {
  title: 'APEX - Portfolio Intelligence Operating System',
  description: 'World-Class Portfolio Intelligence Operating System powered by advanced AI agents',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white" style={{ fontFamily: "'Inter', sans-serif", WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
        {children}
      </body>
    </html>
  );
}
