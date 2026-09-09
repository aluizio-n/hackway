"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";

const fieldClasses =
  "w-full box-border bg-panel border border-[#1E293B] rounded-[10px] px-[14px] py-3 text-white text-sm font-sans placeholder:text-[#334155] focus:outline-none focus:border-accent transition-colors";

interface LabelProps {
  label?: string;
}

export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-semibold text-subtle mb-1.5 block tracking-wide">{children}</label>
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & LabelProps>(
  function Input({ label, className = "", ...props }, ref) {
    return (
      <div>
        {label && <Label>{label}</Label>}
        <input ref={ref} className={`${fieldClasses} ${className}`} {...props} />
      </div>
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & LabelProps>(
  function Textarea({ label, className = "", ...props }, ref) {
    return (
      <div>
        {label && <Label>{label}</Label>}
        <textarea ref={ref} className={`${fieldClasses} resize-y leading-relaxed ${className}`} {...props} />
      </div>
    );
  }
);
