"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TargetCard } from "@/components/targets/TargetCard";
import { Icon } from "@/lib/icons";
import { api } from "@/lib/api";
import type { Meta, Target } from "@/lib/types";

type Filter = "all" | "active" | "done" | "pending";

export default function DashboardPage() {
  const router = useRouter();
  const [targets, setTargets] = useState<Target[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    Promise.all([api.get<Target[]>("/targets"), api.get<Meta>("/tools/meta")])
      .then(([t, m]) => {
        setTargets(t);
        setMeta(m);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = targets.length;
  const active = targets.filter((t) => t.status === "in_progress").length;
  const done = targets.filter((t) => t.status === "completed").length;
  const pending = targets.filter((t) => t.status === "not_started").length;

  const filtered = useMemo(() => {
    let list = targets;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.address.toLowerCase().includes(q));
    }
    if (filter === "active") list = list.filter((t) => t.status === "in_progress");
    else if (filter === "done") list = list.filter((t) => t.status === "completed");
    else if (filter === "pending") list = list.filter((t) => t.status === "not_started");
    return list;
  }, [targets, search, filter]);

  const chips: { key: Filter; label: string }[] = [
    { key: "all", label: `Todos (${total})` },
    { key: "active", label: `Ativos (${active})` },
    { key: "done", label: `Concluídos (${done})` },
    { key: "pending", label: `Pendentes (${pending})` },
  ];

  const stats = [
    { label: "TOTAL", value: total, color: "#fff", icon: "target" },
    { label: "ATIVOS", value: active, color: "#FBBF24", icon: "activity" },
    { label: "CONCLUÍDOS", value: done, color: "#22C55E", icon: "check" },
    { label: "PENDENTES", value: pending, color: "#64748B", icon: "clock" },
  ];

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-[1100px] mx-auto animate-fadeIn">
          <div className="flex justify-between items-start mb-7">
            <div>
              <h1 className="m-0 text-2xl font-bold text-white">Alvos</h1>
              <p className="mt-1 text-[13px] text-muted">
                {total} alvo{total !== 1 ? "s" : ""} cadastrado{total !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2.5">
              <div className="flex items-center gap-2 bg-panel border border-border rounded-[10px] px-3.5 h-[38px]">
                <span className="opacity-30 text-subtle">
                  <Icon name="search" size={16} />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar alvos..."
                  className="bg-transparent border-none text-text text-[13px] w-[180px] focus:outline-none"
                />
              </div>
              <button
                onClick={() => router.push("/targets/new")}
                className="flex items-center gap-1.5 text-white px-[18px] h-[38px] rounded-[10px] text-[13px] font-semibold bg-gradient-to-br from-accent to-[#6344E0] hover:-translate-y-px hover:shadow-[0_6px_20px_#7C5CFF33] transition-all"
              >
                <span className="text-lg font-light leading-none">+</span> Novo Alvo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-panel border border-border rounded-xl px-[18px] py-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-muted tracking-wide">{s.label}</span>
                  <span className="opacity-40">
                    <Icon name={s.icon} size={20} color="#94A3B8" />
                  </span>
                </div>
                <div className="text-[28px] font-bold font-mono tracking-tight" style={{ color: s.color }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 mb-[18px] flex-wrap">
            {chips.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  filter === c.key ? "border-accent bg-accent/10 text-accent" : "border-borderSoft text-subtle"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#334155] text-sm">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[#334155] text-sm">Nenhum alvo encontrado.</div>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
              {filtered.map((t) => (
                <TargetCard key={t.id} target={t} types={meta?.target_types || []} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
