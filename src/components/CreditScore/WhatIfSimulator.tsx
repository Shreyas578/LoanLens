"use client";

import { useState } from "react";
import { Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const scenarios = [
  {
    id: "close_liquidated_position",
    title: "Close undercollateralized position",
    description: "Your Aave position is at 112% collateral ratio. Closing it removes liquidation risk.",
    impact: 22,
    difficulty: "Medium",
  },
  {
    id: "repayment_streak",
    title: "Maintain 90-day clean repayment streak",
    description: "No missed payments or liquidations for 90 days significantly boosts repayment history.",
    impact: 35,
    difficulty: "Easy",
  },
  {
    id: "diversify_chains",
    title: "Add activity on one more chain",
    description: "Cross-chain activity signals DeFi sophistication to lenders.",
    impact: 12,
    difficulty: "Easy",
  },
];

export default function WhatIfSimulator({ currentScore }: { currentScore: number }) {
  const [activeScenarios, setActiveScenarios] = useState<string[]>([]);

  const simulatedScore = currentScore + activeScenarios.reduce((acc, id) => {
    const s = scenarios.find((s) => s.id === id);
    return acc + (s?.impact || 0);
  }, 0);

  const toggleScenario = (id: string) => {
    setActiveScenarios((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="glass-panel p-8 rounded-3xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-2xl">What-If Simulator</h3>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Projected Score</p>
          <motion.p 
            key={simulatedScore}
            initial={{ scale: 1.2, color: "#00F0FF" }}
            animate={{ scale: 1, color: "#FFF" }}
            className="font-display font-bold text-3xl text-primary glow-text"
          >
            {simulatedScore}
          </motion.p>
        </div>
      </div>

      <div className="space-y-4">
        {scenarios.map((scenario) => {
          const isActive = activeScenarios.includes(scenario.id);
          return (
            <div 
              key={scenario.id}
              onClick={() => toggleScenario(scenario.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                isActive ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]" : "bg-secondary/40 border-border hover:bg-white/5"
              }`}
            >
              <div className="pr-4">
                <div className="flex items-center gap-2 mb-1">
                  {isActive ? <ShieldCheck className="w-4 h-4 text-primary" /> : <Zap className="w-4 h-4 text-muted-foreground" />}
                  <h4 className={`font-bold ${isActive ? "text-primary" : "text-white"}`}>{scenario.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </div>
              
              <div className="text-right shrink-0">
                <span className="text-green-400 font-bold block">+{scenario.impact} pts</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-md text-muted-foreground mt-2 inline-block">
                  {scenario.difficulty}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
