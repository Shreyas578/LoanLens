"use client";

import { Book, Code, Shield, Network, Cpu, Database, Terminal, FileJson, Layers, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 pb-32">
      <div className="max-w-6xl mx-auto mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-12 border-b border-white/10 pb-8 flex justify-between items-end">
            <div>
              <h1 className="text-5xl md:text-7xl font-display font-black mb-6 glow-text tracking-tight">LoanLens Protocol Docs</h1>
              <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl leading-relaxed">
                The comprehensive technical reference for integrating, verifying, and deploying the LoanLens AI-powered cross-chain credit protocol.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-mono text-sm border border-primary/20">
              <Zap className="w-4 h-4" /> v2.4.1 (Creditcoin Testnet)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Sidebar Navigation */}
            <div className="hidden md:block col-span-1 sticky top-32 h-fit">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Documentation Index</div>
              <nav className="space-y-4 border-l border-white/10 pl-4">
                <a href="#core-concepts" className="block text-sm text-white/70 hover:text-primary transition-all hover:translate-x-1">1. Core Concepts</a>
                <a href="#architecture" className="block text-sm text-white/70 hover:text-primary transition-all hover:translate-x-1">2. Omnichain Architecture</a>
                <a href="#ai-engine" className="block text-sm text-white/70 hover:text-primary transition-all hover:translate-x-1">3. Groq AI Risk Engine</a>
                <a href="#attestation" className="block text-sm text-white/70 hover:text-primary transition-all hover:translate-x-1">4. Creditcoin Attestation</a>
                <a href="#risk-defender" className="block text-sm text-white/70 hover:text-primary transition-all hover:translate-x-1">5. AI Auto-Defender</a>
                <a href="#smart-contracts" className="block text-sm text-white/70 hover:text-primary transition-all hover:translate-x-1">6. Smart Contracts (ABI)</a>
                <a href="#api" className="block text-sm text-white/70 hover:text-primary transition-all hover:translate-x-1">7. REST API Reference</a>
                <a href="#integration" className="block text-sm text-white/70 hover:text-primary transition-all hover:translate-x-1">8. React Integration Guide</a>
              </nav>
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-3 space-y-24">
              
              {/* Section 1: Core Concepts */}
              <section id="core-concepts" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-500/10 rounded-xl"><Book className="text-blue-500 w-8 h-8" /></div>
                  <h2 className="text-4xl font-display font-bold">1. Core Concepts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-secondary/40 p-6 rounded-2xl border border-white/5">
                    <h3 className="font-bold text-lg mb-2 text-white">Undercollateralized Lending</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">LoanLens provides the cryptographic trust necessary to allow protocols to lend out capital without requiring 150%+ overcollateralization, unlocking massive liquidity for DeFi.</p>
                  </div>
                  <div className="bg-secondary/40 p-6 rounded-2xl border border-white/5">
                    <h3 className="font-bold text-lg mb-2 text-white">Zero-Knowledge Identity</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Users shouldn't have to dox their entire financial history. LoanLens generates a ZK-proof of creditworthiness that abstracts away sensitive raw transactional data.</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Architecture */}
              <section id="architecture" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 rounded-xl"><Network className="text-primary w-8 h-8" /></div>
                  <h2 className="text-4xl font-display font-bold">2. Omnichain Architecture</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  LoanLens operates as a stateless data aggregator on the frontend, parsing a user's on-chain interaction history across major EVM chains (Ethereum, Arbitrum, Optimism) using <code>ethers.js</code>. By analyzing interactions with blue-chip DeFi protocols, LoanLens builds a highly accurate profile of borrowing and repayment behavior.
                </p>
                <div className="bg-black/50 border border-white/10 p-6 rounded-2xl">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Database className="w-4 h-4 text-accent"/> Analyzed Data Vectors</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0"/> <strong>Liquidation History:</strong> Scans historical events for collateral seizures on Aave/Compound.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0"/> <strong>Consistent Repayment:</strong> Evaluates frequency and volume of debt repayment over a 12-month trailing period.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0"/> <strong>Asset Stability:</strong> Analyzes the ratio of volatile assets to stablecoins (USDC/USDT) held.</li>
                  </ul>
                </div>
              </section>

              {/* Section 3: AI Engine */}
              <section id="ai-engine" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-accent/10 rounded-xl"><Cpu className="text-accent w-8 h-8" /></div>
                  <h2 className="text-4xl font-display font-bold">3. Groq AI Risk Engine</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  Traditional credit scoring relies on rigid, easily-gamed formulas. LoanLens utilizes the <strong>Groq API</strong> running LLaMA-3 to process complex, multi-chain JSON transaction data at near-zero latency using Groq's specialized LPU hardware.
                </p>
                <div className="bg-[#0d1117] border border-[#30363d] p-6 rounded-2xl overflow-x-auto shadow-2xl">
                  <div className="flex items-center gap-2 text-[#8b949e] text-xs mb-4 pb-2 border-b border-[#30363d]"><Terminal className="w-3 h-3"/> src/lib/groq-service.ts</div>
                  <pre className="text-sm text-[#e6edf3] font-mono leading-relaxed">
