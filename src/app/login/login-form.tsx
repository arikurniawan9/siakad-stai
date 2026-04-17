"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";

import { loginAction, type LoginActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialLoginActionState: LoginActionState = {
  error: null,
};

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

  return (
    <form action={formAction} className="mt-1 space-y-5">
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
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
