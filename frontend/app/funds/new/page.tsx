"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAwardFund } from "../../lib/hooks/useFiducia";
import { useWallet } from "../../lib/genlayer/wallet";
import { Landmark, Plus, Trash2, HelpCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function NewFund() {
  const router = useRouter();
  const { isConnected, address } = useWallet();
  const mutation = useAwardFund();

  const [grantee, setGrantee] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("1");
  const [curator, setCurator] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [milestones, setMilestones] = useState<string[]>(["Phase 1: Alpha prototype delivery", "Phase 2: Mainnet integration and launch"]);

  const addMilestone = () => {
    if (milestones.length >= 6) return;
    setMilestones([...milestones, ""]);
  };

  const removeMilestone = (idx: number) => {
    if (milestones.length <= 2) return;
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleMilestoneChange = (idx: number, val: string) => {
    setMilestones(milestones.map((m, i) => (i === idx ? val : m)));
  };

  const submit = async () => {
    if (!isConnected) return toast.error("Please connect your wallet first.");
    if (!/^0x[0-9a-fA-F]{40}$/.test(grantee.trim())) {
      return toast.error("Grantee must be a valid 42-character EVM address.");
    }
    if (curator.trim() && !/^0x[0-9a-fA-F]{40}$/.test(curator.trim())) {
      return toast.error("Curator must be a valid 42-character address or left blank.");
    }
    if (grantee.trim().toLowerCase() === address?.toLowerCase()) {
      return toast.error("Funder and Grantee addresses must be different.");
    }
    if (!title.trim()) return toast.error("Fund title is required.");
    if (!acceptanceCriteria.trim()) return toast.error("Written acceptance criteria is required for validators.");
    
    const filledMilestones = milestones.map(m => m.trim()).filter(Boolean);
    if (filledMilestones.length < 2) return toast.error("At least 2 milestones are required.");

    const val = Number(amount);
    if (isNaN(val) || val < 0.1 || val > 10) {
      return toast.error("Amount must be between 0.1 GEN and 10 GEN.");
    }

    const amountWei = BigInt(Math.floor(val * 10**18));

    toast.promise(
      mutation.mutateAsync({
        grantee: grantee.trim(),
        title: title.trim(),
        milestones: filledMilestones,
        acceptanceCriteria: acceptanceCriteria.trim(),
        curator: curator.trim(),
        amountWei
      }),
      {
        loading: "Lodging fund on-chain (waiting for consensus)...",
        success: () => {
          setTimeout(() => router.push("/funds"), 1500);
          return "Fund successfully created!";
        },
        error: (err: any) => err.message || "Failed to create fund."
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <Toaster theme="dark" richColors />
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-display text-4xl font-bold">Lodge a New Fund</h1>
        <p className="text-sm text-muted font-light">The capital locks in escrow atomically and splits into equal milestone tranches.</p>
      </div>

      <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-muted font-semibold">Fund Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fiducia Open Source Integration"
            className="w-full bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm rounded-sm focus:border-gold-500 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Grantee Address */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-muted font-semibold">Grantee Address (EOA)</label>
            <input
              type="text"
              value={grantee}
              onChange={(e) => setGrantee(e.target.value)}
              placeholder="0x..."
              className="w-full bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm font-mono rounded-sm focus:border-gold-500 focus:outline-none"
            />
          </div>
          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-muted font-semibold">Escrow Capital (GEN)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.1"
              max="10"
              step="0.1"
              className="w-full bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm rounded-sm focus:border-gold-500 focus:outline-none"
            />
            <span className="text-[10px] text-muted font-light">Demo cap: 0.1 - 10 GEN</span>
          </div>
        </div>

        {/* Optional Curator */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5">
            <label className="block text-xs uppercase tracking-wider text-muted font-semibold">Appointed Curator (Optional)</label>
            <span className="text-muted hover:text-parchment cursor-help" title="A trusted third-party arbitrator who can close the fund early without strikes."><HelpCircle className="h-3.5 w-3.5" /></span>
          </div>
          <input
            type="text"
            value={curator}
            onChange={(e) => setCurator(e.target.value)}
            placeholder="0x... (appoint a program officer or arbitrator)"
            className="w-full bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm font-mono rounded-sm focus:border-gold-500 focus:outline-none"
          />
        </div>

        {/* Written Acceptance Criteria */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-muted font-semibold">Written Acceptance Criteria (For AI Validators)</label>
          <textarea
            value={acceptanceCriteria}
            onChange={(e) => setAcceptanceCriteria(e.target.value)}
            rows={3}
            placeholder="Specify clear deliverables that validators should verify in the evidence. Avoid vague metrics."
            className="w-full bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm rounded-sm focus:border-gold-500 focus:outline-none resize-none font-light"
          />
        </div>

        {/* Milestones */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-xs uppercase tracking-wider text-muted font-semibold">Milestone Obligations (2-6)</label>
            <button
              onClick={addMilestone}
              disabled={milestones.length >= 6}
              className="text-xs text-gold-500 hover:text-gold-400 font-bold uppercase tracking-wider flex items-center space-x-1 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Add Step</span>
            </button>
          </div>
          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <span className="font-mono text-xs text-muted w-6">#{idx + 1}</span>
                <input
                  type="text"
                  value={m}
                  onChange={(e) => handleMilestoneChange(idx, e.target.value)}
                  placeholder={`Milestone obligation description`}
                  className="flex-1 bg-navy-900 border border-navy-700 px-4 py-2.5 text-sm rounded-sm focus:border-gold-500 focus:outline-none font-light"
                />
                <button
                  onClick={() => removeMilestone(idx)}
                  disabled={milestones.length <= 2}
                  className="text-muted hover:text-red-400 transition p-2 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={mutation.isPending}
          className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-navy-950 font-bold py-3.5 rounded-sm tracking-wider uppercase text-xs transition"
        >
          {mutation.isPending ? "Confirming Transaction..." : "Lodge Escrow & Commit Funds"}
        </button>
      </div>
    </div>
  );
}
