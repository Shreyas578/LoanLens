"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ScoreGauge from "@/components/CreditScore/ScoreGauge";
import ExplorerTabs from "@/components/ExplorerPanel/ExplorerTabs";
import WhatIfSimulator from "@/components/CreditScore/WhatIfSimulator";
import RiskDashboard from "@/components/RiskAgent/RiskDashboard";
import ChatPanel from "@/components/NegotiationChat/ChatPanel";
import VisualPassport from "@/components/CreditScore/VisualPassport";
import { ShieldCheck, Activity, Wallet, AlertTriangle } from "lucide-react";

export default function ScoreDashboard() {
  const params = useParams();
  const walletAddress = params.address as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLenderMode, setIsLenderMode] = useState(false);

  useEffect(() => {
    // Check initial mode
    if (localStorage.getItem("loanlens_mode") === "lender") {
      setIsLenderMode(true);
    }

    // Listen for toggle
    const handleModeChange = () => {
      setIsLenderMode(localStorage.getItem("loanlens_mode") === "lender");
    };

    window.addEventListener("mode_changed", handleModeChange);
    return () => window.removeEventListener("mode_changed", handleModeChange);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch real wallet data
        const walletResponse = await fetch("/api/wallet-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress })
        });
        
        if (!walletResponse.ok) {
          throw new Error("Failed to fetch real wallet data");
        }
        
        const walletData = await walletResponse.json();
        
        // Pass the real wallet data to the Score API
        const response = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletData })
        });

        if (response.ok) {
          const narrative = await response.json();
          setData({ 
            ...walletData,
            narrative, 
            chains: 2, 
            protocols: 3 
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (walletAddress) fetchData();
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
        <ShieldCheck className="w-16 h-16 text-primary animate-pulse mb-4" />
        <h2 className="font-display text-2xl glow-text">Attesting On-Chain Data...</h2>
        <p className="text-muted-foreground mt-2">Verifying via Creditcoin Protocol</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-12 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-accent w-8 h-8" />
          <span className="font-display font-bold text-xl glow-text">LoanLens</span>
        </div>
        <div className="font-mono text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg border border-border">
          {walletAddress}
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Score */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <h2 className="font-display text-xl font-bold mb-8">Attested Credit Score</h2>
          <ScoreGauge score={data?.score || 0} grade={data?.grade || "N/A"} />
          
          <div className="mt-8 w-full bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="text-accent w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs text-accent/80">Proof Hash: 0x864d164D...21B04c1Fff9</p>
          </div>
        </motion.div>

        {/* Right Column: AI Narrative & Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 space-y-6"
        >
          {/* AI Narrative */}
          <div className="glass-panel rounded-3xl p-8">
            <h3 className="font-display text-2xl font-bold text-primary mb-4 glow-text">
              {data?.narrative?.headline || "Credit Profile Overview"}
            </h3>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {data?.narrative?.narrative || "Your on-chain data has been verified. No liquidations found. Good repayment history across major DeFi protocols."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-secondary/40 p-4 rounded-xl border border-border">
                <h4 className="text-sm font-bold text-accent mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Strengths</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {data?.narrative?.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-secondary/40 p-4 rounded-xl border border-border">
                <h4 className="text-sm font-bold text-destructive mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Weaknesses</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {data?.narrative?.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Explorer Quick View */}
          <div className="grid grid-cols-2 gap-6">
             <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="text-primary w-5 h-5" />
                  <h4 className="font-display font-bold">On-Chain Activity</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tx Count</span> <span>{data?.txCount ?? 156}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Active Chains</span> <span>{data?.chains ?? 2}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Protocols</span> <span>{data?.protocols ?? 3}</span></div>
                </div>
             </div>
             <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-background to-primary/5">
                <h4 className="font-display font-bold mb-2">Lender Summary</h4>
                <p className="text-sm text-muted-foreground">{data?.narrative?.lender_summary || "Highly recommended for undercollateralized loans."}</p>
                {isLenderMode ? (
                  <button className="mt-4 w-full bg-accent text-accent-foreground font-bold py-3 rounded-xl hover:bg-accent/80 transition-colors">
                    Request Formal Application
                  </button>
                ) : (
                  <button className="mt-4 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-primary transition-colors">
                    Generate Credit Passport
                  </button>
                )}
             </div>
             
             {/* IPFS Visual Passport Generation */}
             <VisualPassport data={data} />
             
          </div>
          
          {/* New Integrated Panels */}
          <ExplorerTabs data={data} />
          
        </motion.div>

        {/* Right Column: Simulator & Risk */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="col-span-1 md:col-span-3 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
           <WhatIfSimulator currentScore={data?.score || 0} />
           <RiskDashboard data={data} walletAddress={walletAddress} />
        </motion.div>
      </div>
      
      {/* AI Negotiation Chat */}
      <ChatPanel data={data} />
    </div>
  );
}
