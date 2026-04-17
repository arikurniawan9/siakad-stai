import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { RolePanel } from "@/modules/shared/role-panel";

const items = [
  "Program Studi",
  "Mata Kuliah",
  "Dosen",
  "Mahasiswa",
  "Tahun Akademik",
  "Jadwal Kuliah",
];

export default async function MasterDataPage() {
  const user = await requireUser(["Admin", "Prodi", "Staff"]);

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <Card>
        <p className="text-sm text-slate-500">Master Data</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-900">Entitas akademik utama</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="rounded-3xl bg-slate-50 p-5 text-sm font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
