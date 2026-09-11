"use client";

import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

export default function RiskDashboard({ data }: { data: any }) {
  // Mock risk data for the UI
  const riskLevel = "Medium";
  const flags = [
    { severity: "High", title: "High Utilization on Compound", desc: "Borrow position is at 85% of collateral limit." },
    { severity: "Medium", title: "Single Protocol Concentration", desc: "90% of DeFi activity is on Aave. Consider diversifying." },
  ];

  return (
    <div className="glass-panel rounded-3xl p-8 mt-8 border-orange-500/30 border">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-orange-400 w-6 h-6" />
        <h3 className="font-display font-bold text-2xl text-orange-400">AI Risk Analysis</h3>
      </div>

      <div className="flex justify-between items-center mb-8 p-4 bg-orange-500/10 rounded-xl">
        <span className="text-white font-bold">Overall Risk Level</span>
        <span className="bg-orange-500 text-black px-4 py-1 rounded-full font-bold">{riskLevel}</span>
      </div>

      <div className="space-y-4">
        {flags.map((flag, i) => (
          <div key={i} className="flex gap-4 items-start p-4 bg-secondary/50 rounded-xl border border-border">
            {flag.severity === "High" ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm mb-1 text-white">{flag.title}</h4>
              <p className="text-xs text-muted-foreground">{flag.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
