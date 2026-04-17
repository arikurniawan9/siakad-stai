import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="min-w-0 flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Topbar user={user} />
          {children}
        </div>
      </main>
    </div>
  );
}
