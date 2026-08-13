import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { CONTRACT_ADDRESS } from "../config";
import type { Fund, Dispatch, ProtocolStats } from "./types";

function resolveProvider() {
  if (typeof window === "undefined") return null;
  const eth = (window as any).ethereum;
  if (!eth) return null;
  if (Array.isArray(eth.providers)) {
    return eth.providers.find((p: any) => p.isMetaMask && !p.isCoinbaseWallet) ?? eth.providers[0] ?? eth;
  }
  return eth;
}

export class FiduciaClient {
  private client: any;
  private address: `0x${string}`;

  constructor(account?: string | null) {
    this.address = CONTRACT_ADDRESS as `0x${string}`;
    const config: any = { chain: studionet };
    if (account) {
      config.account = account as `0x${string}`;
      const provider = resolveProvider();
      if (provider) config.provider = provider;
    }
    this.client = createClient(config);
  }

  private async waitAndVerify(txHash: `0x${string}`): Promise<any> {
    const receipt = await this.client.waitForTransactionReceipt({
      hash: txHash,
      status: "ACCEPTED",
      retries: 60,
      interval: 4000,
    });
    const status = String(receipt?.status ?? "").toUpperCase();
    const leader = receipt?.consensus_data?.leader_receipt;
    const lr = Array.isArray(leader) ? leader[0] : leader;
    
    if (status.includes("UNDETERMINED") || status.includes("CANCELED")) {
      throw new Error("AI Validators failed to reach consensus. Please resubmit.");
    }
    if (lr?.execution_result === "ERROR") {
      throw new Error(lr?.message ?? "Transaction execution failed.");
    }
    return receipt;
  }

  // --- Writes ---
  async awardFund(grantee: string, title: string, milestones: string[], acceptanceCriteria: string, curator: string, valueWei: bigint): Promise<string> {
    const hash = await this.client.writeContract({
      address: this.address,
      functionName: "award_fund",
      args: [grantee, title, milestones, acceptanceCriteria, curator],
      value: valueWei,
    });
    const receipt = await this.waitAndVerify(hash);
    const lr = Array.isArray(receipt?.consensus_data?.leader_receipt) ? receipt?.consensus_data?.leader_receipt[0] : receipt?.consensus_data?.leader_receipt;
    return String(lr?.rval ?? "");
  }

  async submitDispatch(fundId: string, narrative: string, urls: string[]): Promise<string> {
    const hash = await this.client.writeContract({
      address: this.address,
      functionName: "submit_dispatch",
      args: [fundId, narrative, urls],
    });
    const receipt = await this.waitAndVerify(hash);
    const lr = Array.isArray(receipt?.consensus_data?.leader_receipt) ? receipt?.consensus_data?.leader_receipt[0] : receipt?.consensus_data?.leader_receipt;
    return String(lr?.rval ?? "");
  }

  async lodgeChallenge(dispatchId: string, note: string, valueWei: bigint): Promise<string> {
    const hash = await this.client.writeContract({
      address: this.address,
      functionName: "lodge_challenge",
      args: [dispatchId, note],
      value: valueWei,
    });
    const receipt = await this.waitAndVerify(hash);
    const lr = Array.isArray(receipt?.consensus_data?.leader_receipt) ? receipt?.consensus_data?.leader_receipt[0] : receipt?.consensus_data?.leader_receipt;
    return String(lr?.rval ?? "");
  }

  async finalizeClawback(fundId: string): Promise<void> {
    const hash = await this.client.writeContract({
      address: this.address,
      functionName: "finalize_clawback",
      args: [fundId],
    });
    await this.waitAndVerify(hash);
  }

  async closeFund(fundId: string): Promise<void> {
    const hash = await this.client.writeContract({
      address: this.address,
      functionName: "close_fund",
      args: [fundId],
    });
    await this.waitAndVerify(hash);
  }

  // --- Views ---
  async getFund(fundId: string): Promise<Fund> {
    const raw = await this.client.readContract({
      address: this.address,
      functionName: "get_fund",
      args: [fundId],
    });
    return JSON.parse(raw);
  }

  async getDispatch(dispatchId: string): Promise<Dispatch> {
    const raw = await this.client.readContract({
      address: this.address,
      functionName: "get_dispatch",
      args: [dispatchId],
    });
    return JSON.parse(raw);
  }

  async getFundsByFunder(funder: string): Promise<string[]> {
    const raw = await this.client.readContract({
      address: this.address,
      functionName: "get_funds_by_funder",
      args: [funder],
    });
    return JSON.parse(raw);
  }

  async getFundsByGrantee(grantee: string): Promise<string[]> {
    const raw = await this.client.readContract({
      address: this.address,
      functionName: "get_funds_by_grantee",
      args: [grantee],
    });
    return JSON.parse(raw);
  }

  async getProtocolStats(): Promise<ProtocolStats> {
    const raw = await this.client.readContract({
      address: this.address,
      functionName: "get_protocol_stats",
      args: [],
    });
    return JSON.parse(raw);
  }
}
