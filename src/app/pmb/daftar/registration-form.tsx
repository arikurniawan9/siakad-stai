"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, CheckCircle2, FileText, Phone, School, UserRound } from "lucide-react";

import { registerPmbAction, type PmbRegistrationState } from "@/actions/pmb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialState: PmbRegistrationState = {
  error: null,
  success: null,
};

const programOptions = [
  "S1 Pendidikan Agama Islam",
  "S1 Ekonomi Syariah",
  "S1 Manajemen Pendidikan Islam",
  "S1 Hukum Keluarga Islam",
];

const educationLevels = ["SMA/MA", "SMK", "Paket C", "Transfer"];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="h-11 w-full rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] text-[0.95rem] font-semibold shadow-[0_14px_24px_rgba(15,118,110,0.22)] hover:brightness-105"
      disabled={pending}
    >
      <span>{pending ? "Mengirim pendaftaran..." : "Kirim pendaftaran"}</span>
      {!pending ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
    </Button>
  );
}

export function PmbRegistrationForm() {
  const [state, formAction] = useActionState(registerPmbAction, initialState);

  return (
    <div className="space-y-5">
      {state.success ? (
        <Card className="border-emerald-200 bg-[linear-gradient(180deg,#f2fbf7_0%,#ffffff_100%)] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="space-y-3">
              <p className="text-[0.88rem] uppercase tracking-[0.2em] text-emerald-700">Pendaftaran diterima</p>
              <h2 className="text-xl font-semibold text-slate-950">{state.success.fullName}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3.5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Nomor pendaftaran</p>
                  <p className="mt-2 font-mono text-[0.92rem] font-semibold text-slate-950">
                    {state.success.registrationNumber}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3.5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Program pilihan</p>
                  <p className="mt-2 text-[0.92rem] font-semibold text-slate-950">{state.success.program}</p>
                </div>
              </div>
              <p className="text-[0.92rem] leading-6 text-slate-600">
                Konfirmasi pendaftaran akan dikirim ke <span className="font-medium text-slate-900">{state.success.email}</span>.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      <form action={formAction} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[0.92rem] font-medium text-slate-800">Nama lengkap</label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input name="fullName" className="h-12 rounded-xl pl-11" placeholder="Nama sesuai ijazah" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.92rem] font-medium text-slate-800">Email aktif</label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input name="email" type="email" className="h-12 rounded-xl pl-11" placeholder="nama@email.com" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.92rem] font-medium text-slate-800">Nomor WhatsApp</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input name="phone" className="h-12 rounded-xl pl-11" placeholder="08xxxxxxxxxx" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.92rem] font-medium text-slate-800">Asal sekolah</label>
            <div className="relative">
              <School className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input name="schoolName" className="h-12 rounded-xl pl-11" placeholder="SMA / MA / SMK" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.92rem] font-medium text-slate-800">Program studi</label>
            <select
              name="program"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[0.92rem] text-slate-900 outline-none transition focus:border-[var(--primary)]"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Pilih program studi
              </option>
              {programOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[0.92rem] font-medium text-slate-800">Jenjang pendidikan</label>
            <select
              name="educationLevel"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[0.92rem] text-slate-900 outline-none transition focus:border-[var(--primary)]"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Pilih jenjang
              </option>
              {educationLevels.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-[0.92rem] font-medium text-slate-800">Kota asal</label>
            <Input name="city" className="h-12 rounded-xl" placeholder="Kota / Kabupaten" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-[0.92rem] font-medium text-slate-800">Catatan tambahan</label>
            <textarea
              name="notes"
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[0.92rem] text-slate-900 outline-none transition focus:border-[var(--primary)]"
              placeholder="Opsional"
            />
          </div>
        </div>

        {state.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.92rem] leading-6 text-red-700">
            {state.error}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </div>
  );
}
