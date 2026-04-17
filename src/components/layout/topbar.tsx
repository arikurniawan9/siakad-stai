import { Bell, LogOut, Search } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SessionUser } from "@/types/domain";

export function Topbar({ user }: { user: SessionUser }) {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] bg-white/80 p-4 shadow-[0_20px_45px_rgba(148,163,184,0.15)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm text-slate-500">Role aktif</p>
        <h2 className="text-2xl font-semibold text-slate-900">
          {user.role} Workspace
        </h2>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative min-w-72">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input className="pl-10" placeholder="Cari mahasiswa, tagihan, kelas..." />
        </div>
        <Button variant="secondary" size="sm">
          <Bell className="mr-2 h-4 w-4" />
          3 notifikasi
        </Button>
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" className="text-slate-700">
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </form>
      </div>
    </header>
  );
}
