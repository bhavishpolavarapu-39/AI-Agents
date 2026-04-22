import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PROJECT OS',
  description: 'PROJECT Operating System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">{children}</body>
    </html>
  );
}
