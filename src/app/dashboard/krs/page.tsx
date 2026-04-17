import { requireUser } from "@/lib/auth";
import { KrsPanel } from "@/modules/krs/krs-panel";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function KrsPage() {
  const user = await requireUser(["Admin", "Prodi", "Dosen", "Mahasiswa"]);

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <KrsPanel />
    </div>
  );
}
