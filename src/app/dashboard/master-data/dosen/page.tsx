import { connection } from "next/server";

import { getMasterDataSnapshot } from "@/lib/admin/master-data";
import { requireAuthorizedUser } from "@/lib/auth";
import { DosenSection } from "@/modules/master-data/sections";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function DosenPage() {
  await connection();

  const user = await requireAuthorizedUser("master-data.dosen");
  const snapshot = await getMasterDataSnapshot();

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <DosenSection snapshot={snapshot} />
    </div>
  );
}
