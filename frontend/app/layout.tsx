import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = { title: 'Fiducia', description: 'The On-Chain Grant Trust Layer' };

function StarField() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,155,180,0.04) 0%, transparent 40%), #0B1426` }}>
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
        <line x1="200" y1="100" x2="350" y2="200" stroke="#8B9BB4" strokeWidth="0.5" />
        <circle cx="200" cy="100" r="1.5" fill="#C9A84C" />
      </svg>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <StarField />
        {children}
      </body>
    </html>
  );
}
