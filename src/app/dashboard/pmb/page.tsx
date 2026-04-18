import { requireAuthorizedUser } from "@/lib/auth";
import { PmbWizard } from "@/modules/pmb/pmb-wizard";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function PmbPage() {
  const user = await requireAuthorizedUser("pmb", ["Admin", "Prodi", "Staff"]);

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <PmbWizard />
    </div>
  );
}
