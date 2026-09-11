"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Newspaper, Zap } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        if (data && data.results) {
          setNews(data.results.slice(0, 9)); // Get top 9 articles
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Newspaper className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl glow-text">Market Intelligence</h1>
            <p className="text-muted-foreground">AI-Curated DeFi & Credit News</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Zap className="text-accent w-12 h-12 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group glass-panel p-6 rounded-3xl hover:bg-white/5 transition-all cursor-pointer flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                      {item.source.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-3 line-clamp-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-primary">
                    <Zap className="w-3 h-3" /> AI Summary Ready
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
