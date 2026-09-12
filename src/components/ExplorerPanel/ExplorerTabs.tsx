"use client";

import { useState } from "react";
import { Activity, LayoutDashboard, History, Layers, Image as ImageIcon, LineChart, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "transactions", label: "Tx History", icon: History },
  { id: "defi", label: "DeFi Activity", icon: Layers },
  { id: "nft", label: "NFT Portfolio", icon: ImageIcon },
  { id: "chains", label: "Chain Comp", icon: LineChart },
  { id: "omnichain", label: "Omnichain", icon: Globe },
];

export default function ExplorerTabs({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="glass-panel rounded-3xl overflow-hidden mt-8">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-border bg-secondary/20 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-display font-bold text-sm transition-colors relative whitespace-nowrap ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && <OverviewTab data={data} />}
            {activeTab === "transactions" && <TransactionsTab data={data} />}
            {activeTab === "defi" && <DeFiTab data={data} />}
            {activeTab === "nft" && <NFTTab data={data} />}
            {activeTab === "chains" && <ChainsTab data={data} />}
            {activeTab === "omnichain" && <OmnichainTab data={data} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Sub-components for Tabs

function OverviewTab({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard label="Wallet Age" value={`${data?.walletAge || 420} days`} />
      <StatCard label="Total Txs" value={data?.txCount || 156} />
      <StatCard label="Net Worth Est." value={`$${(data?.nftValue || 1200) + 4000}`} />
      <StatCard label="Active Chains" value={data?.chains?.length || 2} />
    </div>
  );
}

function TransactionsTab({ data }: { data: any }) {
  // Mock data for the hackathon UI
  const txs = [
    { date: "2026-09-08", chain: "Ethereum", type: "Swap", protocol: "Uniswap", amount: "1.5 ETH", status: "Success" },
    { date: "2026-09-05", chain: "Creditcoin", type: "Borrow", protocol: "LoanLens", amount: "5000 USDC", status: "Success" },
    { date: "2026-09-01", chain: "Polygon", type: "Supply", protocol: "Aave", amount: "2.0 wBTC", status: "Success" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="pb-3">Date</th>
            <th className="pb-3">Chain</th>
            <th className="pb-3">Type</th>
            <th className="pb-3">Protocol</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((tx, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-4">{tx.date}</td>
              <td className="py-4 text-accent">{tx.chain}</td>
              <td className="py-4 text-primary">{tx.type}</td>
              <td className="py-4">{tx.protocol}</td>
              <td className="py-4 font-mono">{tx.amount}</td>
              <td className="py-4 text-green-400">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeFiTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
          <h3 className="font-display font-bold mb-4 text-primary">Open Positions</h3>
          <div className="flex justify-between items-center text-sm mb-2">
            <span>Aave v3 (Supply)</span> <span className="font-mono">$12,450</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Compound (Borrow)</span> <span className="font-mono text-destructive">$3,200</span>
          </div>
        </div>
        <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
          <h3 className="font-display font-bold mb-4 text-accent">Health Metrics</h3>
          <div className="flex justify-between items-center text-sm mb-2">
            <span>Repayment Rate</span> <span className="font-bold text-green-400">{data?.repaymentRate || 98}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Liquidations</span> <span className="font-bold">{data?.liquidations || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NFTTab({ data }: { data: any }) {
  return (
    <div className="text-center text-muted-foreground p-8">
      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>Connect Alchemy API in .env to fetch live NFT grid.</p>
      <p className="mt-2 text-sm text-primary">Estimated Value: ${data?.nftValue || 1200}</p>
    </div>
  );
}

function ChainsTab({ data }: { data: any }) {
  const chartData = [
    { name: "Ethereum", txs: 120 },
    { name: "Polygon", txs: 30 },
    { name: "Creditcoin", txs: 6 },
  ];

  return (
    <div className="h-64 w-full">
      <h3 className="font-display font-bold mb-4">Activity by Chain</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#666" />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px' }} />
          <Bar dataKey="txs" fill="#00F0FF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function OmnichainTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
        <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <Globe className="text-primary w-5 h-5" /> LayerZero Cross-Chain Projection
        </h3>
        <p className="text-muted-foreground text-sm mb-6">
          Your Creditcoin Testnet score can be seamlessly projected to other chains via CCIP/LayerZero to underwrite loans globally.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="bg-secondary/30 p-4 rounded-xl border border-white/5 text-center">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-2">Source Chain</div>
            <div className="font-bold text-primary">Creditcoin Testnet</div>
            <div className="text-xs font-mono mt-1 opacity-50">Score: {data?.score || 742}</div>
          </div>
          
          <div className="flex justify-center text-accent">
            <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              →
            </motion.div>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-xl border border-white/5 text-center">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-2">Destination</div>
            <div className="font-bold text-white">Arbitrum Sepolia</div>
            <div className="text-xs font-mono mt-1 text-green-400">Score Syncing...</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[#0a0a0a] rounded-xl border border-white/5 font-mono text-xs text-white/50 overflow-x-auto">
          <div>// LayerZero Simulated Payload</div>
          <div className="text-accent mt-2">{"{"}</div>
          <div className="ml-4">"dstChainId": 421614,</div>
          <div className="ml-4">"payload": "0x00000000000000000000000000000000000000000000000000000000000002e6",</div>
          <div className="ml-4">"adapterParams": "0x0001000000000000000000000000000000000000000000000000000000000030d40"</div>
          <div className="text-accent">{"}"}</div>
        </div>
      </div>
    </div>
  );
}

// Utility
function StatCard({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="p-6 bg-background rounded-2xl border border-border flex flex-col justify-center">
      <span className="text-muted-foreground text-sm mb-1">{label}</span>
      <span className="font-display font-bold text-2xl">{value}</span>
    </div>
  );
}
