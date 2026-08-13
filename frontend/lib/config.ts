import { studionet } from "genlayer-js/chains";

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0x6dB333eaA76349bB37BE56F14467Abc949464748").trim();
export const CONTRACT_CONFIGURED = CONTRACT_ADDRESS.startsWith("0x") && CONTRACT_ADDRESS.length === 42;
export const CHAIN_RPC = (process.env.NEXT_PUBLIC_GENLAYER_RPC_URL ?? "https://studio.genlayer.com/api").trim();
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID ?? 61999);
export const CHAIN_NAME = "studionet";

export const explorerUrl = (addr: string) => `https://explorer-studio.genlayer.com/address/${addr}`;
export const explorerTxUrl = (txHash: string) => `https://explorer-studio.genlayer.com/tx/${txHash}`;
