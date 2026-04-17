import Link from "next/link";
import { ArrowRight, ShieldCheck, University } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  "Auth multi-role dengan fallback demo lokal dan integrasi Supabase.",
  "Dashboard akademik, PMB, KRS, nilai, keuangan, laporan, notifikasi, dan approval flow.",
  "Skema PostgreSQL lengkap dengan migration SQL, seed, audit log, dan soft delete.",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
            <University className="h-4 w-4 text-[var(--primary)]" />
            Production-ready academic operating system
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-slate-950">
            SIAKAD universitas untuk PMB, registrasi, KRS, nilai, keuangan, dan pelaporan.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Fondasi aplikasi siap jalan lokal di folder ini, dengan struktur modular Next.js App Router,
            Supabase-ready auth, dashboard per role, dan migration SQL lengkap.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login">
              <Button size="lg">
                Masuk ke aplikasi
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                Lihat dashboard demo
              </Button>
            </Link>
          </div>
        </section>

        <Card className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]">
              <ShieldCheck className="h-5 w-5 text-[var(--primary-strong)]" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Implemented baseline</p>
              <h2 className="text-xl font-semibold text-slate-900">Siap dikembangkan ke production</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {highlights.map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 p-4 font-mono text-sm text-emerald-300">
            demo login:
            <br />
            admin / admin123
            <br />
            mahasiswa / mhs12345
          </div>
        </Card>
      </div>
    </main>
  );
}
