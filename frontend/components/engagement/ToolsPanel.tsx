"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { replaceVars } from "@/lib/constants";
import type { ToolGroup } from "@/lib/types";

export function ToolsPanel({ targetType, phaseIndex, address }: { targetType: string; phaseIndex: number; address: string }) {
  const [groups, setGroups] = useState<ToolGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<ToolGroup[]>(`/tools/${targetType}/${phaseIndex}`)
      .then(setGroups)
      .finally(() => setLoading(false));
    setExpanded({});
  }, [targetType, phaseIndex]);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // clipboard indisponivel
    }
  }

  if (loading) return <div className="text-center py-10 text-[#334155] text-sm">Carregando...</div>;
  if (groups.length === 0)
    return <div className="text-center py-10 text-[#334155] text-sm">Nenhuma ferramenta disponível para esta fase e tipo de alvo.</div>;

  return (
    <div className="flex flex-col gap-2">
      {groups.map((g, gi) => {
        const isOpen = !!expanded[gi];
        return (
          <div key={g.name} className="bg-panel border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, [gi]: !prev[gi] }))}
              className="w-full flex items-center gap-2.5 px-4 py-3.5 text-left hover:bg-[#0E1225]"
            >
              <span className="text-[10px] text-muted transition-transform" style={{ transform: `rotate(${isOpen ? 90 : 0}deg)` }}>
                ▶
              </span>
              <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center font-mono text-[11px] text-accent font-semibold">
                {g.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-mono text-[13px] font-semibold text-text">{g.name}</span>
              <span className="text-[11px] text-[#334155] ml-1">{g.commands.length} cmds</span>
              {g.tag && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">{g.tag}</span>
              )}
            </button>
            {isOpen && (
              <div className="border-t border-border p-1.5">
                {g.commands.map((cmd, ci) => {
                  const key = `${gi}-${ci}`;
                  const text = replaceVars(address, cmd.command);
                  return (
                    <div key={key} className="p-2.5 rounded-lg hover:bg-[#0E1225]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#94A3B8] font-medium">{cmd.label}</span>
                        <button
                          onClick={() => copy(text, key)}
                          className="text-[11px] text-accent px-2.5 py-1 rounded-md font-mono border border-accent/20 hover:bg-accent/10"
                        >
                          {copiedKey === key ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <div className="bg-bg border border-borderSoft rounded-lg px-3.5 py-2.5 font-mono text-xs text-green-500 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                        {text}
                      </div>
                      {cmd.desc && <div className="text-[11px] text-muted mt-1">{cmd.desc}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
