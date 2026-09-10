"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PhaseSidebar } from "@/components/engagement/PhaseSidebar";
import { ToolsPanel } from "@/components/engagement/ToolsPanel";
import { NotesPanel } from "@/components/engagement/NotesPanel";
import { ReportPanel } from "@/components/engagement/ReportPanel";
import { Icon } from "@/lib/icons";
import { api } from "@/lib/api";
import type { Meta, Target } from "@/lib/types";

type Tab = "tools" | "notes" | "report";

const REPORT_PHASE = 5;

export default function EngagementPage() {
  const params = useParams<{ id: string }>();
  const targetId = params.id;

  const [target, setTarget] = useState<Target | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("tools");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [togglingPhase, setTogglingPhase] = useState(false);

  useEffect(() => {
    Promise.all([api.get<Target>(`/targets/${targetId}`), api.get<Meta>("/tools/meta")])
      .then(([t, m]) => {
        setTarget(t);
        setMeta(m);
        const firstScoped = t.scope_phases.findIndex(Boolean);
        const idx = firstScoped === -1 ? 0 : firstScoped;
        setActivePhaseIdx(idx);
        setActiveTab(idx === REPORT_PHASE ? "report" : "tools");
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [targetId]);

  function selectPhase(idx: number) {
    setActivePhaseIdx(idx);
    setActiveTab(idx === REPORT_PHASE ? "report" : "tools");
  }

  async function toggleComplete() {
    if (!target || togglingPhase) return;
    setTogglingPhase(true);
    try {
      const current = target.phase_status[activePhaseIdx];
      const updated = await api.patch<Target>(`/targets/${target.id}/phase-status`, {
        phase_index: activePhaseIdx,
        status: current === 2 ? 0 : 2,
      });
      setTarget(updated);
    } finally {
      setTogglingPhase(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div role="status" aria-live="polite" className="flex flex-1 items-center justify-center px-4 text-sm text-[#334155]">
          Carregando...
        </div>
      </AppShell>
    );
  }

  if (notFound || !target || !meta) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-sm text-muted">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <Icon name="target" size={24} />
          </div>
          Alvo não encontrado.
          <Link href="/dashboard" className="focus-ring rounded-lg px-2 py-1 font-semibold text-accent">
            Voltar aos alvos
          </Link>
        </div>
      </AppShell>
    );
  }

  const phase = meta.phases[activePhaseIdx];
  const isReportPhase = activePhaseIdx === REPORT_PHASE;
  const isComplete = target.phase_status[activePhaseIdx] === 2;
  const tabs: { key: Tab; label: string }[] = [
    { key: "tools", label: "Ferramentas" },
    { key: "notes", label: "Notas" },
  ];

  return (
    <AppShell>
      {/* Coluna em mobile (fases no topo), linha a partir de lg (fases na lateral) */}
      <div className="flex min-h-0 flex-1 animate-fadeIn flex-col lg:flex-row">
        <PhaseSidebar target={target} phases={meta.phases} activePhaseIdx={activePhaseIdx} onSelect={selectPhase} />

        <div className="page-gutter min-h-0 flex-1 overflow-y-auto pt-5 sm:pt-6">
          <div className="mx-auto max-w-[900px] lg:max-w-none">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-md bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent">
                    {phase.num}
                  </span>
                  <h1 className="m-0 truncate text-lg font-bold text-white sm:text-xl">{phase.name}</h1>
                </div>
                <p className="m-0 text-[13px] leading-relaxed text-muted">{phase.desc}</p>
              </div>

              <button
                type="button"
                onClick={toggleComplete}
                disabled={togglingPhase}
                aria-pressed={isComplete}
                className="focus-ring flex min-h-[44px] w-full flex-shrink-0 items-center justify-center gap-1.5 rounded-lg border px-4 text-xs font-medium transition-colors disabled:opacity-60 sm:min-h-0 sm:w-auto sm:py-2"
                style={{
                  borderColor: isComplete ? "#22C55E55" : "#1a1f35",
                  color: isComplete ? "#22C55E" : "#64748B",
                  background: isComplete ? "#22C55E0D" : "transparent",
                }}
              >
                <Icon name="check" size={14} />
                {isComplete ? "Concluído" : "Marcar como concluído"}
              </button>
            </div>

            {!isReportPhase && (
              <div role="tablist" aria-label="Conteúdo da fase" className="mb-5 flex border-b border-border">
                {tabs.map((t) => {
                  const selected = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`panel-${t.key}`}
                      id={`tab-${t.key}`}
                      onClick={() => setActiveTab(t.key)}
                      className="focus-ring -mb-px min-h-[44px] flex-1 border-b-2 px-4 text-[13px] font-medium transition-colors sm:flex-none sm:px-[18px] sm:py-2.5"
                      style={{
                        color: selected ? "#fff" : "#64748B",
                        borderColor: selected ? "#7C5CFF" : "transparent",
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div
              id={`panel-${isReportPhase ? "report" : activeTab}`}
              role={isReportPhase ? undefined : "tabpanel"}
              aria-labelledby={isReportPhase ? undefined : `tab-${activeTab}`}
              tabIndex={-1}
            >
              {isReportPhase || activeTab === "report" ? (
                <ReportPanel targetId={target.id} />
              ) : activeTab === "tools" ? (
                <ToolsPanel targetType={target.type} phaseIndex={activePhaseIdx} address={target.address} />
              ) : (
                <NotesPanel targetId={target.id} phaseIndex={activePhaseIdx} phaseName={phase.name} />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
