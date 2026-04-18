"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, LockKeyhole, RefreshCcw, ShieldCheck, UserRound } from "lucide-react";

import { loginAction, type LoginActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

const initialLoginActionState: LoginActionState = {
  error: null,
};

function createSecurityCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] text-base font-semibold shadow-[0_14px_28px_rgba(15,118,110,0.22)] hover:brightness-105"
      disabled={pending}
    >
      <span>{pending ? "Memproses..." : "Masuk ke dashboard"}</span>
      {!pending ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialLoginActionState);
  const [securityCode, setSecurityCode] = useState(() => (typeof window === "undefined" ? "" : createSecurityCode()));
  const [securityInput, setSecurityInput] = useState("");
  const [securityError, setSecurityError] = useState<string | null>(null);
  const { error } = useToast();
  const lastErrorRef = useRef<string | null>(null);

  function refreshSecurityCode(resetError = true) {
    setSecurityCode(createSecurityCode());
    setSecurityInput("");
    if (resetError) {
      setSecurityError(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!securityCode) {
      event.preventDefault();
      return;
    }

    if (securityInput.trim().toUpperCase() !== securityCode) {
      event.preventDefault();
      setSecurityError("Kode keamanan tidak cocok. Coba lagi.");
      refreshSecurityCode(false);
      error("Kode keamanan salah", "Masukkan ulang kode keamanan yang baru.");
    }
  }

  useEffect(() => {
    if (!state.error || lastErrorRef.current === state.error) {
      return;
    }

    lastErrorRef.current = state.error;
    error("Login gagal", state.error);
  }, [error, state.error]);

  return (
    <form action={formAction} onSubmit={handleSubmit} className="mt-1 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800">Email atau Username</label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
          <Input
            name="identifier"
            className="h-14 rounded-2xl border-slate-200 bg-white pl-11 text-sm shadow-[0_8px_20px_rgba(15,23,42,0.04)] placeholder:text-slate-400 focus:border-[var(--primary)]"
            placeholder="admin atau admin@kampus.ac.id"
            autoComplete="username"
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800">Password</label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
          <Input
            name="password"
            type="password"
            className="h-14 rounded-2xl border-slate-200 bg-white pl-11 text-sm shadow-[0_8px_20px_rgba(15,23,42,0.04)] placeholder:text-slate-400 focus:border-[var(--primary)]"
            placeholder="Masukkan password"
            autoComplete="current-password"
            minLength={6}
            required
          />
        </div>
      </div>
      <div className="space-y-3 rounded-[1.5rem] border border-emerald-100 bg-[linear-gradient(180deg,rgba(236,253,245,0.85),rgba(255,255,255,0.92))] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Kode keamanan</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Masukkan kode acak berikut sebelum login diproses.</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            suppressHydrationWarning
            className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-slate-950 px-4 font-mono text-xl font-semibold tracking-[0.35em] text-emerald-300"
          >
            {securityCode}
          </div>
          <Button type="button" variant="secondary" className="h-12 rounded-2xl px-4" onClick={() => refreshSecurityCode()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Acak ulang
          </Button>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">Tulis kode keamanan</label>
          <Input
            value={securityInput}
            onChange={(event) => {
              setSecurityInput(event.target.value.toUpperCase());
              if (securityError) {
                setSecurityError(null);
              }
            }}
            className="h-14 rounded-2xl border-slate-200 bg-white text-center font-mono text-base tracking-[0.3em] uppercase shadow-[0_8px_20px_rgba(15,23,42,0.04)] focus:border-[var(--primary)]"
            placeholder="Masukkan kode"
            inputMode="text"
            maxLength={6}
            required
          />
        </div>
      </div>
      {securityError ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
          {securityError}
        </p>
      ) : null}
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
