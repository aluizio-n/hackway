"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Icon } from "@/lib/icons";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { typeVisual } from "@/lib/constants";
import { api, ApiError } from "@/lib/api";
import type { Meta, Target, ToolGroup } from "@/lib/types";

export default function NewTargetPage() {
  const router = useRouter();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [scopePhases, setScopePhases] = useState<boolean[]>([]);
  const [toolCounts, setToolCounts] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<Meta>("/tools/meta").then((m) => {
      setMeta(m);
      setScopePhases(m.phases.map(() => true));
    });
  }, []);

  useEffect(() => {
    if (!type || !meta) return;
    Promise.all(meta.phases.map((_, i) => api.get<ToolGroup[]>(`/tools/${type}/${i}`).catch(() => [])))
      .then((groups) => setToolCounts(groups.map((g) => g.reduce((s, grp) => s + grp.commands.length, 0))));
  }, [type, meta]);

  if (!meta) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center text-[#334155] text-sm">Carregando...</div>
      </AppShell>
    );
  }

  const selectedType = meta.target_types.find((t) => t.key === type);

  async function handleCreate() {
    if (!type) return;
    setError(null);
    setSubmitting(true);
    try {
      const target = await api.post<Target>("/targets", {
        name: name || "Novo Alvo",
        type,
        address,
        description: description || null,
        scope_phases: scopePhases,
      });
      router.push(`/targets/${target.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Falha ao criar alvo");
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-[600px] mx-auto animate-fadeIn">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1.5 text-[13px] text-subtle mb-5 py-1 hover:text-text"
          >
            <Icon name="arrowLeft" size={14} /> Voltar
          </button>
          <h1 className="m-0 mb-1 text-[22px] font-bold text-white">Novo Alvo</h1>
          <p className="m-0 mb-7 text-[13px] text-muted">Configure o alvo e defina o escopo do pentest</p>

          <div className="flex gap-2 mb-8">
            {["01 INFORMAÇÕES", "02 ESCOPO"].map((label, i) => (
              <div key={label} className="flex-1 flex flex-col gap-1.5">
                <div className="h-[3px] rounded-sm transition-all" style={{ background: step >= i ? "#7C5CFF" : "#1E293B" }} />
                <span className="text-[10px] font-mono tracking-wide" style={{ color: step === i ? "#7C5CFF" : "#475569" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {step === 0 ? (
            <div className="flex flex-col gap-5">
              <Input label="NOME DO ALVO" value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: Servidor Produção Corp" />
              <div>
                <label className="text-[11px] font-semibold text-subtle mb-2 block tracking-wide">TIPO DE ALVO</label>
                <div className="grid grid-cols-3 gap-2">
                  {meta.target_types.map((tt) => {
                    const active = type === tt.key;
                    const visual = typeVisual(tt.key);
                    return (
                      <button
                        key={tt.key}
                        onClick={() => setType(tt.key)}
                        className="flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl transition-all border"
                        style={{
                          background: active ? "#7C5CFF12" : "#0A0E1A",
                          borderColor: active ? "#7C5CFF" : "#151B2E",
                        }}
                      >
                        <Icon name={visual.icon} size={24} color={active ? visual.color : "#64748B"} />
                        <span className="text-xs font-medium text-center" style={{ color: active ? "#fff" : "#94A3B8" }}>
                          {tt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <Input
                label="ENDEREÇO / IDENTIFICADOR"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={selectedType?.placeholder || "IP, domínio, nome..."}
              />
              <Textarea
                label="DESCRIÇÃO / REGRAS DE ENGAJAMENTO"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contexto, escopo permitido, horários..."
              />
              <div className="flex justify-end gap-2.5 mt-1">
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                  Cancelar
                </Button>
                <Button disabled={!type || !address} onClick={() => setStep(1)}>
                  Próximo →
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <p className="m-0 mb-2 text-[13px] text-subtle">
                Etapas no escopo — ferramentas serão adaptadas ao tipo{" "}
                <span className="text-accent font-semibold">{selectedType?.label}</span>:
              </p>
              {meta.phases.map((ph, i) => {
                const checked = scopePhases[i];
                const count = toolCounts[i];
                return (
                  <button
                    key={ph.num}
                    onClick={() =>
                      setScopePhases((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                    }
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border"
                    style={{ background: checked ? "#7C5CFF08" : "#0A0E1A", borderColor: checked ? "#7C5CFF33" : "#151B2E" }}
                  >
                    <div
                      className="w-[22px] h-[22px] rounded-[7px] border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: checked ? "#7C5CFF" : "#334155", background: checked ? "#7C5CFF" : "transparent" }}
                    >
                      {checked && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-accent font-semibold">{ph.num}</span>
                        <span className="text-sm font-semibold text-white">{ph.name}</span>
                        {i < 5 && count > 0 && (
                          <span className="text-[10px] text-muted font-mono bg-[#0F1425] px-1.5 py-0.5 rounded">{count} tools</span>
                        )}
                      </div>
                      <div className="text-xs text-muted mt-0.5">{ph.desc}</div>
                    </div>
                  </button>
                );
              })}
              <div className="flex justify-end gap-2.5 mt-3">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  ← Voltar
                </Button>
                <Button disabled={submitting} onClick={handleCreate}>
                  {submitting ? "Criando..." : "Criar Alvo →"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
