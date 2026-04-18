import { Card } from "@/components/ui/card";
import { requireAuthorizedUser } from "@/lib/auth";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function GradePage() {
  const user = await requireAuthorizedUser("nilai", ["Admin", "Prodi", "Dosen", "Mahasiswa"]);

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <Card>
        <p className="text-sm text-slate-500">Nilai</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-900">Komponen penilaian, publish, dan finalisasi</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {["Tugas", "UTS", "UAS", "Finalisasi"].map((item) => (
            <div key={item} className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
