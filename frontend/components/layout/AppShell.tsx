"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/lib/icons";
import { useAuth } from "@/lib/auth-context";

const NAV = [{ href: "/dashboard", label: "Alvos", icon: "target" }];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const onTargets = pathname === "/dashboard" || pathname.startsWith("/targets");
  const close = useCallback(() => setMenuOpen(false), []);

  // Navegar fecha o drawer — senão ele fica aberto sobre a página nova
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Ao alcançar lg a sidebar deixa de ser modal — o estado "aberto" precisa cair junto,
  // senão o scroll do body fica travado e o role="dialog" persiste no desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => mq.matches && setMenuOpen(false);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Esc fecha e trava o scroll do fundo enquanto o drawer está aberto
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        toggleBtnRef.current?.focus();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, close]);

  const initial = (user?.name || "P").charAt(0).toUpperCase();

  return (
    <div className="flex h-app overflow-hidden bg-bg">
      {/* Backdrop — só existe abaixo de lg, onde a sidebar é modal */}
      {menuOpen && (
        <div
          onClick={close}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-backdropIn lg:hidden"
        />
      )}

      {/*
        Uma única sidebar serve aos dois modos:
        - < lg: drawer fixo. `invisible` quando fechado tira do tab order e do leitor de tela.
        - >= lg: coluna estática do layout.
      */}
      <aside
        id="app-sidebar"
        role={menuOpen ? "dialog" : undefined}
        aria-modal={menuOpen ? true : undefined}
        aria-label="Menu principal"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(84vw,280px)] flex-col border-r border-border bg-sidebar pt-safe transition-transform duration-300 ease-spring
          lg:static lg:z-auto lg:w-[220px] lg:min-w-[220px] lg:visible lg:translate-x-0 lg:transition-none
          ${menuOpen ? "visible translate-x-0 shadow-2xl shadow-black/50" : "invisible -translate-x-full"}`}
      >
        <div className="flex items-center gap-2.5 px-4 pb-3.5 pt-[18px]">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent-dark font-mono text-[13px] font-bold text-white">
            H
          </div>
          <span className="font-mono text-[15px] font-bold tracking-tight text-white">HackWay</span>
          <button
            ref={closeBtnRef}
            onClick={close}
            aria-label="Fechar menu"
            className="focus-ring ml-auto -mr-1 flex h-10 w-10 items-center justify-center rounded-lg text-subtle hover:bg-[#131830] hover:text-text lg:hidden"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2">
          {NAV.map((item) => {
            const active = item.href === "/dashboard" ? onTargets : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`focus-ring flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[#131830] lg:min-h-0 lg:text-[13px] ${
                  active ? "bg-[#131830] text-white" : "text-[#94A3B8]"
                }`}
              >
                <span className="opacity-70">
                  <Icon name={item.icon} size={16} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2.5 p-2">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent/20 to-accent/5 text-[13px] font-semibold text-accent"
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-text">{user?.name || "Pentester"}</div>
              <div className="font-mono text-[10px] text-muted">Pentester</div>
            </div>
            <button
              onClick={() => logout()}
              aria-label="Sair da conta"
              title="Sair"
              className="focus-ring flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[#94A3B8] opacity-60 hover:bg-[#131830] hover:opacity-100 lg:h-8 lg:w-8"
            >
              <Icon name="power" size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Barra superior — substitui a sidebar abaixo de lg */}
        <header className="bar-gutter pt-safe sticky top-0 z-30 flex h-14 flex-shrink-0 items-center gap-2 border-b border-border bg-bg/90 backdrop-blur-md lg:hidden">
          <button
            ref={toggleBtnRef}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-lg text-text hover:bg-[#131830]"
          >
            <Icon name="menu" size={20} />
          </button>
          <Link href="/dashboard" className="focus-ring flex items-center gap-2 rounded-lg px-1 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dark font-mono text-xs font-bold text-white">
              H
            </div>
            <span className="font-mono text-sm font-bold tracking-tight text-white">HackWay</span>
          </Link>
          <div
            aria-hidden="true"
            className="ml-auto mr-1 flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent/20 to-accent/5 text-xs font-semibold text-accent"
          >
            {initial}
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
