"use client";

import { useEffect, useId, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Note } from "@/lib/types";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const STATUS_TEXT: Record<SaveStatus, string> = {
  idle: "Salvo automaticamente",
  saving: "Salvando...",
  saved: "Salvo",
  error: "Falha ao salvar — tente novamente",
};

export function NotesPanel({
  targetId,
  phaseIndex,
  phaseName,
}: {
  targetId: string;
  phaseIndex: number;
  phaseName: string;
}) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fieldId = useId();

  useEffect(() => {
    let cancelled = false;
    api
      .get<Record<number, Note>>(`/targets/${targetId}/notes`)
      .then((notes) => {
        if (!cancelled) setContent(notes[phaseIndex]?.content ?? "");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [targetId, phaseIndex]);

  // Não deixa um debounce pendente disparar depois de desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(value: string) {
    setContent(value);
    setStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await api.put(`/targets/${targetId}/notes`, { phase_index: phaseIndex, content: value });
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 700);
  }

  return (
    <div>
      <label htmlFor={fieldId} className="sr-only">
        Notas da fase {phaseName}
      </label>
      <textarea
        id={fieldId}
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        aria-describedby={`${fieldId}-status`}
        spellCheck={false}
        placeholder={`# Notas — ${phaseName}\n\nRegistre descobertas, outputs de ferramentas...`}
        // Altura fluida: acompanha a viewport em vez de um número fixo de linhas
        className="box-border block h-[50vh] min-h-[240px] w-full resize-y rounded-xl border border-border bg-panel p-4 font-mono text-[13px] leading-relaxed text-text transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:h-[55vh] sm:p-[18px] lg:min-h-[320px]"
      />
      <p
        id={`${fieldId}-status`}
        role="status"
        aria-live="polite"
        className={`mt-1.5 text-[11px] ${status === "error" ? "text-danger" : "text-[#334155]"}`}
      >
        Markdown suportado • {STATUS_TEXT[status]}
      </p>
    </div>
  );
}
