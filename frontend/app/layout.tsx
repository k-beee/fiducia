import type { Metadata } from 'next';
import { Cinzel, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Nav } from '@/components/Nav';
import { Atmosphere } from '@/components/Atmosphere';

const cinzel = Cinzel({ 
  subsets: ['latin'], 
  variable: '--font-cinzel', 
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'] 
});

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-jakarta', 
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'] 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-jetbrains', 
  display: 'swap' 
});

export const metadata: Metadata = { 
  title: 'Fiducia — The On-Chain Grant Trust Layer', 
  description: 'Neutral AI validators and escrow enforcing qualitative milestones on-chain.' 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased bg-navy-950 text-parchment font-sans`}>
        <Providers>
          <Atmosphere />
          <Nav />
          <div className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
