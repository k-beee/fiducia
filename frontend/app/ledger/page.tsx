"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiduciaClient } from "@/lib/contracts/fiducia";
import { Landmark, ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";
import type { Dispatch } from "@/lib/contracts/types";

export default function Ledger() {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLedger() {
      try {
        const client = new FiduciaClient();
        const stats = await client.getProtocolStats();
        const count = Number(stats.dispatch_count);
        
        const list: Dispatch[] = [];
        for (let i = count; i >= 1; i--) {
          try {
            const d = await client.getDispatch(String(i));
            list.push(d);
          } catch (e) {
            console.error(e);
          }
        }
        setDispatches(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLedger();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Public Audit Ledger</h1>
        <p className="text-muted text-sm font-light">Immutable record of all milestone dispatches and AI validator verdicts.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted font-light">Retrieving public audit records...</div>
      ) : dispatches.length > 0 ? (
        <div className="space-y-4">
          {dispatches.map((d) => (
            <Link
              key={d.dispatch_id}
              href={`/progress/${d.dispatch_id}`}
              className="bg-navy-800 border border-navy-700 p-6 rounded-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:border-gold-500/30 transition group relative"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-500 scale-x-0 group-hover:scale-x-100 transition duration-300" />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-muted uppercase">
                  <span>Ledger #{d.dispatch_id}</span>
                  <span>•</span>
                  <span>Fund: {d.fund_id}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-parchment group-hover:text-gold-500 transition">
                  {d.milestone_text}
                </h3>
                <p className="text-xs text-muted line-clamp-1 max-w-2xl font-light">{d.narrative}</p>
              </div>

              <div className="flex items-center space-x-6 justify-between md:justify-end">
                <div className="text-right">
                  <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-sm ${
                    d.overall === "PASSED" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {d.overall}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gold-500 transform group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-navy-800 rounded-sm">
          <p className="text-muted font-light text-sm">No dispatches logged in the public ledger yet.</p>
        </div>
      )}
    </div>
  );
}
