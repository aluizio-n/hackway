"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Note } from "@/lib/types";

export function NotesPanel({ targetId, phaseIndex, phaseName }: { targetId: string; phaseIndex: number; phaseName: string }) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  function handleChange(value: string) {
    setContent(value);
    setStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await api.put(`/targets/${targetId}/notes`, { phase_index: phaseIndex, content: value });
        setStatus("saved");
      } catch {
        setStatus("idle");
      }
    }, 700);
  }

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        rows={20}
        placeholder={`# Notas — ${phaseName}\n\nRegistre descobertas, outputs de ferramentas...`}
        className="w-full box-border bg-panel border border-border rounded-xl p-[18px] text-text text-[13px] font-mono leading-relaxed resize-y focus:outline-none focus:border-accent"
      />
      <div className="text-[11px] text-[#334155] mt-1.5">
        Markdown suportado • {status === "saving" ? "Salvando..." : "Salvo automaticamente"}
      </div>
    </div>
  );
}
