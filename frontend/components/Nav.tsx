"use client";
import Link from "next/link";
import { useWallet } from "../lib/genlayer/wallet";
import { KeyRound, LogOut, Landmark } from "lucide-react";

export function Nav() {
  const { isConnected, address, connect, disconnect } = useWallet();

  return (
    <nav className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur border-b border-navy-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Landmark className="h-7 w-7 text-gold-500" />
          <span className="font-display text-xl font-bold tracking-wider text-gold-500">FIDUCIA</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
          <Link href="/funds" className="text-muted hover:text-parchment transition">My Funds</Link>
          <Link href="/funds/new" className="text-muted hover:text-parchment transition">Lodge Fund</Link>
          <Link href="/ledger" className="text-muted hover:text-parchment transition">Public Ledger</Link>
        </div>

        <div>
          {isConnected && address ? (
            <div className="flex items-center space-x-4">
              <span className="font-mono text-xs text-muted bg-navy-900 border border-navy-800 px-3 py-1.5 rounded-sm">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button 
                onClick={disconnect}
                className="text-muted hover:text-red-400 transition p-2"
                title="Disconnect Wallet"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="flex items-center space-x-2 border border-gold-500/50 hover:border-gold-500 text-gold-500 hover:bg-gold-500/10 px-4 py-2 text-xs tracking-wider uppercase font-semibold transition rounded-sm"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
