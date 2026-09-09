"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons";
import { api } from "@/lib/api";
import type { ReportResult } from "@/lib/types";

export function ReportPanel({ targetId }: { targetId: string }) {
  const [report, setReport] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function generate(reportType: "tech" | "exec") {
    setLoading(reportType);
    try {
      const result = await api.post<ReportResult>("/reports/generate", { target_id: targetId, report_type: reportType });
      setReport(result);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <button
          onClick={() => generate("tech")}
          className="flex-1 p-5 bg-panel border border-border rounded-2xl text-center transition-all hover:border-accent/20 hover:-translate-y-0.5"
        >
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2.5 text-accent">
            <Icon name="clipboard" size={22} />
          </div>
          <div className="text-sm font-semibold text-white">{loading === "tech" ? "Gerando..." : "Relatório Técnico"}</div>
          <div className="text-xs text-muted mt-1">Detalhes, evidências e comandos</div>
        </button>
        <button
          onClick={() => generate("exec")}
          className="flex-1 p-5 bg-panel border border-border rounded-2xl text-center transition-all hover:border-accent/20 hover:-translate-y-0.5"
        >
          <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-2.5 text-green-500">
            <Icon name="barchart" size={22} />
          </div>
          <div className="text-sm font-semibold text-white">{loading === "exec" ? "Gerando..." : "Relatório Executivo"}</div>
          <div className="text-xs text-muted mt-1">Riscos e recomendações para gestores</div>
        </button>
      </div>

      {report && (
        <div className="bg-panel border border-border rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="m-0 text-[15px] font-semibold text-white">{report.title}</h3>
            <button
              onClick={() => navigator.clipboard.writeText(report.content).catch(() => {})}
              className="text-xs text-accent px-3.5 py-1.5 border border-accent/20 rounded-lg hover:bg-accent/10"
            >
              Copiar
            </button>
          </div>
          <div className="bg-bg border border-borderSoft rounded-[10px] p-5 font-mono text-xs text-[#CBD5E1] leading-loose whitespace-pre-wrap max-h-[500px] overflow-y-auto">
            {report.content}
          </div>
        </div>
      )}
    </div>
  );
}
