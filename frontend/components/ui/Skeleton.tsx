"use client";

/**
 * Placeholder de carregamento. Preserva o layout final para evitar
 * salto de conteúdo (CLS) quando os dados chegam.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-lg bg-[#0F1425] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[14px] border border-border bg-panel p-4 sm:p-5">
      <div className="mb-3.5 flex items-start gap-3">
        <Skeleton className="h-[42px] w-[42px] flex-shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mb-3.5 flex gap-1.5">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <Skeleton className="h-1 w-full rounded-full" />
    </div>
  );
}

/** Anuncia carregamento para leitores de tela sem poluir a tela. */
export function LoadingAnnouncer({ label = "Carregando" }: { label?: string }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {label}
    </span>
  );
}
