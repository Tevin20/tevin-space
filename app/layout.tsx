import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tevin Space - The stuff worth clicking on',
  description: 'Curated deals and gear I actually use. Affiliate links.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Tevin Space',
    description: 'Curated deals and gear I actually use.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-tevin-bg text-tevin-text">
        <main>{children}</main>
      </body>
    </html>
  );
}
