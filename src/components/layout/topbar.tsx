"use client";

import { usePathname } from "next/navigation";
import { Bell, LogOut, Menu, Search } from "lucide-react";

import { logoutAction, switchActiveRoleAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SessionUser } from "@/types/domain";

export function Topbar({
  user,
  onToggleSidebar,
}: {
  user: SessionUser;
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const availableRoles = user.availableRoles ?? [user.role];

  return (
    <header className="flex flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/88 p-4 shadow-[0_20px_45px_rgba(148,163,184,0.15)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onToggleSidebar}
          className="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-white/90 p-0 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">Role aktif</p>
          <h2 className="truncate text-xl font-semibold text-slate-900 md:text-2xl">{user.role} Workspace</h2>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center lg:w-auto">
        {availableRoles.length > 1 ? (
          <form action={switchActiveRoleAction} className="flex items-center gap-2">
            <input type="hidden" name="redirectTo" value={pathname || "/dashboard"} />
            <select
              name="role"
              defaultValue={user.role}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[var(--primary)]"
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm" className="whitespace-nowrap">
              Ganti role
            </Button>
          </form>
        ) : null}
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input className="pl-10" placeholder="Cari mahasiswa, tagihan, kelas..." />
        </div>
        <Button variant="secondary" size="sm" className="justify-center md:justify-start">
          <Bell className="mr-2 h-4 w-4" />
          3 notifikasi
        </Button>
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" className="w-full justify-center text-slate-700 md:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </form>
      </div>
    </header>
  );
}
