"use client";
import Link from "next/link";
import { useProtocolStats } from "../lib/hooks/useFiducia";
import { Landmark, ShieldAlert, Award, FileSpreadsheet } from "lucide-react";

export default function Home() {
  const { data: stats, isLoading } = useProtocolStats();

  const formattedStats = [
    { label: "Active Escrows", value: stats?.live_fund_count ?? 0 },
    { label: "Total Funds Lodged", value: `${(Number(stats?.total_locked_wei ?? 0) / 10**18).toFixed(1)} GEN` },
    { label: "Capital Released", value: `${(Number(stats?.total_released_wei ?? 0) / 10**18).toFixed(1)} GEN` },
    { label: "Reclaimed Capital", value: `${(Number(stats?.total_reclaimed_wei ?? 0) / 10**18).toFixed(1)} GEN` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="text-xs uppercase tracking-widest text-gold-500 font-semibold">ON-CHAIN GRANT STEWARDSHIP</div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight text-parchment">
          Grants that account for themselves.
        </h1>
        <p className="text-lg text-muted font-light leading-relaxed">
          The funder locks the capital in milestone escrow. The grantee submits progress narrative plus evidence. Neutral AI validators fetch and rule each milestone — releasing capital only on proof.
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <Link href="/funds/new" className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-8 py-3 rounded-sm tracking-wider uppercase text-xs transition">
            Lodge a Fund
          </Link>
          <Link href="/ledger" className="border border-navy-700 hover:border-gold-500 text-parchment font-semibold px-8 py-3 rounded-sm tracking-wider uppercase text-xs transition">
            Audit Ledger
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {formattedStats.map((item, idx) => (
          <div key={idx} className="bg-navy-800 border border-navy-700 p-6 rounded-sm text-center relative overflow-hidden group hover:border-gold-500/30 transition">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-500 scale-x-0 group-hover:scale-x-100 transition duration-300" />
            <div className="font-display text-3xl font-bold text-gold-500 mb-1">
              {isLoading ? "..." : item.value}
            </div>
            <div className="text-xs text-muted font-medium uppercase tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Accountability mechanics */}
      <div className="space-y-12">
        <h2 className="font-display text-3xl font-bold text-center text-gold-500">The Accountability Framework</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm space-y-4">
            <div className="p-3 bg-navy-700/50 w-fit text-gold-500"><Landmark className="h-6 w-6" /></div>
            <h3 className="font-display text-xl font-bold">1. Locked Milestone Escrow</h3>
            <p className="text-sm text-muted font-light leading-relaxed">
              Escrow is split into equal tranches across 2-6 milestones. Rounded remainder dust is absorbed by the final milestone so no capital gets trapped.
            </p>
          </div>
          <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm space-y-4">
            <div className="p-3 bg-navy-700/50 w-fit text-gold-500"><ShieldAlert className="h-6 w-6" /></div>
            <h3 className="font-display text-xl font-bold">2. Tri-Strike Rejection & Clawback</h3>
            <p className="text-sm text-muted font-light leading-relaxed">
              Three consecutive FAILED verdicts auto-trigger CLAWBACK_PENDING. Unreleased funds return to the funder after a short challenge grace window.
            </p>
          </div>
          <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm space-y-4">
            <div className="p-3 bg-navy-700/50 w-fit text-gold-500"><Award className="h-6 w-6" /></div>
            <h3 className="font-display text-xl font-bold">3. Bonded Second-Round Challenge</h3>
            <p className="text-sm text-muted font-light leading-relaxed">
              Grantees can challenge a FAILED ruling once by posting a 2% bond. If overturn is successful, bond is refunded; if upheld, bond is forfeited to the funder.
            </p>
          </div>
        </div>
      </div>

      {/* Dimensions section */}
      <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-500" />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold leading-tight">AI Validator Panel Evaluation</h2>
            <p className="text-sm text-muted leading-relaxed font-light">
              Every dispatch is evaluated by a consensus panel of GenLayer AI validators on four structured dimensions. To receive a PASSED verdict, the dispatch must hit the baseline in all dimensions and contain no critical failures.
            </p>
            <div className="space-y-3 font-mono text-xs text-gold-400">
              <p>✓ EXECUTION QUALITY: EXCELLENT | SATISFACTORY | INSUFFICIENT</p>
              <p>✓ PROOF STRENGTH: COMPELLING | ADEQUATE | MARGINAL | ABSENT</p>
              <p>✓ BUDGET FIDELITY: ON_TRACK | PARTIAL | DIVERTED | UNACCOUNTED</p>
              <p>✓ IMPACT VERACITY: DEMONSTRATED | PLAUSIBLE | UNSUBSTANTIATED</p>
            </div>
          </div>
          <div className="border border-navy-700 p-6 bg-navy-900 rounded-sm">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">Baseline Verdict Logic</h3>
            <div className="space-y-3 text-sm font-light">
              <p className="text-green-400 font-semibold">PASSED Verdict Requirements:</p>
              <ul className="list-disc list-inside space-y-2 text-muted text-xs">
                <li>Execution Quality must be SATISFACTORY or better</li>
                <li>Proof Strength must be ADEQUATE or better</li>
                <li>No dimension can be at its absolute worst level</li>
                <li>Validators must fetch and verify evidence content directly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
