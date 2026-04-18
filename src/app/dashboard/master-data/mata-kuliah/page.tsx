import { connection } from "next/server";

import { getMasterDataSnapshot } from "@/lib/admin/master-data";
import { requireAuthorizedUser } from "@/lib/auth";
import { MataKuliahSection } from "@/modules/master-data/sections";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function MataKuliahPage() {
  await connection();

  const user = await requireAuthorizedUser("master-data.mata-kuliah");
  const snapshot = await getMasterDataSnapshot();

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <MataKuliahSection snapshot={snapshot} />
    </div>
  );
}
