"use client";

import { useState } from "react";
import { MessageSquare, Send, X, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPanel({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot", text: string }[]>([
    { role: "bot", text: "Hi! I'm LoanLens AI. I've reviewed your verified credit profile. Want to negotiate a loan or need help interpreting your score?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          context: data // Passing attested data to the AI for context
        })
      });
      
      const resData = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: resData.reply || "I'm having trouble connecting right now." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "Network error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedQuestions = [
    "Why is my score 742?",
    "Which lender is best for me?",
    "Will Goldfinch approve me?"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-primary text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-110 transition-transform z-50 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-96 h-[500px] glass-panel border border-primary/30 rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden bg-background/95"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-primary/10">
              <div className="flex items-center gap-2">
                <Bot className="text-primary w-5 h-5" />
                <span className="font-bold text-sm">LoanLens AI Negotiator</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent/20" : "bg-primary/20"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-accent" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`p-3 rounded-xl max-w-[80%] text-sm ${msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-secondary/50 text-white"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 text-white flex items-center gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                    <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input & Suggestions */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
                {suggestedQuestions.map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setInput(q); }}
                    className="whitespace-nowrap text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm outline-none focus:border-primary transition-colors"
                />
                <button type="submit" disabled={!input.trim() || isTyping} className="bg-primary text-black p-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
