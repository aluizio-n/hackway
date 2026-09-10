"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { TargetCard } from "@/components/targets/TargetCard";
import { SkeletonCard, LoadingAnnouncer } from "@/components/ui/Skeleton";
import { Icon } from "@/lib/icons";
import { api } from "@/lib/api";
import type { Meta, Target } from "@/lib/types";

type Filter = "all" | "active" | "done" | "pending";

export default function DashboardPage() {
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

  const chips: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: total },
    { key: "active", label: "Ativos", count: active },
    { key: "done", label: "Concluídos", count: done },
    { key: "pending", label: "Pendentes", count: pending },
  ];

  const stats = [
    { label: "TOTAL", value: total, color: "#fff", icon: "target" },
    { label: "ATIVOS", value: active, color: "#FBBF24", icon: "activity" },
    { label: "CONCLUÍDOS", value: done, color: "#22C55E", icon: "check" },
    { label: "PENDENTES", value: pending, color: "#64748B", icon: "clock" },
  ];

  const isFiltering = search.length > 0 || filter !== "all";

  return (
    <AppShell>
      <div className="page-gutter flex-1 overflow-y-auto pt-5 sm:pt-7">
        <div className="mx-auto max-w-[1100px] animate-fadeIn">
          {/* Cabeçalho: empilha em mobile, alinha em linha a partir de sm */}
          <header className="mb-5 sm:mb-7">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="m-0 text-xl font-bold text-white sm:text-2xl">Alvos</h1>
                <p className="mt-1 text-[13px] text-muted">
                  {total} alvo{total !== 1 ? "s" : ""} cadastrado{total !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Em telas largas o botão fica no cabeçalho, com rótulo completo */}
              <Link
                href="/targets/new"
                className="focus-ring hidden h-[38px] flex-shrink-0 items-center gap-1.5 rounded-[10px] bg-gradient-to-br from-accent to-[#6344E0] px-[18px] text-[13px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_#7C5CFF33] sm:flex"
              >
                <Icon name="plus" size={16} /> Novo Alvo
              </Link>
            </div>

            {/* Busca ocupa a largura toda em mobile; o "+" vira botão quadrado de 44px */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-border bg-panel px-3.5 focus-within:border-accent/60 sm:h-[38px] sm:max-w-xs">
                <span className="text-subtle opacity-40">
                  <Icon name="search" size={16} />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar alvos..."
                  aria-label="Buscar alvos por nome ou endereço"
                  className="w-full min-w-0 border-none bg-transparent text-base text-text focus:outline-none sm:text-[13px]"
                />
              </div>

              <Link
                href="/targets/new"
                aria-label="Criar novo alvo"
                className="focus-ring flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-[#6344E0] text-white transition-all active:scale-95 sm:hidden"
              >
                <Icon name="plus" size={20} />
              </Link>
            </div>
          </header>

          {/* 2 colunas em mobile, 4 a partir de lg */}
          <div className="mb-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-panel px-4 py-3.5 sm:px-[18px] sm:py-4">
                <div className="mb-2 flex items-center justify-between gap-2 sm:mb-2.5">
                  <span className="truncate text-[10px] font-semibold tracking-wide text-muted sm:text-[11px]">
                    {s.label}
                  </span>
                  <span className="flex-shrink-0 opacity-40">
                    <Icon name={s.icon} size={18} color="#94A3B8" />
                  </span>
                </div>
                <div className="font-mono text-2xl font-bold tracking-tight sm:text-[28px]" style={{ color: s.color }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Filtros rolam na horizontal em mobile em vez de quebrar linha */}
          <div
            role="group"
            aria-label="Filtrar alvos por status"
            className="no-scrollbar -mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
          >
            {chips.map((c) => {
              const isActive = filter === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setFilter(c.key)}
                  aria-pressed={isActive}
                  className={`focus-ring flex-shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition-all sm:py-1.5 ${
                    isActive ? "border-accent bg-accent/10 text-accent" : "border-borderSoft text-subtle hover:text-text"
                  }`}
                >
                  {c.label} ({c.count})
                </button>
              );
            })}
          </div>

          {loading ? (
            <>
              <LoadingAnnouncer label="Carregando alvos" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-borderSoft px-6 py-12 text-center sm:py-16">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Icon name={isFiltering ? "search" : "target"} size={24} />
              </div>
              <p className="m-0 text-sm font-semibold text-text">
                {isFiltering ? "Nenhum alvo corresponde ao filtro" : "Nenhum alvo cadastrado ainda"}
              </p>
              <p className="mx-auto mt-1 max-w-xs text-[13px] text-muted">
                {isFiltering
                  ? "Ajuste a busca ou selecione outro status."
                  : "Cadastre o primeiro alvo para montar o escopo e acompanhar as fases do pentest."}
              </p>
              {isFiltering ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="focus-ring mt-4 rounded-[10px] border border-accent/20 px-4 py-2 text-[13px] font-semibold text-accent hover:bg-accent/10"
                >
                  Limpar filtros
                </button>
              ) : (
                <Link
                  href="/targets/new"
                  className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded-[10px] bg-gradient-to-br from-accent to-accent-dark px-4 py-2.5 text-[13px] font-semibold text-white"
                >
                  <Icon name="plus" size={16} /> Novo Alvo
                </Link>
              )}
            </div>
          ) : (
            <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((t) => (
                <li key={t.id}>
                  <TargetCard target={t} types={meta?.target_types || []} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
