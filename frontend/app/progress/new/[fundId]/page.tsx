"use client";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmitDispatch, useFund } from "../../../../lib/hooks/useFiducia";
import { useWallet } from "../../../../lib/genlayer/wallet";
import { Landmark, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { preflightUrl } from "../../../../lib/evidence";
import { toast, Toaster } from "sonner";

export default function SubmitDispatch({ params }: { params: Promise<{ fundId: string }> }) {
  const resolvedParams = use(params);
  const fundId = resolvedParams.fundId;
  const router = useRouter();
  const { isConnected } = useWallet();

  const { data: fund, isLoading } = useFund(fundId);
  const mutation = useSubmitDispatch();

  const [narrative, setNarrative] = useState("");
  const [urls, setUrls] = useState<string[]>([""]);

  if (isLoading) {
    return <div className="text-center py-20 text-muted font-light">Fetching fund details...</div>;
  }

  if (!fund) {
    return <div className="text-center py-20 text-muted">Fund not found.</div>;
  }

  const addUrl = () => {
    if (urls.length >= 4) return;
    setUrls([...urls, ""]);
  };

  const removeUrl = (idx: number) => {
    if (urls.length <= 1) return;
    setUrls(urls.filter((_, i) => i !== idx));
  };

  const handleUrlChange = (idx: number, val: string) => {
    setUrls(urls.map((u, i) => (i === idx ? val : u)));
  };

  const submit = async () => {
    if (!isConnected) return toast.error("Please connect your wallet first.");
    if (!narrative.strip()) return toast.error("Narrative description cannot be empty.");

    const filledUrls = urls.map(u => u.trim()).filter(Boolean);
    if (filledUrls.length === 0) return toast.error("At least one evidence URL is required.");

    // Preflight URLs
    for (const url of filledUrls) {
      const check = preflightUrl(url);
      if (check.status === "blocked") {
        return toast.error(`Inadmissible URL: ${url}. ${check.note}`);
      }
    }

    toast.promise(
      mutation.mutateAsync({
        fundId,
        narrative: narrative.trim(),
        urls: filledUrls
      }),
      {
        loading: "Submitting dispatch for AI panel consensus (this runs non-deterministic fetching)...",
        success: () => {
          setTimeout(() => router.push(`/funds/${fundId}`), 1500);
          return "Dispatch processed successfully!";
        },
        error: (err: any) => err.message || "Failed to process dispatch."
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <Toaster theme="dark" richColors />
      <button onClick={() => router.back()} className="flex items-center space-x-2 text-xs uppercase font-bold tracking-wider text-muted hover:text-parchment transition">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Escrow</span>
      </button>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-display text-4xl font-bold">Submit Milestone Dispatch</h1>
        <p className="text-sm text-muted font-light">Milestone #{fund.current_milestone + 1}: {fund.milestones[fund.current_milestone]}</p>
      </div>

      <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm space-y-6">
        {/* Narrative */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-muted font-semibold">Progress Narrative Description</label>
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={5}
            placeholder="Provide a detailed explanation of what has been accomplished for this milestone obligation..."
            className="w-full bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm rounded-sm focus:border-gold-500 focus:outline-none resize-none font-light"
          />
        </div>

        {/* Evidence URLs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-xs uppercase tracking-wider text-muted font-semibold">Evidence URLs (GitHub raw / Gists / Wikipedia)</label>
            <button
              onClick={addUrl}
              disabled={urls.length >= 4}
              className="text-xs text-gold-500 hover:text-gold-400 font-bold uppercase tracking-wider flex items-center space-x-1 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Add URL</span>
            </button>
          </div>

          <div className="space-y-3">
            {urls.map((u, idx) => {
              const check = u ? preflightUrl(u) : null;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={u}
                      onChange={(e) => handleUrlChange(idx, e.target.value)}
                      placeholder="e.g. https://raw.githubusercontent.com/username/repo/main/proof.txt"
                      className="flex-1 bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm font-mono rounded-sm focus:border-gold-500 focus:outline-none"
                    />
                    <button
                      onClick={() => removeUrl(idx)}
                      disabled={urls.length <= 1}
                      className="text-muted hover:text-red-400 transition p-2 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {check && (
                    <div className={`text-[10px] uppercase font-bold tracking-wider ${
                      check.status === "supported" ? "text-green-400" :
                      check.status === "blocked" ? "text-red-400" : "text-amber-500"
                    }`}>
                      {check.status}: {check.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={mutation.isPending}
          className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold py-3.5 rounded-sm tracking-wider uppercase text-xs transition"
        >
          {mutation.isPending ? "Submitting to Validators..." : "Execute Validator consensus"}
        </button>
      </div>
    </div>
  );
}
