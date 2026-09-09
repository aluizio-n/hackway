"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/lib/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth, isApiError } from "@/lib/auth-context";
import { api } from "@/lib/api";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regSpecs, setRegSpecs] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    api.get<{ specialties: string[] }>("/tools/meta").then((m) => setSpecialties(m.specialties)).catch(() => {});
  }, []);

  const toggleSpec = (sp: string) =>
    setRegSpecs((prev) => (prev.includes(sp) ? prev.filter((x) => x !== sp) : [...prev, sp]));

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(loginEmail, loginPass);
    } catch (err) {
      setError(isApiError(err) ? err.message : "Falha ao entrar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(regName, regEmail, regPass, regSpecs);
    } catch (err) {
      setError(isApiError(err) ? err.message : "Falha ao criar conta");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff06 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />
      <div
        className="absolute -top-52 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle,#7C5CFF15,transparent 70%)" }}
      />
      <div className="w-[400px] max-w-[90vw] relative z-10 animate-slideUp">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 font-mono font-bold text-2xl text-white bg-gradient-to-br from-accent to-accent-dark">
            H
          </div>
          <div className="font-mono font-bold text-2xl text-white tracking-tight">HackWay</div>
          <div className="text-[13px] text-muted mt-1">Pentest Tool</div>
        </div>

        <div className="flex bg-panel rounded-xl p-1 mb-6 border border-border">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 text-center py-2.5 rounded-[9px] text-[13px] font-semibold transition-all ${
              tab === "login" ? "bg-accent text-white" : "text-subtle"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 text-center py-2.5 rounded-[9px] text-[13px] font-semibold transition-all ${
              tab === "register" ? "bg-accent text-white" : "text-subtle"
            }`}
          >
            Cadastro
          </button>
        </div>

        {error && (
          <div className="mb-4 text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-subtle mb-1.5 block tracking-wide">EMAIL</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="pentester@hackway.io"
                  className="w-full box-border bg-panel border border-[#1E293B] rounded-[10px] pl-[42px] pr-3.5 py-3 text-white text-sm focus:outline-none focus:border-accent"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="mail" size={16} color="#475569" />
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-subtle mb-1.5 block tracking-wide">SENHA</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full box-border bg-panel border border-[#1E293B] rounded-[10px] pl-[42px] pr-3.5 py-3 text-white text-sm focus:outline-none focus:border-accent"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="lock" size={16} color="#475569" />
                </span>
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full mt-1">
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input label="NOME" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Seu nome" />
            <Input
              label="EMAIL"
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="pentester@hackway.io"
            />
            <Input
              label="SENHA"
              type="password"
              required
              minLength={8}
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
            <div>
              <label className="text-xs font-semibold text-subtle mb-2 block tracking-wide">ESPECIALIDADE</label>
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((sp) => {
                  const active = regSpecs.includes(sp);
                  return (
                    <button
                      type="button"
                      key={sp}
                      onClick={() => toggleSpec(sp)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                        active ? "border-accent bg-accent/10 text-accent" : "border-[#1E293B] text-subtle"
                      }`}
                    >
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full mt-1">
              {submitting ? "Criando..." : "Criar Conta"}
            </Button>
          </form>
        )}

        <div className="mt-8 bg-panel border border-border rounded-[10px] px-4 py-3 font-mono text-[11px] text-muted overflow-hidden">
          <span className="text-green-500">$</span> <span className="text-subtle">hackway --init --mode pentest</span>
          <div className="text-accent mt-1 flex items-center gap-1.5">
            → Ready to hack. Stay legal. <Icon name="shield" size={14} color="#7C5CFF" />
          </div>
        </div>
      </div>
    </div>
  );
}
