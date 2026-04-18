import { connection } from "next/server";

import { getMasterDataSnapshot } from "@/lib/admin/master-data";
import { requireAuthorizedUser } from "@/lib/auth";
import { PenggunaSection } from "@/modules/master-data/sections";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function PenggunaPage() {
  await connection();

  const user = await requireAuthorizedUser("master-data.pengguna");
  const snapshot = await getMasterDataSnapshot();

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <PenggunaSection snapshot={snapshot} />
    </div>
  );
}
