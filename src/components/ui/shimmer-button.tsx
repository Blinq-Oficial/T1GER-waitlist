"use client";

import React from "react";
import { cn } from "../../lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#FF6B00",
      shimmerDuration = "3s",
      borderRadius = "8px",
      background = "rgba(10, 10, 10, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--sk-shimmer-color": shimmerColor,
            "--sk-radius": borderRadius,
            "--sk-speed": shimmerDuration,
            "--sk-bg": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3.5 text-white shadow-2xl transition-all duration-300 active:scale-95 hover:scale-[1.02]",
          "rounded-[var(--sk-radius)] bg-[var(--sk-bg)]",
          "border border-white/10 hover:border-[#FF6B00]/50",
          "shadow-[0_0_20px_rgba(255,107,0,0.15)] hover:shadow-[0_0_35px_rgba(255,107,0,0.35)]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer sweep animation overlay */}
        <div
          className={cn(
            "-z-30 absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-spin [aspect-ratio:1] [background:radial-gradient(circle_at_50%_50%,var(--sk-shimmer-color)_0%,transparent_60%)] [inset:0_auto_auto_0]" />
        </div>

        {/* Backdrop overlay */}
        <div className="absolute inset-[1px] -z-20 rounded-[calc(var(--sk-radius)-1px)] bg-[#070707] transition-colors group-hover:bg-[#0d0d0d]" />

        {/* Subtle glowing highlight */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-[#FF6B00]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-white group-hover:text-[#CCFF00] transition-colors">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
