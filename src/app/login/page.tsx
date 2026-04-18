import Image from "next/image";
import { Activity, Fingerprint, ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/card";
import { LoginForm } from "@/app/login/login-form";

const roleHighlights = [
  "Admin dan Prodi",
  "Dosen dan Mahasiswa",
  "Staff dan Keuangan",
  "Pimpinan kampus",
];

const capabilityItems = [
  {
    icon: ShieldCheck,
    title: "Akses berbasis role",
    description: "Dashboard dan menu menyesuaikan role pengguna.",
  },
  {
    icon: Fingerprint,
    title: "Autentikasi siap pakai",
    description: "Siap dipakai untuk demo dan integrasi.",
  },
  {
    icon: Activity,
    title: "Operasional terpadu",
    description: "Akademik, keuangan, dan pelaporan dalam satu sistem.",
  },
];

const statItems = [
  { label: "Role aktif", value: "7" },
  { label: "Autentikasi", value: "Ready" },
  { label: "Arahkan user", value: "Auto" },
];

const demoAccounts = [
  { role: "Admin", credential: "admin / admin123" },
  { role: "Prodi", credential: "prodi / prodi123" },
  { role: "Dosen", credential: "dosen / dosen123" },
  { role: "Mahasiswa", credential: "mahasiswa / mhs12345" },
];

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.24),transparent_26%),radial-gradient(circle_at_85%_15%,rgba(245,158,11,0.14),transparent_18%),linear-gradient(135deg,#f7faf8_0%,#ecf3ef_48%,#dfe9e5_100%)]" />
      <div className="absolute inset-y-0 left-[-8%] w-[28rem] rotate-12 rounded-[4rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.06),rgba(15,23,42,0))] blur-3xl" />
      <div className="absolute right-[-5rem] top-16 h-64 w-64 rounded-full bg-[rgba(15,118,110,0.12)] blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.88),rgba(255,255,255,0.6))] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.1)] backdrop-blur md:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[rgba(15,118,110,0.12)] blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-4 rounded-[1.4rem] border border-[rgba(15,118,110,0.16)] bg-white/86 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image src="/logostai.png" alt="Logo STAI" width={56} height={56} className="h-11 w-11 object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--primary-strong)]">Portal akademik terpadu</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">Sekolah Tinggi Agama Islam</p>
              </div>
            </div>

            <p className="mt-8 text-sm uppercase tracking-[0.3em] text-[var(--primary-strong)]">SIAKAD STAI</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-6xl">
              Masuk ke sistem akademik.
            </h1>

            <div className="mt-8 flex flex-wrap gap-3">
              {roleHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[rgba(15,23,42,0.08)] bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {capabilityItems.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-white/70 bg-white/78 p-5 shadow-[0_14px_32px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] text-white shadow-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-[rgba(15,118,110,0.12)] bg-[linear-gradient(180deg,rgba(15,118,110,0.08),rgba(255,255,255,0.72))] p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-medium text-slate-600">Login sesuai role dan lanjut ke dashboard terkait.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:min-w-[22rem]">
                  {statItems.map((item) => (
                    <div key={item.label} className="rounded-2xl bg-white/80 p-4 shadow-sm">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Card className="relative mx-auto w-full max-w-xl overflow-hidden border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-0 shadow-[0_28px_70px_rgba(15,23,42,0.14)]">
          <div className="border-b border-slate-200/70 px-8 py-7 md:px-9">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--primary-strong)]">Secure access</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Masuk ke workspace akademik</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">Gunakan email atau username yang terdaftar.</p>
          </div>

          <div className="px-8 py-7 md:px-9">
            <LoginForm />

            <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Akun demo cepat</p>
                  <p className="mt-1 text-sm text-slate-500">Gunakan salah satu akun berikut.</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  Demo mode
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {demoAccounts.map((account) => (
                  <div
                    key={account.role}
                    className="rounded-2xl border border-white bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                  >
                    <p className="text-sm font-semibold text-slate-900">{account.role}</p>
                    <p className="mt-2 font-mono text-xs leading-6 text-slate-600">{account.credential}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
