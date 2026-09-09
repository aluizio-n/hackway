"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PhaseSidebar } from "@/components/engagement/PhaseSidebar";
import { ToolsPanel } from "@/components/engagement/ToolsPanel";
import { NotesPanel } from "@/components/engagement/NotesPanel";
import { ReportPanel } from "@/components/engagement/ReportPanel";
import { Icon } from "@/lib/icons";
import { api } from "@/lib/api";
import type { Meta, Target } from "@/lib/types";

type Tab = "tools" | "notes" | "report";

export default function EngagementPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const targetId = params.id;

  const [target, setTarget] = useState<Target | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("tools");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([api.get<Target>(`/targets/${targetId}`), api.get<Meta>("/tools/meta")])
      .then(([t, m]) => {
        setTarget(t);
        setMeta(m);
        const firstScoped = t.scope_phases.findIndex(Boolean);
        const idx = firstScoped === -1 ? 0 : firstScoped;
        setActivePhaseIdx(idx);
        setActiveTab(idx === 5 ? "report" : "tools");
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [targetId]);

  function selectPhase(idx: number) {
    setActivePhaseIdx(idx);
    setActiveTab(idx === 5 ? "report" : "tools");
  }

  async function toggleComplete() {
    if (!target) return;
    const current = target.phase_status[activePhaseIdx];
    const next = current === 2 ? 0 : 2;
    const updated = await api.patch<Target>(`/targets/${target.id}/phase-status`, {
      phase_index: activePhaseIdx,
      status: next,
    });
    setTarget(updated);
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center text-[#334155] text-sm">Carregando...</div>
      </AppShell>
    );
  }

  if (notFound || !target || !meta) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm text-muted">
          Alvo não encontrado.
          <button onClick={() => router.push("/dashboard")} className="text-accent">
            Voltar aos alvos
          </button>
        </div>
      </AppShell>
    );
  }

  const phase = meta.phases[activePhaseIdx];
  const isReportPhase = activePhaseIdx === 5;
  const isComplete = target.phase_status[activePhaseIdx] === 2;

  return (
    <AppShell>
      <div className="flex h-full animate-fadeIn">
        <PhaseSidebar target={target} phases={meta.phases} activePhaseIdx={activePhaseIdx} onSelect={selectPhase} />
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] text-accent font-semibold bg-accent/10 px-2.5 py-0.5 rounded-md">
                  {phase.num}
                </span>
                <h2 className="m-0 text-xl font-bold text-white">{phase.name}</h2>
              </div>
              <p className="m-0.5 mt-0.5 text-[13px] text-muted">{phase.desc}</p>
            </div>
            <button
              onClick={toggleComplete}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-colors"
              style={{
                borderColor: isComplete ? "#22C55E55" : "#1a1f35",
                color: isComplete ? "#22C55E" : "#64748B",
              }}
            >
              <Icon name="check" size={14} /> {isComplete ? "Concluído" : "Concluir"}
            </button>
          </div>

          {!isReportPhase && (
            <div className="flex border-b border-border mb-5">
              {(["tools", "notes"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className="px-[18px] py-2.5 text-[13px] font-medium -mb-px border-b-2 transition-colors"
                  style={{
                    color: activeTab === t ? "#fff" : "#64748B",
                    borderColor: activeTab === t ? "#7C5CFF" : "transparent",
                  }}
                >
                  {t === "tools" ? "Ferramentas" : "Notas"}
                </button>
              ))}
            </div>
          )}

          {isReportPhase || activeTab === "report" ? (
            <ReportPanel targetId={target.id} />
          ) : activeTab === "tools" ? (
            <ToolsPanel targetType={target.type} phaseIndex={activePhaseIdx} address={target.address} />
          ) : (
            <NotesPanel targetId={target.id} phaseIndex={activePhaseIdx} phaseName={phase.name} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
