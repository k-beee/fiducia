"use client";
import Link from "next/link";
import { useFundsList } from "../../lib/hooks/useFiducia";
import { useWallet } from "../../lib/genlayer/wallet";
import { Landmark, ArrowRight, Layers } from "lucide-react";
import { useState } from "react";

export default function Funds() {
  const { isConnected, address, connect } = useWallet();
  const [activeTab, setActiveTab] = useState<"grantee" | "funder">("grantee");
  const { data: funds, isLoading } = useFundsList(activeTab);

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 space-y-6">
        <Landmark className="h-12 w-12 text-gold-500 mx-auto" />
        <h1 className="font-display text-3xl font-bold">Access Your Escrows</h1>
        <p className="text-muted text-sm font-light">Connect your browser wallet to view funds you are funding or executing.</p>
        <button onClick={connect} className="bg-gold-500 hover:bg-gold-600 text-navy-950 px-8 py-3 rounded-sm font-bold uppercase tracking-wider text-xs transition">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">My Escrows</h1>
          <p className="text-muted text-sm font-light">View active grants and milestone disbursements.</p>
        </div>
        <Link href="/funds/new" className="bg-gold-500 hover:bg-gold-600 text-navy-950 px-6 py-2.5 rounded-sm font-bold uppercase tracking-wider text-xs transition text-center">
          Lodge New Fund
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-800">
        <button
          onClick={() => setActiveTab("grantee")}
          className={`px-6 py-3 text-sm tracking-wide border-b-2 font-medium transition ${activeTab === "grantee" ? "border-gold-500 text-gold-500" : "border-transparent text-muted hover:text-parchment"}`}
        >
          Executing (Grantee)
        </button>
        <button
          onClick={() => setActiveTab("funder")}
          className={`px-6 py-3 text-sm tracking-wide border-b-2 font-medium transition ${activeTab === "funder" ? "border-gold-500 text-gold-500" : "border-transparent text-muted hover:text-parchment"}`}
        >
          Funding (Funder)
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted font-light">Fetching on-chain records...</div>
      ) : funds && funds.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {funds.map((fund) => (
            <Link
              key={fund.fund_id}
              href={`/funds/${fund.fund_id}`}
              className="bg-navy-800 border border-navy-700 p-6 rounded-sm block relative group hover:border-gold-500/30 transition"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-500 scale-x-0 group-hover:scale-x-100 transition duration-300" />
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm ${
                  fund.status === "ACTIVE" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                  fund.status === "CLAWBACK_PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-navy-700 text-muted border border-navy-600"
                }`}>
                  {fund.status}
                </span>
                <span className="font-mono text-sm font-bold text-gold-500">
                  {(fund.total_amount / 10**18).toFixed(1)} GEN
                </span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2 text-parchment group-hover:text-gold-500 transition">{fund.title}</h3>
              <div className="flex items-center text-xs text-muted space-x-4 mb-4">
                <span className="flex items-center"><Layers className="h-3.5 w-3.5 mr-1 text-gold-500/50" /> Milestone {fund.current_milestone + 1}/{fund.milestones.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gold-500 border-t border-navy-700/50 pt-4">
                <span>View Escrow Ledger</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-navy-800 rounded-sm">
          <p className="text-muted font-light text-sm mb-4">No escrows found on-chain for this address.</p>
          <Link href="/funds/new" className="text-xs uppercase font-bold tracking-wider text-gold-500 hover:text-gold-400 transition">
            Lodge Your First Fund
          </Link>
        </div>
      )}
    </div>
  );
}
