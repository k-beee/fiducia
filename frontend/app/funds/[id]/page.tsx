"use client";
import React, { use } from "react";
import Link from "next/link";
import { useFund, useSubmitDispatch, useFinalizeClawback, useCloseFund } from "@/lib/hooks/useFiducia";
import { useWallet } from "@/lib/genlayer/wallet";
import { Layers, Landmark, Calendar, User, Clock, ArrowRight, ShieldAlert, Award } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function FundDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const fundId = resolvedParams.id;
  const { isConnected, address } = useWallet();
  
  const { data: fund, isLoading, refetch } = useFund(fundId);
  const finalizeMutation = useFinalizeClawback();
  const closeMutation = useCloseFund();

  if (isLoading) {
    return <div className="text-center py-20 text-muted font-light">Retrieving escrow ledger...</div>;
  }

  if (!fund) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <Landmark className="h-12 w-12 text-gold-500 mx-auto" />
        <h1 className="font-display text-2xl font-bold">Escrow Not Found</h1>
        <p className="text-muted text-sm font-light">This fund ID does not exist on-chain.</p>
        <Link href="/funds" className="text-xs uppercase font-bold tracking-wider text-gold-500 hover:underline">Return to My Funds</Link>
      </div>
    );
  }

  const isFunder = address?.toLowerCase() === fund.funder.toLowerCase();
  const isGrantee = address?.toLowerCase() === fund.grantee.toLowerCase();
  const isCurator = fund.curator && address?.toLowerCase() === fund.curator.toLowerCase();

  const handleFinalizeClawback = async () => {
    toast.promise(
      finalizeMutation.mutateAsync(fundId),
      {
        loading: "Executing final clawback refund...",
        success: () => { refetch(); return "Escrow reclaimed by funder!"; },
        error: (err: any) => err.message || "Clawback execution failed."
      }
    );
  };

  const handleCloseFund = async () => {
    toast.promise(
      closeMutation.mutateAsync(fundId),
      {
        loading: "Closing fund early...",
        success: () => { refetch(); return "Fund closed. Remaining escrow returned to funder."; },
        error: (err: any) => err.message || "Failed to close fund."
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <Toaster theme="dark" richColors />
      
      {/* Header */}
      <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-500" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm ${
                fund.status === "ACTIVE" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                fund.status === "CLAWBACK_PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                "bg-navy-700 text-muted border border-navy-600"
              }`}>
                {fund.status}
              </span>
              <span className="text-xs text-muted font-mono">ID: {fund.fund_id}</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-parchment">{fund.title}</h1>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted uppercase tracking-wider mb-1">Escrow Balance</div>
            <div className="font-display text-4xl font-bold text-gold-500">
              {((fund.total_amount - fund.released_wei) / 10**18).toFixed(1)} <span className="text-xl">GEN</span>
            </div>
            <div className="text-[10px] text-muted font-light mt-1">
              Total locked: {(fund.total_amount / 10**18).toFixed(1)} GEN
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 border-t border-navy-700/50 mt-6 pt-6 text-xs text-muted font-light">
          <div className="flex items-center"><User className="h-4 w-4 mr-2 text-gold-500/50" /> <span>Funder: <span className="font-mono">{fund.funder.slice(0,6)}...{fund.funder.slice(-4)}</span></span></div>
          <div className="flex items-center"><User className="h-4 w-4 mr-2 text-gold-500/50" /> <span>Grantee: <span className="font-mono">{fund.grantee.slice(0,6)}...{fund.grantee.slice(-4)}</span></span></div>
          {fund.curator && (
            <div className="flex items-center"><User className="h-4 w-4 mr-2 text-gold-500/50" /> <span>Curator: <span className="font-mono">{fund.curator.slice(0,6)}...{fund.curator.slice(-4)}</span></span></div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Milestones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-6">
            <h2 className="font-display text-xl font-bold flex items-center"><Layers className="h-5 w-5 mr-2 text-gold-500" /> Milestone Obligations</h2>
            <div className="space-y-4">
              {fund.milestones.map((m, idx) => {
                const isCompleted = idx < fund.current_milestone;
                const isCurrent = idx === fund.current_milestone && fund.status === "ACTIVE";
                const isLocked = idx > fund.current_milestone || fund.status !== "ACTIVE";
                const amount = fund.disbursements[idx];

                return (
                  <div 
                    key={idx} 
                    className={`border p-4 rounded-sm transition flex justify-between items-center ${
                      isCompleted ? "bg-green-500/5 border-green-500/20 text-green-400/90" :
                      isCurrent ? "bg-navy-700/50 border-gold-500/40 text-parchment" :
                      "bg-navy-900/30 border-navy-800 text-muted"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider">
                        {isCompleted ? "COMPLETED" : isCurrent ? "ACTIVE OBLIGATION" : "LOCKED"}
                      </div>
                      <h4 className="font-display text-sm font-semibold">{m}</h4>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-gold-500">{(amount / 10**18).toFixed(1)} GEN</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action box */}
          {fund.status === "ACTIVE" && isGrantee && (
            <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm flex justify-between items-center">
              <div>
                <h3 className="font-display text-lg font-bold">Ready to submit progress?</h3>
                <p className="text-xs text-muted font-light">Submit narrative plus evidence URLs for Milestone #{fund.current_milestone + 1}.</p>
              </div>
              <Link href={`/progress/new/${fundId}`} className="bg-gold-500 hover:bg-gold-600 text-navy-950 px-6 py-2.5 rounded-sm font-bold uppercase tracking-wider text-xs transition">
                Submit Dispatch
              </Link>
            </div>
          )}

          {fund.status === "CLAWBACK_PENDING" && (
            <div className="bg-navy-800 border border-red-500/20 p-6 rounded-sm space-y-4">
              <div className="flex items-center space-x-2 text-amber-500">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-display text-lg font-bold">Clawback Pending</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed font-light">
                Three consecutive milestone dispatches have FAILED validator review. 
                The grantee has a grace window to post a challenge. Funder can trigger clawback after the action window.
              </p>
              <div className="flex space-x-4">
                {isGrantee && (
                  <Link 
                    href={`/progress/${fund.dispatch_ids[fund.dispatch_ids.length - 1]}`}
                    className="bg-gold-500 hover:bg-gold-600 text-navy-950 px-6 py-2.5 rounded-sm font-bold uppercase tracking-wider text-xs transition"
                  >
                    Challenge Ruling
                  </Link>
                )}
                {isFunder && (
                  <button 
                    onClick={handleFinalizeClawback}
                    disabled={finalizeMutation.isPending}
                    className="border border-red-500/50 hover:bg-red-500/10 text-red-400 px-6 py-2.5 rounded-sm font-bold uppercase tracking-wider text-xs transition"
                  >
                    Finalize Clawback
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Audit details / ledger stats */}
        <div className="space-y-6">
          <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-4">
            <h3 className="font-display text-lg font-bold">Acceptance Criteria</h3>
            <p className="text-xs text-muted font-light leading-relaxed whitespace-pre-wrap">{fund.acceptance_criteria}</p>
          </div>

          <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-4">
            <h3 className="font-display text-lg font-bold">Audit History</h3>
            {fund.dispatch_ids.length > 0 ? (
              <div className="space-y-3">
                {fund.dispatch_ids.map((id, idx) => (
                  <Link 
                    key={id}
                    href={`/progress/${id}`}
                    className="flex justify-between items-center p-3 bg-navy-900 border border-navy-700 hover:border-gold-500/40 transition rounded-sm"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted uppercase font-bold">Milestone #{idx + 1}</span>
                      <div className="text-xs font-semibold text-parchment">Dispatch Ledger</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gold-500" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted font-light">No progress dispatches submitted yet.</p>
            )}
          </div>

          {(isFunder || isCurator) && fund.status === "ACTIVE" && (
            <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-4">
              <h3 className="font-display text-lg font-bold">Early Close</h3>
              <p className="text-xs text-muted font-light leading-relaxed">
                Close this fund early and reclaim all unreleased escrow immediately. The grantee keeps earned tranches.
              </p>
              <button 
                onClick={handleCloseFund}
                disabled={closeMutation.isPending}
                className="w-full border border-navy-700 hover:border-red-500/50 hover:bg-red-500/5 text-muted hover:text-red-400 font-bold py-2.5 rounded-sm tracking-wider uppercase text-xs transition"
              >
                Close Fund Early
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
