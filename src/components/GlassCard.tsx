/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import { motion } from "motion/react";

interface GlassCardProps {
  id?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  glowColor?: "cyan" | "blue" | "purple" | "none";
  hoverable?: boolean;
}

export default function GlassCard({
  id,
  children,
  className = "",
  delay = 0,
  glowColor = "none",
  hoverable = true,
}: GlassCardProps) {
  const getGlowClass = () => {
    switch (glowColor) {
      case "cyan":
        return "shadow-[0_0_20px_rgba(0,240,255,0.1)] border-neon-cyan/20";
      case "blue":
        return "shadow-[0_0_20px_rgba(0,136,255,0.1)] border-neon-blue/20";
      case "purple":
        return "shadow-[0_0_20px_rgba(189,0,255,0.1)] border-neon-purple/20";
      default:
        return "border-neon-cyan/10";
    }
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 15,
        delay,
      }}
      whileHover={
        hoverable
          ? {
              y: -4,
              borderColor:
                glowColor === "cyan"
                  ? "rgba(0, 240, 255, 0.4)"
                  : glowColor === "blue"
                  ? "rgba(0, 136, 255, 0.4)"
                  : glowColor === "purple"
                  ? "rgba(189, 0, 255, 0.4)"
                  : "rgba(0, 240, 255, 0.25)",
              boxShadow:
                glowColor === "cyan"
                  ? "0 10px 25px -5px rgba(0, 240, 255, 0.15)"
                  : glowColor === "blue"
                  ? "0 10px 25px -5px rgba(0, 136, 255, 0.15)"
                  : glowColor === "purple"
                  ? "0 10px 25px -5px rgba(189, 0, 255, 0.15)"
                  : "0 10px 25px -5px rgba(0, 240, 255, 0.08)",
            }
          : undefined
      }
      className={`glass-panel rounded-2xl p-5 border relative overflow-hidden transition-colors duration-300 ${getGlowClass()} ${className}`}
    >
      {/* Decorative cybernetic corner accents */}
      <div className="absolute top-0 left-0 w-2 h-[1px] bg-neon-cyan/40" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-neon-cyan/40" />
      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-neon-cyan/40" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-neon-cyan/40" />
      
      {children}
    </motion.div>
  );
}
