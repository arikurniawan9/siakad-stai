import { requireUser } from "@/lib/auth";
import { ReportPanel } from "@/modules/reports/report-panel";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function ReportsPage() {
  const user = await requireUser(["Admin", "Prodi", "Keuangan", "Pimpinan"]);

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <ReportPanel />
    </div>
  );
}
