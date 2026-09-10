"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons";
import { api } from "@/lib/api";
import type { ReportResult } from "@/lib/types";

type ReportType = "tech" | "exec";

const OPTIONS: { key: ReportType; title: string; desc: string; icon: string; color: string }[] = [
  {
    key: "tech",
    title: "Relatório Técnico",
    desc: "Detalhes, evidências e comandos",
    icon: "clipboard",
    color: "#7C5CFF",
  },
  {
    key: "exec",
    title: "Relatório Executivo",
    desc: "Riscos e recomendações para gestores",
    icon: "barchart",
    color: "#22C55E",
  },
];

export function ReportPanel({ targetId }: { targetId: string }) {
  const [report, setReport] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState<ReportType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate(reportType: ReportType) {
    setLoading(reportType);
    setError(null);
    try {
      const result = await api.post<ReportResult>("/reports/generate", {
        target_id: targetId,
        report_type: reportType,
      });
      setReport(result);
    } catch {
      setError("Não foi possível gerar o relatório. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  async function copyReport() {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponivel
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Empilha em mobile — dois cards lado a lado ficam ilegíveis abaixo de 640px */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const isLoading = loading === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => generate(opt.key)}
              disabled={loading !== null}
              className="focus-ring rounded-2xl border border-border bg-panel p-4 text-center transition-all hover:border-accent/20 disabled:opacity-60 sm:p-5 sm:hover:-translate-y-0.5"
            >
              <span
                aria-hidden="true"
                className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: `${opt.color}1A`, color: opt.color }}
              >
                <Icon name={opt.icon} size={22} color={opt.color} />
              </span>
              <span className="block text-sm font-semibold text-white">{isLoading ? "Gerando..." : opt.title}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{opt.desc}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="m-0 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-[13px] text-danger">
          {error}
        </p>
      )}

      <span role="status" aria-live="polite" className="sr-only">
        {loading ? "Gerando relatório" : report ? "Relatório gerado" : ""}
      </span>

      {report && (
        <section className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="m-0 min-w-0 text-sm font-semibold text-white sm:text-[15px]">{report.title}</h2>
            <button
              type="button"
              onClick={copyReport}
              className="focus-ring flex min-h-[36px] flex-shrink-0 items-center gap-1.5 rounded-lg border border-accent/20 px-3.5 text-xs text-accent hover:bg-accent/10"
            >
              <Icon name={copied ? "check" : "copy"} size={12} />
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          {/* Altura relativa à viewport para caber tanto em celular quanto em monitor */}
          <pre className="m-0 max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded-[10px] border border-borderSoft bg-bg p-4 font-mono text-xs leading-loose text-[#CBD5E1] sm:p-5">
            {report.content}
          </pre>
        </section>
      )}
    </div>
  );
}
