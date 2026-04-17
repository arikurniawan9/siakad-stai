import { Card } from "@/components/ui/card";
import { LoginForm } from "@/app/login/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--primary-strong)]">SIAKAD STAI</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight text-slate-950">
            Login multi-role untuk seluruh proses akademik kampus.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Gunakan email atau username. Saat environment Supabase tersedia, flow auth sudah siap
            dihubungkan ke `auth.users` dan tabel profile `public.users`.
          </p>
        </section>

        <Card className="mx-auto w-full max-w-lg p-8">
          <p className="text-sm text-slate-500">Masuk ke sistem</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Akses dashboard per role</h2>

          <LoginForm />

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Akun demo:
            <br />
            `admin / admin123`
            <br />
            `prodi / prodi123`
            <br />
            `dosen / dosen123`
            <br />
            `mahasiswa / mhs12345`
          </div>
        </Card>
      </div>
    </main>
  );
}
