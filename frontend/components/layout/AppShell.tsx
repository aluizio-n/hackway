"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/lib/icons";
import { useAuth } from "@/lib/auth-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const onTargets = pathname === "/dashboard" || pathname.startsWith("/targets");

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <aside className="w-[220px] min-w-[220px] bg-sidebar border-r border-border flex flex-col">
        <div className="px-4 pt-[18px] pb-3.5 flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center font-mono font-bold text-[13px] text-white">
            H
          </div>
          <span className="font-mono font-bold text-[15px] text-white tracking-tight">HackWay</span>
        </div>
        <nav className="px-2 flex-1 flex flex-col gap-0.5">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors hover:bg-[#131830] ${
              onTargets ? "text-white bg-[#131830]" : "text-[#94A3B8]"
            }`}
          >
            <span className="opacity-70">
              <Icon name="target" size={16} />
            </span>
            <span>Alvos</span>
          </Link>
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 p-2">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-[13px] font-semibold text-accent">
              {(user?.name || "P").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text truncate">{user?.name || "Pentester"}</div>
              <div className="text-[10px] text-muted font-mono">Pentester</div>
            </div>
            <button onClick={() => logout()} title="Sair" className="text-[#94A3B8] opacity-40 hover:opacity-100 p-1">
              <Icon name="power" size={16} />
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
