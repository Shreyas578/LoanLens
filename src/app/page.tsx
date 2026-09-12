"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [isAttesting, setIsAttesting] = useState(false);

  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;
    setIsAttesting(true);
    
    try {
      // In a real production scenario, this would trigger the actual attestation process.
      // We simulate a short delay for the "verification" visual before routing.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(`/score/${wallet}`);
    } catch (error) {
      console.error(error);
      setIsAttesting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[150px] pointer-events-none" />

      {/* Header / Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
        <Image src="/logo.png" alt="LoanLens Logo" width={40} height={40} className="rounded-xl drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
        <span className="font-display font-bold text-2xl tracking-tight text-white glow-text">LoanLens</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center max-w-3xl w-full px-6"
      >
        <h1 className="font-display text-5xl md:text-7xl font-bold text-center leading-tight mb-6">
          Your On-Chain Identity. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glow-text">
            Verified & Trusted.
          </span>
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto text-center">
          Your on-chain financial identity. AI-analyzed, zero-knowledge verifiable, and permanently attested on the Creditcoin protocol.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-accent mb-12 opacity-80">
          <span className="bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Reads from All Chains</span>
          <span className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20 text-primary">Attested on Creditcoin</span>
          <span className="bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Projected Omnichain</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-all duration-500 group-hover:bg-primary/30" />
          <div className="relative glass-panel rounded-2xl p-2 flex items-center gap-3">
            <Search className="text-muted-foreground ml-3 w-6 h-6" />
            <input 
              suppressHydrationWarning
              type="text" 
              placeholder="Enter Wallet Address (0x...) or ENS" 
              className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-muted-foreground/70 py-4 font-mono"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            />
            <button 
              suppressHydrationWarning
              type="submit" 
              disabled={isAttesting}
              className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2 font-display tracking-wide"
            >
              {isAttesting ? (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="animate-pulse" /> Attesting...
                </span>
              ) : (
                "Analyze Profile"
              )}
            </button>
          </div>
        </form>

        {/* Attestcoin Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-full border border-border"
        >
          <ShieldCheck className="w-4 h-4 text-accent" />
          Powered by Attestcoin Protocol on Creditcoin Testnet
        </motion.div>
      </motion.div>
    </main>
  );
}
