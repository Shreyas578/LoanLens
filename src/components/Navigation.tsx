"use client";

import { ShieldCheck, User, Building, Newspaper } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";

export default function Navigation() {
  const [isLenderMode, setIsLenderMode] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Sync with local storage or state management in a real app
  useEffect(() => {
    const mode = localStorage.getItem("loanlens_mode");
    if (mode === "lender") setIsLenderMode(true);
    
    const savedWallet = localStorage.getItem("loanlens_wallet");
    if (savedWallet) setWalletAddress(savedWallet);
    
    const handleWalletChange = () => {
      setWalletAddress(localStorage.getItem("loanlens_wallet"));
    };
    window.addEventListener("wallet_changed", handleWalletChange);
    return () => window.removeEventListener("wallet_changed", handleWalletChange);
  }, []);

  const toggleMode = () => {
    const newMode = !isLenderMode;
    setIsLenderMode(newMode);
    localStorage.setItem("loanlens_mode", newMode ? "lender" : "borrower");
    // Dispatch an event to notify other components
    window.dispatchEvent(new Event('mode_changed'));
  };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        localStorage.setItem("loanlens_wallet", address);
        window.dispatchEvent(new Event('wallet_changed'));
      } catch (err) {
        console.error("Failed to connect wallet", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <nav suppressHydrationWarning className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-white/5 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <ShieldCheck className="text-primary w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="font-display font-bold text-xl glow-text hidden sm:inline-block">LoanLens</span>
        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 ml-8">
          <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/news" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            Market Intel
          </Link>
          <Link href="/docs" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            Docs
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/news" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <Newspaper className="w-4 h-4" /> Market News
        </Link>
        
        {/* Borrower / Lender Toggle */}
        <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10 relative">
          <motion.div 
            className="absolute inset-y-1 w-1/2 bg-primary rounded-full z-0"
            animate={{ left: isLenderMode ? "50%" : "0%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <button 
            suppressHydrationWarning
            onClick={() => !isLenderMode && toggleMode()}
            className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${!isLenderMode ? "text-primary-foreground" : "text-muted-foreground"}`}
          >
            <User className="w-4 h-4" /> Borrower
          </button>
          <button 
            suppressHydrationWarning
            onClick={() => isLenderMode && toggleMode()}
            className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${isLenderMode ? "text-primary-foreground" : "text-muted-foreground"}`}
          >
            <Building className="w-4 h-4" /> Lender
          </button>
        </div>

        {/* Connect Wallet Button */}
        <button 
          suppressHydrationWarning
          onClick={connectWallet}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}
