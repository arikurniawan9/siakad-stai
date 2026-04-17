"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LockKeyhole, UserRound } from "lucide-react";

import { loginAction, type LoginActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialLoginActionState: LoginActionState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending}>
      {pending ? "Memproses..." : "Masuk"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialLoginActionState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Email atau Username</label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            name="identifier"
            className="pl-10"
            placeholder="admin atau admin@kampus.ac.id"
            autoComplete="username"
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            name="password"
            type="password"
            className="pl-10"
            placeholder="Masukkan password"
            autoComplete="current-password"
            minLength={6}
            required
          />
        </div>
      </div>
      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