<span className="text-[#ff7b72]">import</span> &#123; Groq &#125; <span className="text-[#ff7b72]">from</span> <span className="text-[#a5d6ff]">'groq-sdk'</span>;<br/><br/>
<span className="text-[#8b949e]">// Initialize Groq with ultra-low latency endpoint</span><br/>
<span className="text-[#ff7b72]">const</span> groq = <span className="text-[#ff7b72]">new</span> Groq(&#123; apiKey: process.env.GROQ_API_KEY &#125;);<br/><br/>
<span className="text-[#ff7b72]">export async function</span> <span className="text-[#d2a8ff]">generateCreditScore</span>(walletData: WalletProfile) &#123;<br/>
  <span className="text-[#ff7b72]">const</span> completion = <span className="text-[#ff7b72]">await</span> groq.chat.completions.create(&#123;<br/>
    messages: [&#123; role: <span className="text-[#a5d6ff]">'system'</span>, content: SYSTEM_PROMPT &#125;, &#123; role: <span className="text-[#a5d6ff]">'user'</span>, content: JSON.stringify(walletData) &#125;],<br/>
    model: <span className="text-[#a5d6ff]">'llama3-8b-8192'</span>,<br/>
    temperature: <span className="text-[#79c0ff]">0.1</span>, <span className="text-[#8b949e]">// Strict deterministic output</span><br/>
    response_format: &#123; type: <span className="text-[#a5d6ff]">'json_object'</span> &#125;<br/>
  &#125;);<br/>
  <span className="text-[#ff7b72]">return</span> JSON.parse(completion.choices[0].message.content);<br/>
&#125;
                  </pre>
                </div>
              </section>

              {/* Section 4: Attestation */}
              <section id="attestation" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-green-500/10 rounded-xl"><Shield className="text-green-500 w-8 h-8" /></div>
                  <h2 className="text-4xl font-display font-bold">4. Creditcoin Attestation</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  A score is only useful if it is verifiable on-chain. We leverage the <code>@gluwa/usc-sdk</code> to wrap the generated AI credit profile into a cryptographic attestation (Attestcoin). This zero-knowledge proof ensures that the credit data presented to lenders has not been tampered with, anchoring the identity onto the <strong>Creditcoin Testnet</strong>.
                </p>
                <div className="bg-black/50 border border-white/10 p-6 rounded-2xl">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-green-400"/> Attestation Lifecycle</h4>
                  <ol className="list-decimal list-inside space-y-4 text-sm text-muted-foreground">
                    <li><strong className="text-white">Generation:</strong> AI Engine generates the final score and JSON payload.</li>
                    <li><strong className="text-white">Validation:</strong> Frontend signs a request validating the data structure against the schema.</li>
                    <li><strong className="text-white">Proof Building:</strong> The <code>proofProvider</code> generates a ZK merkle proof of the evaluation.</li>
                    <li><strong className="text-white">Network Verification:</strong> The <code>blockProver</code> verifies the proof against the Creditcoin Testnet state.</li>
                    <li><strong className="text-white">Minting:</strong> An immutable <code>Attestcoin</code> is recorded on-chain as an ERC-5192 Soulbound Token (SBT).</li>
                  </ol>
                </div>
              </section>

              {/* Section 5: Auto-Defender */}
              <section id="risk-defender" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-red-500/10 rounded-xl"><Shield className="text-red-500 w-8 h-8" /></div>
                  <h2 className="text-4xl font-display font-bold">5. AI Auto-Defender</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
                  LoanLens goes beyond static analysis by providing predictive, real-time risk mitigation. Our <strong>Predictive Stress Test</strong> engine allows users to simulate market crashes (e.g., a 20% drop in ETH) to see how their portfolio's health factor reacts.
                </p>
                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl">
                  <h4 className="font-bold mb-2 text-red-400">Context-Aware Ownership Validation</h4>
                  <p className="text-sm text-red-200/70 leading-relaxed">
                    If the simulated health factor drops below 1.0, the UI flags an imminent liquidation risk and triggers the <strong>AI Auto-Defender</strong> to draft exact smart contract calldata (e.g., Aave V3 Repayment). Crucially, the UI verifies if the connected MetaMask wallet matches the queried profile. If you are the owner, you can instantly sign the rescue transaction. If you are viewing another user's wallet, it defaults to a secure 'Watch Mode', preventing unauthorized transaction signing.
                  </p>
                </div>
              </section>

              {/* Section 6: Smart Contracts */}
              <section id="smart-contracts" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-purple-500/10 rounded-xl"><Code className="text-purple-500 w-8 h-8" /></div>
                  <h2 className="text-4xl font-display font-bold">6. Smart Contracts (ABI)</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  Integrate LoanLens directly into your decentralized application's lending pools by reading our verified <code>ILoanLensRegistry</code> interface on the Creditcoin testnet.
                </p>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden">
                  <div className="bg-[#161b22] px-6 py-3 border-b border-[#30363d] flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-purple-400">ILoanLensRegistry.sol</span>
                  </div>
                  <pre className="text-sm text-[#e6edf3] font-mono leading-relaxed p-6 overflow-x-auto">
<span className="text-[#ff7b72]">interface</span> <span className="text-[#d2a8ff]">ILoanLensRegistry</span> &#123;<br/>
    <span className="text-[#8b949e]">/**</span><br/>
    <span className="text-[#8b949e]"> * @dev Retrieves the latest attested credit score for an address</span><br/>
    <span className="text-[#8b949e]"> * @param user The address to query</span><br/>
    <span className="text-[#8b949e]"> * @return score The AI-calculated credit score (300-850)</span><br/>
    <span className="text-[#8b949e]"> * @return timestamp When the score was last attested</span><br/>
    <span className="text-[#8b949e]"> * @return proofHash The zk-proof hash from the Gluwa USC SDK</span><br/>
    <span className="text-[#8b949e]"> */</span><br/>
    <span className="text-[#ff7b72]">function</span> <span className="text-[#d2a8ff]">getAttestedScore</span>(<span className="text-[#ff7b72]">address</span> user) <br/>
        <span className="text-[#ff7b72]">external</span> <span className="text-[#ff7b72]">view</span> <span className="text-[#ff7b72]">returns</span> (<br/>
            <span className="text-[#ff7b72]">uint16</span> score,<br/>
            <span className="text-[#ff7b72]">uint256</span> timestamp,<br/>
            <span className="text-[#ff7b72]">bytes32</span> proofHash<br/>
        );<br/>
&#125;
                  </pre>
                </div>
              </section>

              {/* Section 7: REST API */}
              <section id="api" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-yellow-500/10 rounded-xl"><FileJson className="text-yellow-500 w-8 h-8" /></div>
                  <h2 className="text-4xl font-display font-bold">7. REST API Reference</h2>
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden mb-6">
                  <div className="bg-[#161b22] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">POST</span>
                      <span className="font-mono text-sm font-bold text-white">/api/score</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Generates a credit profile payload</span>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">Request Body (JSON)</h5>
                      <pre className="text-xs text-[#e6edf3] font-mono bg-black/50 p-4 rounded-xl border border-white/5">
&#123;
  "walletData": &#123;
    "walletAddress": "0x123...abc",
    "txCount": 156,
    "protocols": ["Aave", "Uniswap"],
    "repaymentRate": 98,
    "liquidations": 0,
    "collateralRatio": 145,
    "chains": ["Ethereum Sepolia"]
  &#125;
&#125;
                      </pre>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">Response (200 OK)</h5>
                      <pre className="text-xs text-[#e6edf3] font-mono bg-black/50 p-4 rounded-xl border border-white/5">
&#123;
  "score": 742,
  "grade": "B+",
  "narrative": "Excellent repayment...",
  "strengths": ["No liquidations"],
  "weaknesses": ["Low stablecoin ratio"],
  "lender_summary": "Highly recommended"
&#125;
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 8: Integration */}
              <section id="integration" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 rounded-xl"><Code className="text-primary w-8 h-8" /></div>
                  <h2 className="text-4xl font-display font-bold">8. React Integration Guide</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  Drop the LoanLens validation hook directly into your Next.js or React application to gate access to undercollateralized lending pools.
                </p>
                <div className="bg-[#0d1117] border border-[#30363d] p-6 rounded-2xl overflow-x-auto shadow-2xl">
                  <pre className="text-sm text-[#e6edf3] font-mono leading-relaxed">
<span className="text-[#ff7b72]">import</span> &#123; useLoanLens &#125; <span className="text-[#ff7b72]">from</span> <span className="text-[#a5d6ff]">'@loanlens/react'</span>;<br/><br/>
<span className="text-[#ff7b72]">export function</span> <span className="text-[#d2a8ff]">LendingPool</span>() &#123;<br/>
  <span className="text-[#ff7b72]">const</span> &#123; score, isAttested, verify &#125; = <span className="text-[#d2a8ff]">useLoanLens</span>(userAddress);<br/><br/>
  <span className="text-[#ff7b72]">if</span> (!isAttested) &#123;<br/>
    <span className="text-[#ff7b72]">return</span> &lt;<span className="text-[#7ee787]">button</span> <span className="text-[#79c0ff]">onClick</span>=&#123;verify&#125;&gt;Verify Credit Score&lt;/<span className="text-[#7ee787]">button</span>&gt;;<br/>
  &#125;<br/><br/>
  <span className="text-[#ff7b72]">return</span> (<br/>
    &lt;<span className="text-[#7ee787]">div</span>&gt;<br/>
      Your Score: &#123;score&#125;<br/>
      &#123;score &gt; <span className="text-[#79c0ff]">700</span> ? &lt;<span className="text-[#d2a8ff]">UndercollateralizedLoanForm</span> /&gt; : &lt;<span className="text-[#d2a8ff]">StandardLoanForm</span> /&gt;&#125;<br/>
    &lt;/<span className="text-[#7ee787]">div</span>&gt;<br/>
  );<br/>
&#125;
                  </pre>
                </div>
              </section>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
