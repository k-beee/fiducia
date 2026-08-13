import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Nav } from '@/components/Nav';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = { 
  title: 'Fiducia — The On-Chain Grant Trust Layer', 
  description: 'Neutral AI validators and escrow enforcing qualitative milestones on-chain.' 
};

function StarField() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,155,180,0.04) 0%, transparent 40%), #0B1426` }}>
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
        <line x1="200" y1="100" x2="350" y2="200" stroke="#8B9BB4" strokeWidth="0.5" />
        <line x1="350" y1="200" x2="500" y2="150" stroke="#8B9BB4" strokeWidth="0.5" />
        <line x1="500" y1="150" x2="700" y2="280" stroke="#8B9BB4" strokeWidth="0.5" />
        <line x1="700" y1="280" x2="900" y2="200" stroke="#8B9BB4" strokeWidth="0.5" />
        <circle cx="200" cy="100" r="1.5" fill="#C9A84C" />
        <circle cx="350" cy="200" r="1" fill="#8B9BB4" />
        <circle cx="500" cy="150" r="2" fill="#C9A84C" opacity="0.7" />
        <circle cx="700" cy="280" r="1.5" fill="#8B9BB4" />
      </svg>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-navy-950 text-parchment font-sans`}>
        <Providers>
          <StarField />
          <Nav />
          <div className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
