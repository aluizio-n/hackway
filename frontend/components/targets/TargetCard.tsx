"use client";

import Link from "next/link";
import { Icon } from "@/lib/icons";
import { typeVisual, typeLabel, statusLabel, statusColors } from "@/lib/constants";
import type { Target, TargetTypeMeta } from "@/lib/types";

export function TargetCard({ target, types }: { target: Target; types: TargetTypeMeta[] }) {
  const visual = typeVisual(target.type);
  const colors = statusColors(target.status);
  const scopeCount = target.scope_phases.filter(Boolean).length;

  return (
    // <Link> em vez de div+onClick: navega por teclado, abre em nova aba e é lido como link.
    <Link
      href={`/targets/${target.id}`}
      className="focus-ring group relative block overflow-hidden rounded-[14px] border border-border bg-panel p-4 transition-all hover:border-accent/20 hover:shadow-[0_8px_32px_#00000044] sm:p-5 sm:hover:-translate-y-0.5"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5" style={{ background: colors.line }} />

      <div className="mb-3.5 flex items-start gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl sm:h-[42px] sm:w-[42px]"
          style={{ background: `${visual.color}18`, color: visual.color }}
        >
          <Icon name={visual.icon} size={20} color={visual.color} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="mb-0.5 truncate text-sm font-semibold text-white">{target.name}</h3>
          {/* break-all: endereços longos (URLs, hashes) não podem estourar o card */}
          <p className="truncate break-all font-mono text-xs text-muted">{target.address}</p>
        </div>

        <span
          className="flex-shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold sm:px-2.5 sm:text-[11px]"
          style={{ color: colors.color, background: colors.bg }}
        >
          {statusLabel(target.status)}
        </span>
      </div>

      <div className="mb-3.5 flex flex-wrap gap-1.5">
        <span className="rounded-md border border-[#1a1f35] bg-[#0F1425] px-2.5 py-0.5 text-[11px] text-[#94A3B8]">
          {typeLabel(target.type, types)}
        </span>
        <span className="rounded-md border border-[#1a1f35] bg-[#0F1425] px-2.5 py-0.5 text-[11px] text-subtle">
          {scopeCount} etapa{scopeCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-borderSoft"
          role="progressbar"
          aria-valuenow={target.progress_pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso de ${target.name}`}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${target.progress_pct}%`,
              background: target.progress_pct === 100 ? "#22C55E" : target.progress_pct > 0 ? "#FBBF24" : "#334155",
            }}
          />
        </div>
        <span className="min-w-[32px] text-right font-mono text-[11px] text-muted">{target.progress_pct}%</span>
      </div>
    </Link>
  );
}
