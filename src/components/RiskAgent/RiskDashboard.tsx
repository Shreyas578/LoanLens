"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, CheckCircle, TrendingDown, ShieldAlert, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";

export default function RiskDashboard({ data, walletAddress }: { data: any, walletAddress?: string }) {
  const [marketDrop, setMarketDrop] = useState(0);
  const [showDefender, setShowDefender] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    // Check initial connected wallet
    const saved = localStorage.getItem("loanlens_wallet");
    if (saved) setConnectedWallet(saved);

    const handleWallet = () => {
      setConnectedWallet(localStorage.getItem("loanlens_wallet"));
    };
    window.addEventListener("wallet_changed", handleWallet);
    return () => window.removeEventListener("wallet_changed", handleWallet);
  }, []);

  const isOwner = connectedWallet?.toLowerCase() === walletAddress?.toLowerCase();

  const handleSign = async () => {
    if (!isOwner || typeof window === "undefined" || !(window as any).ethereum) return;
    setIsSigning(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      // Send the generated rescue transaction
      const tx = await signer.sendTransaction({
        to: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
        data: "0x573ade81000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000000000000000000000002"
      });
      alert(`Transaction Submitted! Hash: ${tx.hash}`);
      setShowDefender(false);
    } catch (err: any) {
      console.error(err);
      alert("Transaction failed or was rejected.");
    }
    setIsSigning(false);
  };

  // Dynamic calculations based on slider
  const initialHealthFactor = 1.15; // Example Aave health factor
  const simulatedHealthFactor = initialHealthFactor - (marketDrop / 100);
  
  const isLiquidated = simulatedHealthFactor < 1.0;
  const riskLevel = isLiquidated ? "Critical" : marketDrop > 10 ? "High" : "Medium";
  const riskColor = isLiquidated ? "text-red-500" : marketDrop > 10 ? "text-orange-500" : "text-yellow-500";
  const bgRiskColor = isLiquidated ? "bg-red-500/10 border-red-500/30" : marketDrop > 10 ? "bg-orange-500/10 border-orange-500/30" : "bg-yellow-500/10 border-yellow-500/30";

  const flags = [
    { severity: isLiquidated ? "Critical" : "High", title: isLiquidated ? "Liquidation Imminent" : "High Utilization on Compound", desc: isLiquidated ? "Your simulated health factor dropped below 1.0." : "Borrow position is at 85% of collateral limit." },
    { severity: "Medium", title: "Single Protocol Concentration", desc: "90% of DeFi activity is on Aave. Consider diversifying." },
  ];

  return (
    <div className={`glass-panel rounded-3xl p-8 mt-8 border transition-colors duration-500 ${bgRiskColor}`}>
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className={`${riskColor} w-6 h-6 transition-colors duration-500`} />
        <h3 className={`font-display font-bold text-2xl transition-colors duration-500 ${riskColor}`}>AI Risk Analysis</h3>
      </div>

      <div className="flex justify-between items-center mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
        <span className="text-white font-bold">Overall Risk Level</span>
        <span className={`px-4 py-1 rounded-full font-bold text-black transition-colors duration-500 ${isLiquidated ? 'bg-red-500' : marketDrop > 10 ? 'bg-orange-500' : 'bg-yellow-500'}`}>{riskLevel}</span>
      </div>

      {/* Predictive Stress Test Slider */}
      <div className="mb-8 p-6 bg-secondary/30 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold flex items-center gap-2"><TrendingDown className="w-4 h-4 text-accent" /> Predictive Stress Test</h4>
          <span className="font-mono text-accent">-{marketDrop}% ETH Price</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="30" 
          value={marketDrop} 
          onChange={(e) => setMarketDrop(Number(e.target.value))}
          className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
          <span>Current (HF: {initialHealthFactor})</span>
          <span>Crash (HF: {simulatedHealthFactor.toFixed(2)})</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
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

      {/* Auto-Defender Trigger */}
      <AnimatePresence>
        {isLiquidated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <button 
              onClick={() => setShowDefender(true)}
              className="w-full bg-red-500/20 border border-red-500/50 hover:bg-red-500/40 text-red-100 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldAlert className="w-5 h-5" /> Activate AI Auto-Defender
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-Defender Modal */}
      <AnimatePresence>
        {showDefender && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-primary/30 rounded-3xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,240,255,0.15)] relative overflow-hidden"
            >
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 text-primary">
                <Cpu className="w-8 h-8" />
                <h3 className="font-display text-2xl font-bold glow-text">AI Defender Executing</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                The AI has drafted a smart contract transaction to save this portfolio from liquidation.
                {!isOwner ? (
                  <span className="block mt-2 text-yellow-500 font-bold">
                    Since you are in "Watch Mode" for this address, signing is disabled. Here is the generated simulation:
                  </span>
                ) : (
                  <span className="block mt-2 text-green-400 font-bold">
                    You are the owner of this portfolio. You can sign this rescue transaction now:
                  </span>
                )}
              </p>

              <div className="bg-black border border-white/10 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto mb-6">
                <div className="text-white/50 text-xs mb-2">// Generated Calldata for Aave V3 Repayment</div>
                <div>To: 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2</div>
                <div>Method: repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf)</div>
                <div className="mt-2 text-yellow-500">
                  Data: 0x573ade81000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000000000000000000000002
                </div>
                <div className="mt-4 text-white/50">Estimated Gas: 145,230 (~$1.42)</div>
              </div>

              <div className="flex justify-end gap-4 relative z-10">
                <button 
                  onClick={() => setShowDefender(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white transition-colors font-bold"
                >
                  Close Simulation
                </button>
                <button 
                  onClick={handleSign}
                  disabled={!isOwner || isSigning}
                  className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                    isOwner 
                      ? "bg-primary text-primary-foreground hover:scale-105" 
                      : "bg-primary/50 text-black cursor-not-allowed"
                  }`}
                >
                  {!isOwner ? "Sign via MetaMask (Disabled)" : isSigning ? "Signing..." : "Sign Rescue Transaction"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
