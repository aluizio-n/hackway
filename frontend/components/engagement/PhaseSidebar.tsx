"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon } from "@/lib/icons";
import { typeVisual } from "@/lib/constants";
import type { PhaseMeta, Target } from "@/lib/types";

function statusRing(status: number) {
  return {
    background: status === 2 ? "#22C55E" : status === 1 ? "#FBBF24" : "transparent",
    borderColor: status === 2 ? "#22C55E" : status === 1 ? "#FBBF24" : "#334155",
  };
}

function statusText(status: number) {
  return status === 2 ? "concluída" : status === 1 ? "em andamento" : "não iniciada";
}

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
  const visual = typeVisual(target.type);
  const scopedTotal = target.scope_phases.filter(Boolean).length;
  const scopedDone = target.scope_phases.filter((on, i) => on && target.phase_status[i] === 2).length;
  const progressPct = scopedTotal > 0 ? Math.round((scopedDone / scopedTotal) * 100) : 0;
  const scoped = phases.map((p, i) => ({ phase: p, index: i })).filter(({ index }) => target.scope_phases[index]);

  const railRef = useRef<HTMLDivElement>(null);

  // Mantém a fase ativa visível na trilha horizontal (mobile)
  useEffect(() => {
    const el = railRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activePhaseIdx]);

  const progressBar = (
    <div
      className="h-1 overflow-hidden rounded-full bg-borderSoft"
      role="progressbar"
      aria-valuenow={progressPct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso das fases no escopo"
    >
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#7C5CFF,#9B82FF)" }}
      />
    </div>
  );

  return (
    <>
      {/* ---------- Mobile / tablet: cabeçalho compacto + trilha horizontal ---------- */}
      <div className="flex-shrink-0 border-b border-border bg-[#080c15] lg:hidden">
        <div className="flex items-center gap-2.5 px-4 pb-3 pt-3.5">
          <Link
            href="/dashboard"
            aria-label="Voltar aos alvos"
            className="focus-ring -ml-1.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-subtle hover:bg-[#131830] hover:text-text"
          >
            <Icon name="arrowLeft" size={18} />
          </Link>
          <div
            aria-hidden="true"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px]"
            style={{ background: `${visual.color}18`, color: visual.color }}
          >
            <Icon name={visual.icon} size={18} color={visual.color} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-white">{target.name}</div>
            <div className="truncate break-all font-mono text-[11px] text-muted">{target.address}</div>
          </div>
          <span className="flex-shrink-0 font-mono text-sm font-bold text-accent">{progressPct}%</span>
        </div>

        <div className="px-4 pb-2.5">{progressBar}</div>

        <div
          ref={railRef}
          role="tablist"
          aria-label="Fases do pentest"
          aria-orientation="horizontal"
          className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-3"
        >
          {scoped.map(({ phase, index }) => {
            const status = target.phase_status[index];
            const active = activePhaseIdx === index;
            return (
              <button
                key={phase.num}
                type="button"
                role="tab"
                aria-selected={active}
                data-active={active}
                onClick={() => onSelect(index)}
                className={`focus-ring flex flex-shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs transition-colors ${
                  active
                    ? "border-accent bg-accent/10 font-semibold text-white"
                    : "border-borderSoft text-[#94A3B8] hover:text-text"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 text-[8px] text-white"
                  style={statusRing(status)}
                >
                  {status === 2 ? "✓" : ""}
                </span>
                <span className="whitespace-nowrap">{phase.name}</span>
                <span className="sr-only">— {statusText(status)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Desktop: coluna lateral fixa ---------- */}
      <aside
        aria-label="Fases do pentest"
        className="hidden w-[230px] min-w-[230px] flex-col border-r border-border bg-[#080c15] lg:flex"
      >
        <div className="border-b border-border p-4">
          <div className="mb-3 flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: `${visual.color}18`, color: visual.color }}
            >
              <Icon name={visual.icon} size={18} color={visual.color} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-white" title={target.name}>
                {target.name}
              </div>
              <div className="truncate font-mono text-[11px] text-muted" title={target.address}>
                {target.address}
              </div>
            </div>
          </div>
          <div className="rounded-[10px] border border-borderSoft bg-[#0C1020] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wide text-muted">PROGRESSO</span>
              <span className="font-mono text-sm font-bold text-accent">{progressPct}%</span>
            </div>
            {progressBar}
          </div>
        </div>

        <div role="tablist" aria-orientation="vertical" className="flex-1 overflow-y-auto p-2">
          <div className="flex flex-col gap-0.5">
            {scoped.map(({ phase, index }) => {
              const status = target.phase_status[index];
              const active = activePhaseIdx === index;
              return (
                <button
                  key={phase.num}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelect(index)}
                  className={`focus-ring flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#111830] ${
                    active ? "bg-[#131830]" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border-2 text-[9px] text-white"
                    style={statusRing(status)}
                  >
                    {status === 2 ? "✓" : ""}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block truncate text-xs"
                      style={{ fontWeight: active ? 600 : 400, color: active ? "#fff" : "#94A3B8" }}
                    >
                      {phase.name}
                    </span>
                  </span>
                  <span className="sr-only">— {statusText(status)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border p-3">
          <Link
            href="/dashboard"
            className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#1a1f35] py-2 text-xs text-subtle hover:border-[#334155] hover:text-[#94A3B8]"
          >
            <Icon name="arrowLeft" size={14} /> Voltar aos Alvos
          </Link>
        </div>
      </aside>
    </>
  );
}
