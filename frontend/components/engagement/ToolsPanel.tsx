"use client";

import { useEffect, useId, useState } from "react";
import { Icon } from "@/lib/icons";
import { api } from "@/lib/api";
import { replaceVars } from "@/lib/constants";
import { Skeleton, LoadingAnnouncer } from "@/components/ui/Skeleton";
import type { ToolGroup } from "@/lib/types";

export function ToolsPanel({
  targetType,
  phaseIndex,
  address,
}: {
  targetType: string;
  phaseIndex: number;
  address: string;
}) {
  const [groups, setGroups] = useState<ToolGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const baseId = useId();

  useEffect(() => {
    setLoading(true);
    api
      .get<ToolGroup[]>(`/tools/${targetType}/${phaseIndex}`)
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
    setExpanded({});
  }, [targetType, phaseIndex]);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // clipboard indisponivel (contexto inseguro ou permissao negada)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <LoadingAnnouncer label="Carregando ferramentas" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[54px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-borderSoft px-6 py-10 text-center">
        <p className="m-0 text-sm text-subtle">Nenhuma ferramenta disponível</p>
        <p className="mx-auto mt-1 max-w-xs text-[13px] text-muted">
          Não há comandos catalogados para esta fase e este tipo de alvo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {groups.map((g, gi) => {
        const isOpen = !!expanded[gi];
        const panelId = `${baseId}-tool-${gi}`;

        return (
          <div key={g.name} className="overflow-hidden rounded-xl border border-border bg-panel">
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [gi]: !prev[gi] }))}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="focus-ring flex w-full items-center gap-2.5 px-3.5 py-3.5 text-left hover:bg-[#0E1225] sm:px-4"
              >
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 text-muted transition-transform duration-200"
                  style={{ transform: `rotate(${isOpen ? 90 : 0}deg)` }}
                >
                  <Icon name="chevron" size={14} />
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-accent/10 font-mono text-[11px] font-semibold text-accent"
                >
                  {g.name.charAt(0).toUpperCase()}
                </span>

                <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="truncate font-mono text-[13px] font-semibold text-text">{g.name}</span>
                  <span className="whitespace-nowrap text-[11px] text-[#334155]">
                    {g.commands.length} cmd{g.commands.length !== 1 ? "s" : ""}
                  </span>
                </span>

                {g.tag && (
                  <span className="hidden flex-shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent xs:inline">
                    {g.tag}
                  </span>
                )}
              </button>
            </h3>

            {isOpen && (
              <div id={panelId} className="border-t border-border p-1.5">
                {g.commands.map((cmd, ci) => {
                  const key = `${gi}-${ci}`;
                  const text = replaceVars(address, cmd.command);
                  const copied = copiedKey === key;

                  return (
                    <div key={key} className="rounded-lg p-2.5 hover:bg-[#0E1225]">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="min-w-0 flex-1 text-xs font-medium text-[#94A3B8]">{cmd.label}</span>
                        <button
                          type="button"
                          onClick={() => copy(text, key)}
                          aria-label={`Copiar comando: ${cmd.label}`}
                          className="focus-ring flex min-h-[36px] flex-shrink-0 items-center gap-1.5 rounded-md border border-accent/20 px-2.5 font-mono text-[11px] text-accent transition-colors hover:bg-accent/10 active:scale-95"
                        >
                          <Icon name={copied ? "check" : "copy"} size={12} />
                          {copied ? "Copiado" : "Copiar"}
                        </button>
                      </div>

                      {/* break-all garante que comandos longos nunca estourem a largura da tela */}
                      <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-borderSoft bg-bg px-3 py-2.5 font-mono text-xs leading-relaxed text-green-500 sm:px-3.5">
                        <code>{text}</code>
                      </pre>

                      {cmd.desc && <p className="m-0 mt-1 text-[11px] leading-relaxed text-muted">{cmd.desc}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Confirmação de cópia anunciada para leitores de tela */}
      <span role="status" aria-live="polite" className="sr-only">
        {copiedKey ? "Comando copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}
