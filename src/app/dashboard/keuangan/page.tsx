import { requireAuthorizedUser } from "@/lib/auth";
import { FinancePanel } from "@/modules/finance/finance-panel";
import { RolePanel } from "@/modules/shared/role-panel";

export default async function FinancePage() {
  const user = await requireAuthorizedUser("keuangan", ["Admin", "Keuangan", "Mahasiswa", "Pimpinan"]);

  return (
    <div className="space-y-6">
      <RolePanel user={user} />
      <FinancePanel />
    </div>
  );
}
