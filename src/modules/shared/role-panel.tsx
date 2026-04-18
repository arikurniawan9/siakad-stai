import { Card } from "@/components/ui/card";
import type { SessionUser } from "@/types/domain";

const roleCopy = {
  Admin: "Monitoring operasional, statistik lintas modul, user terakhir login, dan audit trail.",
  Prodi: "Kelola mata kuliah, dosen wali, jadwal, dan approval akademik program studi.",
  Dosen: "Pantau jadwal mengajar, input nilai, dan mahasiswa bimbingan akademik.",
  Mahasiswa: "Isi KRS, cek tagihan, lihat jadwal kuliah, dan status registrasi semester.",
  Staff: "Validasi PMB, surat, import data, dan administrasi akademik harian.",
  Keuangan: "Kelola tagihan, pembayaran, dispensasi, piutang, dan verifikasi bukti transfer.",
  Pimpinan: "Akses laporan eksekutif, tren kelulusan, pendapatan, dan KPI kampus.",
};

export function RolePanel({ user }: { user: SessionUser }) {
  const availableRoles = user.availableRoles ?? [user.role];

  return (
    <Card className="bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_100%)] text-white">
      <p className="text-sm text-cyan-100/80">Ringkasan role</p>
      <h3 className="mt-2 text-2xl font-semibold">{user.role}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-100">{roleCopy[user.role]}</p>
      {availableRoles.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {availableRoles.map((role) => (
            <span
              key={role}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                role === user.role
                  ? "border-cyan-200/40 bg-cyan-300/18 text-white"
                  : "border-white/15 bg-white/8 text-slate-100"
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
