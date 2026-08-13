"use client";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useLodgeChallenge, useFund } from "@/lib/hooks/useFiducia";
import { useWallet } from "@/lib/genlayer/wallet";
import { ArrowLeft, Landmark, ShieldCheck, ShieldAlert, Award, HelpCircle, ExternalLink } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function DispatchDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dispatchId = resolvedParams.id;
  const router = useRouter();
  const { isConnected } = useWallet();

  const { data: dispatch, isLoading, refetch } = useDispatch(dispatchId);
  const { data: fund } = useFund(dispatch?.fund_id ?? null);
  const challengeMutation = useLodgeChallenge();

  const [note, setNote] = useState("");

  if (isLoading) {
    return <div className="text-center py-20 text-muted font-light">Retrieving dispatch audit ledger...</div>;
  }

  if (!dispatch) {
    return <div className="text-center py-20 text-muted">Dispatch not found.</div>;
  }

  const activeRuling = dispatch.challenged && dispatch.challenge_ruling ? dispatch.challenge_ruling : dispatch.ruling;

  const handleChallenge = async () => {
    if (!isConnected) return toast.error("Please connect your wallet first.");
    if (!note.trim()) return toast.error("Please add a note outlining your challenge advocacy.");

    if (!fund) return toast.error("Fund details not loaded.");

    const milestoneIdx = dispatch.milestone_index;
    const disbursement = fund.disbursements[milestoneIdx];

    // Challenge deposit is 2% of the disputed disbursement
    const requiredDeposit = Math.max(
      Math.floor(disbursement * 0.02),
      2 * 10**16 // 0.02 GEN floor
    );

    const depositWei = BigInt(requiredDeposit);

    toast.promise(
      challengeMutation.mutateAsync({
        dispatchId,
        note: note.trim(),
        depositWei
      }),
      {
        loading: "Lodging bonded challenge (waiting for consensus over second-round AI panel)...",
        success: () => { refetch(); return "Challenge evaluated! Ruling updated."; },
        error: (err: any) => err.message || "Failed to challenge dispatch."
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <Toaster theme="dark" richColors />
      <button onClick={() => router.back()} className="flex items-center space-x-2 text-xs uppercase font-bold tracking-wider text-muted hover:text-parchment transition">
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Overview Card */}
      <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-500" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] text-muted font-mono uppercase tracking-wider">Audit Ledger ID: {dispatch.dispatch_id}</span>
            <h1 className="font-display text-3xl font-bold">Milestone #{dispatch.milestone_index + 1} Dispatch</h1>
            <p className="text-xs text-gold-500/80 font-mono font-light">Escrow Fund ID: {dispatch.fund_id}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-[10px] text-muted uppercase tracking-wider">Overall Verdict</div>
              <div className={`font-display text-2xl font-bold ${dispatch.overall === "PASSED" ? "text-green-400" : "text-red-400"}`}>
                {dispatch.overall}
              </div>
            </div>
            {dispatch.challenged && (
              <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-sm">
                CHALLENGED
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Narrative */}
          <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-4">
            <h3 className="font-display text-lg font-bold">Progress Description</h3>
            <p className="text-sm text-muted leading-relaxed font-light whitespace-pre-wrap">{dispatch.narrative}</p>
          </div>

          {/* Evidence urls */}
          <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-4">
            <h3 className="font-display text-lg font-bold">Fetched Evidence Links</h3>
            <div className="space-y-2">
              {dispatch.evidence_urls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-between items-center p-3 bg-navy-900 border border-navy-700 hover:border-gold-500/40 rounded-sm text-xs font-mono text-muted hover:text-gold-500 transition"
                >
                  <span className="truncate">{url}</span>
                  <ExternalLink className="h-4 w-4 ml-2 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Challenge Form */}
          {!dispatch.challenged && dispatch.overall === "FAILED" && (
            <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-4">
              <h3 className="font-display text-lg font-bold flex items-center"><Award className="h-5 w-5 mr-2 text-gold-500" /> Lodge a Bonded Challenge</h3>
              <p className="text-xs text-muted leading-relaxed font-light">
                Do you believe the AI validators made an error? Lodge a challenge. This locks a **2% challenge deposit** and executes a second-round review. 
                If PASSED, deposit is refunded; if upheld as FAILED, deposit is forfeited to the funder.
              </p>
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Outline details or direct validators to specific content in your URLs that proves milestone delivery..."
                  className="w-full bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm rounded-sm focus:border-gold-500 focus:outline-none resize-none font-light"
                />
                <button
                  onClick={handleChallenge}
                  disabled={challengeMutation.isPending}
                  className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold px-6 py-2.5 rounded-sm tracking-wider uppercase text-xs transition"
                >
                  {challengeMutation.isPending ? "Submitting Challenge..." : "Lodge Challenge & Post Bond"}
                </button>
              </div>
            </div>
          )}

          {dispatch.challenged && (
            <div className="bg-navy-800 border border-gold-500/10 p-6 rounded-sm space-y-4">
              <h3 className="font-display text-lg font-bold">Challenge Outcome</h3>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted">Status:</span>
                <span className={`font-semibold ${dispatch.challenge_outcome === "OVERTURNED" ? "text-green-400" : "text-red-400"}`}>
                  {dispatch.challenge_outcome === "OVERTURNED" ? "OVERTURNED (VERDICT FLIPPED)" : "UPHELD (FAILED RULING CONFIRMED)"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Panel Ruling Metrics */}
        <div className="space-y-6">
          <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-6">
            <h3 className="font-display text-lg font-bold">Adjudication Metrics</h3>
            <div className="space-y-4">
              {/* Dimensions */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted block mb-1">Execution Quality</span>
                  <span className={`font-mono font-bold ${activeRuling.execution_quality === "INSUFFICIENT" ? "text-red-400" : "text-green-400"}`}>
                    {activeRuling.execution_quality}
                  </span>
                </div>
                <div>
                  <span className="text-muted block mb-1">Proof Strength</span>
                  <span className={`font-mono font-bold ${activeRuling.proof_strength === "ABSENT" || activeRuling.proof_strength === "MARGINAL" ? "text-red-400" : "text-green-400"}`}>
                    {activeRuling.proof_strength}
                  </span>
                </div>
                <div>
                  <span className="text-muted block mb-1">Budget Fidelity</span>
                  <span className={`font-mono font-bold ${activeRuling.budget_fidelity === "UNACCOUNTED" || activeRuling.budget_fidelity === "DIVERTED" ? "text-red-400" : "text-green-400"}`}>
                    {activeRuling.budget_fidelity}
                  </span>
                </div>
                <div>
                  <span className="text-muted block mb-1">Impact Veracity</span>
                  <span className={`font-mono font-bold ${activeRuling.impact_veracity === "UNSUBSTANTIATED" ? "text-red-400" : "text-green-400"}`}>
                    {activeRuling.impact_veracity}
                  </span>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="border-t border-navy-700/50 pt-4 text-xs">
                <span className="text-muted block mb-1">Panel Confidence</span>
                <span className="font-mono font-bold text-gold-500">{activeRuling.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Ruling Summary Text */}
          <div className="bg-navy-800 border border-navy-700 p-6 rounded-sm space-y-4">
            <h3 className="font-display text-lg font-bold">Panel Summary</h3>
            <p className="text-xs text-muted leading-relaxed font-light">{activeRuling.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
