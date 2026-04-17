import { DashboardOverview } from "@/modules/dashboard/overview";
import { RolePanel } from "@/modules/shared/role-panel";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <DashboardOverview user={user} />
    </div>
  );
}
