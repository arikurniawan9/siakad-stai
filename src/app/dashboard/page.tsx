import { DashboardOverview } from "@/modules/dashboard/overview";
import { RolePanel } from "@/modules/shared/role-panel";
import { requireAuthorizedUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireAuthorizedUser("dashboard");

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <DashboardOverview user={user} />
    </div>
  );
}
