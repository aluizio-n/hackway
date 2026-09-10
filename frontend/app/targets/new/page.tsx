"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Icon } from "@/lib/icons";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { typeVisual } from "@/lib/constants";
import { api, ApiError } from "@/lib/api";
import type { Meta, Target, ToolGroup } from "@/lib/types";

const STEPS = ["01 INFORMAÇÕES", "02 ESCOPO"];

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
    Promise.all(meta.phases.map((_, i) => api.get<ToolGroup[]>(`/tools/${type}/${i}`).catch(() => []))).then((groups) =>
      setToolCounts(groups.map((g) => g.reduce((s, grp) => s + grp.commands.length, 0)))
    );
  }, [type, meta]);

  if (!meta) {
    return (
      <AppShell>
        <div role="status" aria-live="polite" className="flex flex-1 items-center justify-center px-4 text-sm text-[#334155]">
          Carregando...
        </div>
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 0) setStep(1);
    else handleCreate();
  }

  return (
    <AppShell>
      <div className="page-gutter flex-1 overflow-y-auto pt-5 sm:pt-7">
        <div className="mx-auto max-w-[600px] animate-fadeIn">
          <Link
            href="/dashboard"
            className="focus-ring -ml-1 mb-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-1 text-[13px] text-subtle hover:text-text sm:mb-5"
          >
            <Icon name="arrowLeft" size={14} /> Voltar
          </Link>

          <h1 className="m-0 mb-1 text-xl font-bold text-white sm:text-[22px]">Novo Alvo</h1>
          <p className="m-0 mb-6 text-[13px] text-muted sm:mb-7">Configure o alvo e defina o escopo do pentest</p>

          {/* Indicador de progresso do formulário */}
          <ol aria-label="Etapas do cadastro" className="m-0 mb-7 flex list-none gap-2 p-0 sm:mb-8">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 flex-col gap-1.5" aria-current={step === i ? "step" : undefined}>
                <span
                  aria-hidden="true"
                  className="h-[3px] rounded-sm transition-all"
                  style={{ background: step >= i ? "#7C5CFF" : "#1E293B" }}
                />
                <span
                  className="font-mono text-[10px] tracking-wide"
                  style={{ color: step === i ? "#7C5CFF" : "#475569" }}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>

          {error && (
            <p
              role="alert"
              className="m-0 mb-4 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-[13px] text-danger"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {step === 0 ? (
              <div className="flex flex-col gap-5">
                <Input
                  label="NOME DO ALVO"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Servidor Produção Corp"
                  autoComplete="off"
                />

                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <legend className="mb-2 block text-[11px] font-semibold tracking-wide text-subtle">
                    TIPO DE ALVO
                  </legend>
                  {/* 2 colunas no celular, 3 a partir de 420px — 3 colunas em 320px espremem o rótulo */}
                  <div className="grid grid-cols-2 gap-2 xs:grid-cols-3">
                    {meta.target_types.map((tt) => {
                      const active = type === tt.key;
                      const visual = typeVisual(tt.key);
                      return (
                        <button
                          key={tt.key}
                          type="button"
                          onClick={() => setType(tt.key)}
                          aria-pressed={active}
                          className="focus-ring flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3.5 transition-all"
                          style={{
                            background: active ? "#7C5CFF12" : "#0A0E1A",
                            borderColor: active ? "#7C5CFF" : "#151B2E",
                          }}
                        >
                          <Icon name={visual.icon} size={24} color={active ? visual.color : "#64748B"} />
                          <span
                            className="text-center text-xs font-medium leading-tight"
                            style={{ color: active ? "#fff" : "#94A3B8" }}
                          >
                            {tt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <Input
                  label="ENDEREÇO / IDENTIFICADOR"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={selectedType?.placeholder || "IP, domínio, nome..."}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />

                <Textarea
                  label="DESCRIÇÃO / REGRAS DE ENGAJAMENTO"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contexto, escopo permitido, horários..."
                />

                {/* Ações: empilhadas e em largura total no celular, alinhadas à direita em sm+ */}
                <div className="mt-1 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                  <Button variant="ghost" onClick={() => router.push("/dashboard")} className="sm:w-auto">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!type || !address}>
                    Próximo →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <p className="m-0 mb-2 text-[13px] leading-relaxed text-subtle">
                  Etapas no escopo — ferramentas serão adaptadas ao tipo{" "}
                  <span className="font-semibold text-accent">{selectedType?.label}</span>:
                </p>

                {meta.phases.map((ph, i) => {
                  const checked = scopePhases[i];
                  const count = toolCounts[i];
                  return (
                    <button
                      key={ph.num}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => setScopePhases((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                      className="focus-ring flex items-start gap-3 rounded-xl border px-3.5 py-3.5 text-left transition-all sm:items-center sm:px-4"
                      style={{
                        background: checked ? "#7C5CFF08" : "#0A0E1A",
                        borderColor: checked ? "#7C5CFF33" : "#151B2E",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[7px] border-2 sm:mt-0"
                        style={{
                          borderColor: checked ? "#7C5CFF" : "#334155",
                          background: checked ? "#7C5CFF" : "transparent",
                        }}
                      >
                        {checked && <span className="text-xs font-bold text-white">✓</span>}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-mono text-[11px] font-semibold text-accent">{ph.num}</span>
                          <span className="text-sm font-semibold text-white">{ph.name}</span>
                          {i < 5 && count > 0 && (
                            <span className="rounded bg-[#0F1425] px-1.5 py-0.5 font-mono text-[10px] text-muted">
                              {count} tools
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">{ph.desc}</span>
                      </span>
                    </button>
                  );
                })}

                <div className="mt-3 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                  <Button variant="ghost" onClick={() => setStep(0)}>
                    ← Voltar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Criando..." : "Criar Alvo →"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </AppShell>
  );
}
