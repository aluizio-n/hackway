"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost" | "outline";

const base = "inline-flex items-center justify-center gap-2 rounded-[10px] text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-accent to-accent-dark px-5 py-[13px] hover:-translate-y-px hover:shadow-[0_8px_24px_#7C5CFF33]",
  ghost: "text-subtle px-5 py-[10px] border border-[#1E293B] hover:border-[#334155] hover:text-[#94A3B8]",
  outline: "text-accent px-3.5 py-1.5 border border-accent/20 hover:bg-accent/10",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className = "", ...props },
  ref
) {
  return <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />;
});
