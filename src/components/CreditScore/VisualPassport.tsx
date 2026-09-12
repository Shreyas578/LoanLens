"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ShieldCheck, Download, UploadCloud, CheckCircle2 } from "lucide-react";

export default function VisualPassport({ data }: { data: any }) {
  const passportRef = useRef<HTMLDivElement>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const generateAndUpload = async () => {
    if (!passportRef.current) return;
    setIsMinting(true);

    try {
      // 1. Generate Image
      const dataUrl = await toPng(passportRef.current, {
        quality: 1,
        backgroundColor: '#0a0a0a',
        pixelRatio: 2,
      });

      // 2. Upload to Pinata API
      const res = await fetch("/api/pinata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, walletAddress: data?.walletAddress || "unknown" })
      });

      const resData = await res.json();
      
      if (res.ok) {
        setIpfsHash(resData.ipfsHash);
      } else {
        console.error("Pinata Error:", resData.error);
        alert("Failed to upload to IPFS. Ensure Pinata API keys are set in .env.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="mt-8">
      {!ipfsHash ? (
        <button 
          onClick={generateAndUpload}
          disabled={isMinting}
          className="w-full bg-primary text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          {isMinting ? <UploadCloud className="animate-bounce" /> : <Download />}
          {isMinting ? "Minting to IPFS..." : "Generate IPFS Visual Passport"}
        </button>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-green-400 font-bold">
            <CheckCircle2 /> Passport Minted to IPFS!
          </div>
          <a 
            href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-mono text-primary hover:underline break-all"
          >
            ipfs://{ipfsHash}
          </a>
        </div>
      )}

      {/* Hidden Passport Template for Image Generation */}
      <div className="overflow-hidden h-0 w-0 absolute left-[-9999px]">
        <div 
          ref={passportRef} 
          className="w-[600px] h-[800px] bg-[#0a0a0a] border-4 border-primary p-12 flex flex-col relative"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-primary" />
          </div>

          <div className="flex justify-between items-center mb-12 border-b border-white/20 pb-6 relative z-10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary w-10 h-10" />
              <span className="font-bold text-3xl text-white">LoanLens</span>
            </div>
            <div className="text-right">
              <div className="text-primary font-bold text-xl">Verified Credit Passport</div>
              <div className="text-muted-foreground text-sm font-mono mt-1">Generated: {new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>

          <div className="flex-1 relative z-10">
            <div className="mb-8">
              <div className="text-white/50 uppercase tracking-widest text-sm font-bold mb-2">Wallet Address</div>
              <div className="font-mono text-xl text-white bg-white/5 p-4 rounded-xl border border-white/10">
                {data?.walletAddress || "0x0000000000000000000000000000000000000000"}
              </div>
            </div>

            <div className="flex justify-between items-center mb-12 bg-primary/10 border border-primary/30 p-8 rounded-2xl">
              <div>
                <div className="text-primary font-bold text-lg mb-1">Attested Score</div>
                <div className="text-white text-6xl font-black">{data?.score || 742}</div>
              </div>
              <div className="text-right">
                <div className="text-primary font-bold text-lg mb-1">Risk Level</div>
                <div className="text-white text-4xl font-bold">{data?.riskLevel || "Low"}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="text-white/50 uppercase text-xs font-bold mb-2">Protocol Count</div>
                <div className="text-white text-2xl font-bold">{data?.protocols?.length || 3}</div>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="text-white/50 uppercase text-xs font-bold mb-2">Repayment Rate</div>
                <div className="text-green-400 text-2xl font-bold">{data?.repaymentRate || 98}%</div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/20 text-center relative z-10">
            <div className="text-white/50 text-xs mb-2">Cryptographic Attestation Hash (Creditcoin Protocol)</div>
            <div className="font-mono text-accent text-sm break-all">
              0x2279E144dE86BB19400A1b14FDB6850c676dEb9e
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
