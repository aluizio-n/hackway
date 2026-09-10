"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useId } from "react";

// text-base em mobile evita o zoom automático do iOS; text-sm a partir de sm.
const fieldClasses =
  "w-full box-border bg-panel border border-[#1E293B] rounded-[10px] px-[14px] py-3 text-white text-base sm:text-sm font-sans placeholder:text-[#334155] transition-colors focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 disabled:opacity-60";

interface FieldProps {
  label?: string;
  /** Texto de apoio ou mensagem de erro exibida abaixo do campo. */
  hint?: string;
  error?: string;
}

export const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold tracking-wide text-subtle">
    {children}
  </label>
);

function FieldHint({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  if (!error && !hint) return null;
  return (
    <p id={id} className={`mt-1.5 text-xs ${error ? "text-danger" : "text-muted"}`}>
      {error || hint}
    </p>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(
  function Input({ label, hint, error, className = "", id, ...props }, ref) {
    const autoId = useId();
    const fieldId = id || autoId;
    const hintId = `${fieldId}-hint`;

    return (
      <div className="min-w-0">
        {label && <Label htmlFor={fieldId}>{label}</Label>}
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? hintId : undefined}
          className={`${fieldClasses} ${error ? "border-danger/60" : ""} ${className}`}
          {...props}
        />
        <FieldHint id={hintId} hint={hint} error={error} />
      </div>
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(
  function Textarea({ label, hint, error, className = "", id, ...props }, ref) {
    const autoId = useId();
    const fieldId = id || autoId;
    const hintId = `${fieldId}-hint`;

    return (
      <div className="min-w-0">
        {label && <Label htmlFor={fieldId}>{label}</Label>}
        <textarea
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? hintId : undefined}
          className={`${fieldClasses} resize-y leading-relaxed ${error ? "border-danger/60" : ""} ${className}`}
          {...props}
        />
        <FieldHint id={hintId} hint={hint} error={error} />
      </div>
    );
  }
);
