"use client";

import { useEffect, useId, useState } from "react";
import { Icon } from "@/lib/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth, isApiError } from "@/lib/auth-context";
import { api } from "@/lib/api";

type Tab = "login" | "register";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regSpecs, setRegSpecs] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);

  const emailId = useId();
  const passId = useId();

  useEffect(() => {
    api
      .get<{ specialties: string[] }>("/tools/meta")
      .then((m) => setSpecialties(m.specialties))
      .catch(() => {});
  }, []);

  const toggleSpec = (sp: string) =>
    setRegSpecs((prev) => (prev.includes(sp) ? prev.filter((x) => x !== sp) : [...prev, sp]));

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
  }

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
    <main className="page-gutter min-h-app relative flex items-center justify-center overflow-hidden bg-bg pt-8 sm:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff06 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-52 left-1/2 h-[400px] w-[400px] -translate-x-1/2 sm:h-[600px] sm:w-[600px]"
        style={{ background: "radial-gradient(circle,#7C5CFF15,transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-[400px] animate-slideUp">
        <header className="mb-8 text-center sm:mb-10">
          <div
            aria-hidden="true"
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-dark font-mono text-2xl font-bold text-white"
          >
            H
          </div>
          <h1 className="m-0 font-mono text-2xl font-bold tracking-tight text-white">HackWay</h1>
          <p className="mt-1 text-[13px] text-muted">Pentest Tool</p>
        </header>

        <div role="tablist" aria-label="Autenticação" className="mb-6 flex rounded-xl border border-border bg-panel p-1">
          {(["login", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => switchTab(t)}
              className={`focus-ring min-h-[44px] flex-1 rounded-[9px] text-center text-[13px] font-semibold transition-all sm:min-h-0 sm:py-2.5 ${
                tab === t ? "bg-accent text-white" : "text-subtle hover:text-text"
              }`}
            >
              {t === "login" ? "Login" : "Cadastro"}
            </button>
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="m-0 mb-4 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-[13px] text-danger"
          >
            {error}
          </p>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor={emailId} className="mb-1.5 block text-xs font-semibold tracking-wide text-subtle">
                EMAIL
              </label>
              <div className="relative">
                <input
                  id={emailId}
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="pentester@hackway.io"
                  className="box-border w-full rounded-[10px] border border-[#1E293B] bg-panel py-3 pl-[42px] pr-3.5 text-base text-white transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:text-sm"
                />
                <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="mail" size={16} color="#475569" />
                </span>
              </div>
            </div>

            <div>
              <label htmlFor={passId} className="mb-1.5 block text-xs font-semibold tracking-wide text-subtle">
                SENHA
              </label>
              <div className="relative">
                <input
                  id={passId}
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="box-border w-full rounded-[10px] border border-[#1E293B] bg-panel py-3 pl-[42px] pr-[52px] text-base text-white transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:text-sm"
                />
                <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="lock" size={16} color="#475569" />
                </span>
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPass}
                  className="focus-ring absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-subtle hover:text-text"
                >
                  <Icon name={showPass ? "x" : "search"} size={15} />
                </button>
              </div>
            </div>

            <Button type="submit" disabled={submitting} fullWidth className="mt-1">
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              label="NOME"
              required
              autoComplete="name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Seu nome"
            />
            <Input
              label="EMAIL"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="pentester@hackway.io"
            />
            <Input
              label="SENHA"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              hint="Use ao menos 8 caracteres."
            />

            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="mb-2 block text-xs font-semibold tracking-wide text-subtle">ESPECIALIDADE</legend>
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((sp) => {
                  const active = regSpecs.includes(sp);
                  return (
                    <button
                      type="button"
                      key={sp}
                      onClick={() => toggleSpec(sp)}
                      role="checkbox"
                      aria-checked={active}
                      className={`focus-ring min-h-[36px] rounded-lg border px-3 text-xs transition-all ${
                        active ? "border-accent bg-accent/10 text-accent" : "border-[#1E293B] text-subtle hover:text-text"
                      }`}
                    >
                      {sp}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Button type="submit" disabled={submitting} fullWidth className="mt-1">
              {submitting ? "Criando..." : "Criar Conta"}
            </Button>
          </form>
        )}

        <div
          aria-hidden="true"
          className="mt-8 overflow-hidden rounded-[10px] border border-border bg-panel px-4 py-3 font-mono text-[11px] text-muted"
        >
          <span className="text-green-500">$</span>{" "}
          <span className="break-all text-subtle">hackway --init --mode pentest</span>
          <div className="mt-1 flex items-center gap-1.5 text-accent">
            → Ready to hack. Stay legal. <Icon name="shield" size={14} color="#7C5CFF" />
          </div>
        </div>
      </div>
    </main>
  );
}
