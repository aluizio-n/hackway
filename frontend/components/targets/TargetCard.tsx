"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/lib/icons";
import { typeVisual, typeLabel, statusLabel, statusColors } from "@/lib/constants";
import type { Target, TargetTypeMeta } from "@/lib/types";

export function TargetCard({ target, types }: { target: Target; types: TargetTypeMeta[] }) {
  const router = useRouter();
  const visual = typeVisual(target.type);
  const colors = statusColors(target.status);
  const scopeCount = target.scope_phases.filter(Boolean).length;

  return (
    <div
      onClick={() => router.push(`/targets/${target.id}`)}
      className="relative overflow-hidden bg-panel border border-border rounded-[14px] p-5 cursor-pointer transition-all hover:border-accent/20 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_#00000044]"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: colors.line }} />
      <div className="flex items-start gap-3 mb-3.5">
        <div
          className="w-[42px] h-[42px] rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${visual.color}18`, color: visual.color }}
        >
          <Icon name={visual.icon} size={20} color={visual.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white mb-0.5 truncate">{target.name}</div>
          <div className="text-xs text-muted font-mono truncate">{target.address}</div>
        </div>
        <div
          className="px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap"
          style={{ color: colors.color, background: colors.bg }}
        >
          {statusLabel(target.status)}
        </div>
      </div>
      <div className="flex gap-1.5 mb-3.5 flex-wrap">
        <span className="px-2.5 py-0.5 rounded-md text-[11px] text-[#94A3B8] bg-[#0F1425] border border-[#1a1f35]">
          {typeLabel(target.type, types)}
        </span>
        <span className="px-2.5 py-0.5 rounded-md text-[11px] text-subtle bg-[#0F1425] border border-[#1a1f35]">
          {scopeCount} etapas
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex-1 h-1 bg-borderSoft rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${target.progress_pct}%`, background: target.progress_pct === 100 ? "#22C55E" : target.progress_pct > 0 ? "#FBBF24" : "#334155" }}
          />
        </div>
        <span className="text-[11px] font-mono text-muted min-w-[32px] text-right">{target.progress_pct}%</span>
      </div>
    </div>
  );
}
