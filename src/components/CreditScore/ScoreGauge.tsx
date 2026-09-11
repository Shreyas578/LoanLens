"use client";

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

export default function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  // Normalize score between 300 and 850
  const normalizedScore = Math.max(300, Math.min(850, score));
  const percentage = ((normalizedScore - 300) / 550) * 100;
  
  // Color calculation based on grade
  const getColor = () => {
    if (score >= 750) return "#00ff66"; // Excellent - Green
    if (score >= 650) return "#00f0ff"; // Good - Cyan
    if (score >= 550) return "#fbbf24"; // Fair - Yellow
    if (score >= 450) return "#f97316"; // Poor - Orange
    return "#ff003c"; // Very Poor - Red
  };

  const strokeColor = getColor();

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Background glow */}
      <div 
        className="absolute inset-0 blur-3xl opacity-20 rounded-full" 
        style={{ backgroundColor: strokeColor }}
      />
      
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
        />
        {/* Foreground circle (animated) */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 300" }}
          animate={{ strokeDasharray: `${(percentage / 100) * 283} 300` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="drop-shadow-[0_0_8px_currentColor]"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-5xl font-display font-bold text-white glow-text"
        >
          {score}
        </motion.span>
        <span className="text-muted-foreground font-mono text-sm uppercase mt-1">Grade {grade}</span>
      </div>
    </div>
  );
}
