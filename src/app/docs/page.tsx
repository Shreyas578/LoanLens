"use client";

import { Book, Code, Shield, Network } from "lucide-react";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-display font-black mb-6 glow-text">LoanLens Documentation</h1>
          <p className="text-muted-foreground text-lg mb-12">
            The technical architecture behind the AI-powered cross-chain credit protocol.
          </p>

          <div className="space-y-12">
            
            {/* Section 1 */}
            <section className="glass-panel p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Network className="text-primary w-8 h-8" />
                <h2 className="text-3xl font-display font-bold">1. Omnichain Architecture</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                LoanLens aggregates financial data from all major EVM chains (Ethereum, Arbitrum, Polygon). Using ethers.js, we parse a wallet's interaction with major DeFi protocols (Aave, Compound, Uniswap). 
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The final attested credit score is stored in the <code>LoanLensScoreRegistry.sol</code> smart contract deployed on the <strong>Creditcoin Testnet</strong>. From there, it can be projected to any destination chain using LayerZero or CCIP architecture, allowing lenders globally to underwrite loans based on the Creditcoin source of truth.
              </p>
            </section>

            {/* Section 2 */}
            <section className="glass-panel p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-primary w-8 h-8" />
                <h2 className="text-3xl font-display font-bold">2. Attestcoin Protocol Integration</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We leverage the <code>@gluwa/usc-sdk</code> to wrap the generated AI credit profile into a cryptographic attestation. This ensures that the credit data presented to lenders has not been tampered with since generation.
              </p>
              <div className="bg-black border border-white/10 p-4 rounded-xl font-mono text-sm text-green-400">
                // Example USC Attestation Submission<br/>
                const attestation = await client.submitAttestation(payload);<br/>
                const hash = attestation.attestationHash;
              </div>
            </section>

            {/* Section 3 */}
            <section className="glass-panel p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Code className="text-primary w-8 h-8" />
                <h2 className="text-3xl font-display font-bold">3. Smart Contract Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our smart contracts strictly adhere to OpenZeppelin 5.x standards. The <code>LoanLensCreditNFT</code> implements the <strong>ERC-5192 Soulbound standard</strong> to ensure credit passports are non-transferable. Access control (<code>Ownable</code>) is strictly enforced on the <code>recordScore</code> registry to prevent spoofing attacks.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
