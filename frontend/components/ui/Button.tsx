"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-accent to-accent-dark hover:-translate-y-px hover:shadow-[0_8px_24px_#7C5CFF33] active:translate-y-0",
  ghost: "text-subtle border border-[#1E293B] hover:border-[#334155] hover:text-[#94A3B8]",
  outline: "text-accent border border-accent/20 hover:bg-accent/10",
  danger: "text-danger border border-danger/25 hover:bg-danger/10",
};

// Alvo de toque de 44px em mobile, compactando só a partir de sm (WCAG 2.5.5)
const sizes: Record<Size, string> = {
  sm: "min-h-[40px] px-3.5 text-[13px] sm:min-h-0 sm:py-1.5",
  md: "min-h-[44px] px-5 text-sm sm:min-h-0 sm:py-[13px] sm:text-[13px]",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Ocupa a largura toda — padrão em mobile para formulários. */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", fullWidth = false, className = "", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
});
