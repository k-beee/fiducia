"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { FiduciaClient } from "../contracts/fiducia";
import { useWallet } from "../genlayer/wallet";
import type { Fund, Dispatch, ProtocolStats } from "../contracts/types";

export function useFiduciaClient(): FiduciaClient {
  const { address } = useWallet();
  return useMemo(() => new FiduciaClient(address), [address]);
}

export function useProtocolStats() {
  const client = useFiduciaClient();
  return useQuery<ProtocolStats, Error>({
    queryKey: ["protocolStats"],
    queryFn: () => client.getProtocolStats(),
    refetchInterval: 8000,
  });
}

export function useFund(fundId: string | null) {
  const client = useFiduciaClient();
  return useQuery<Fund | null, Error>({
    queryKey: ["fund", fundId],
    queryFn: () => (fundId ? client.getFund(fundId) : Promise.resolve(null)),
    enabled: !!fundId,
    refetchInterval: 5000,
  });
}

export function useDispatch(dispatchId: string | null) {
  const client = useFiduciaClient();
  return useQuery<Dispatch | null, Error>({
    queryKey: ["dispatch", dispatchId],
    queryFn: () => (dispatchId ? client.getDispatch(dispatchId) : Promise.resolve(null)),
    enabled: !!dispatchId,
  });
}

export function useFundsList(type: "funder" | "grantee") {
  const client = useFiduciaClient();
  const { address } = useWallet();
  return useQuery<Fund[], Error>({
    queryKey: ["funds", type, address],
    queryFn: async () => {
      if (!address) return [];
      const ids = type === "funder" 
        ? await client.getFundsByFunder(address) 
        : await client.getFundsByGrantee(address);
      const details = await Promise.all(ids.map(id => client.getFund(id)));
      return details;
    },
    enabled: !!address,
  });
}

export function useAwardFund() {
  const client = useFiduciaClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ grantee, title, milestones, acceptanceCriteria, curator, amountWei }: {
      grantee: string;
      title: string;
      milestones: string[];
      acceptanceCriteria: string;
      curator: string;
      amountWei: bigint;
    }) => client.awardFund(grantee, title, milestones, acceptanceCriteria, curator, amountWei),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["protocolStats"] });
      qc.invalidateQueries({ queryKey: ["funds"] });
    }
  });
}

export function useSubmitDispatch() {
  const client = useFiduciaClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fundId, narrative, urls }: { fundId: string; narrative: string; urls: string[] }) =>
      client.submitDispatch(fundId, narrative, urls),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["fund", variables.fundId] });
      qc.invalidateQueries({ queryKey: ["protocolStats"] });
    }
  });
}

export function useLodgeChallenge() {
  const client = useFiduciaClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dispatchId, note, depositWei }: { dispatchId: string; note: string; depositWei: bigint }) =>
      client.lodgeChallenge(dispatchId, note, depositWei),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fund"] });
      qc.invalidateQueries({ queryKey: ["dispatch"] });
      qc.invalidateQueries({ queryKey: ["protocolStats"] });
    }
  });
}

export function useFinalizeClawback() {
  const client = useFiduciaClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fundId: string) => client.finalizeClawback(fundId),
    onSuccess: (_, fundId) => {
      qc.invalidateQueries({ queryKey: ["fund", fundId] });
      qc.invalidateQueries({ queryKey: ["protocolStats"] });
    }
  });
}

export function useCloseFund() {
  const client = useFiduciaClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fundId: string) => client.closeFund(fundId),
    onSuccess: (_, fundId) => {
      qc.invalidateQueries({ queryKey: ["fund", fundId] });
      qc.invalidateQueries({ queryKey: ["protocolStats"] });
    }
  });
}
