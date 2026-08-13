"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      eth.request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts && accounts[0]) setAddress(accounts[0]);
        }).catch(console.error);

      const handleAccounts = (accounts: string[]) => {
        if (accounts && accounts[0]) setAddress(accounts[0]);
        else setAddress(null);
      };
      eth.on("accountsChanged", handleAccounts);
      return () => {
        eth.removeListener("accountsChanged", handleAccounts);
      };
    }
  }, []);

  const connect = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("Please install MetaMask or another compatible browser wallet.");
      return;
    }
    try {
      const eth = (window as any).ethereum;
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      if (accounts && accounts[0]) setAddress(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ isConnected: !!address, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used under WalletProvider");
  return ctx;
}
