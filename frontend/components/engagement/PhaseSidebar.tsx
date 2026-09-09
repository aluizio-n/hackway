"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/lib/icons";
import { typeVisual } from "@/lib/constants";
import type { PhaseMeta, Target } from "@/lib/types";

export function PhaseSidebar({
  target,
  phases,
  activePhaseIdx,
  onSelect,
}: {
  target: Target;
  phases: PhaseMeta[];
  activePhaseIdx: number;
  onSelect: (idx: number) => void;
}) {
  const router = useRouter();
  const visual = typeVisual(target.type);
  const scopedTotal = target.scope_phases.filter(Boolean).length;
  const scopedDone = target.scope_phases.filter((on, i) => on && target.phase_status[i] === 2).length;
  const progressPct = scopedTotal > 0 ? Math.round((scopedDone / scopedTotal) * 100) : 0;

  return (
    <aside className="w-[230px] min-w-[230px] border-r border-border flex flex-col bg-[#080c15]">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: `${visual.color}18`, color: visual.color }}
          >
            <Icon name={visual.icon} size={18} color={visual.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">{target.name}</div>
            <div className="text-[11px] text-muted font-mono truncate">{target.address}</div>
          </div>
        </div>
        <div className="bg-[#0C1020] border border-borderSoft rounded-[10px] p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-semibold text-muted tracking-wide">PROGRESSO</span>
            <span className="text-sm text-accent font-bold font-mono">{progressPct}%</span>
          </div>
          <div className="h-1 bg-borderSoft rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#7C5CFF,#9B82FF)" }}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-0.5">
          {phases.map((p, i) => {
            if (!target.scope_phases[i]) return null;
            const status = target.phase_status[i];
            const active = activePhaseIdx === i;
            return (
              <button
                key={p.num}
                onClick={() => onSelect(i)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors text-left hover:bg-[#111830]"
                style={{ background: active ? "#131830" : "transparent" }}
              >
                <div
                  className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center text-[9px] text-white flex-shrink-0"
                  style={{
                    background: status === 2 ? "#22C55E" : status === 1 ? "#FBBF24" : "transparent",
                    borderColor: status === 2 ? "#22C55E" : status === 1 ? "#FBBF24" : "#334155",
                  }}
                >
                  {status === 2 ? "✓" : ""}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs truncate"
                    style={{ fontWeight: active ? 600 : 400, color: active ? "#fff" : "#94A3B8" }}
                  >
                    {p.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-3 border-t border-border">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-subtle border border-[#1a1f35] hover:border-[#334155] hover:text-[#94A3B8]"
        >
          ← Voltar aos Alvos
        </button>
      </div>
    </aside>
  );
}
