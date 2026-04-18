import { connection } from "next/server";

import { getMasterDataSnapshot } from "@/lib/admin/master-data";
import { requireAuthorizedUser } from "@/lib/auth";
import { MahasiswaSection } from "@/modules/master-data/sections";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function MahasiswaPage() {
  await connection();

  const user = await requireAuthorizedUser("master-data.mahasiswa");
  const snapshot = await getMasterDataSnapshot();

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <MahasiswaSection snapshot={snapshot} />
    </div>
  );
}
