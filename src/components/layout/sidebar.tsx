"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, CircleDollarSign, ClipboardCheck, GraduationCap, LayoutDashboard, LineChart, NotebookPen, Users } from "lucide-react";

import { sidebarItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types/domain";

const icons = [
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  BookOpenCheck,
  NotebookPen,
  CircleDollarSign,
  LineChart,
];

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const items = sidebarItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col justify-between border-r border-white/60 bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)] p-6 text-white lg:flex">
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">SIAKAD STAI</p>
          <h1 className="mt-3 text-2xl font-semibold">Universitas Dashboard</h1>
          <p className="mt-2 text-sm text-slate-300">
            Operasional akademik terpadu untuk PMB, registrasi, KRS, keuangan, dan pelaporan.
          </p>
        </div>

        <nav className="space-y-2">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  active ? "bg-white text-slate-900" : "text-slate-200 hover:bg-white/10",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-3xl bg-white/10 p-4 text-sm text-slate-200">
        <p className="font-semibold">{user.name}</p>
        <p className="mt-1 text-slate-300">{user.role}</p>
        <p className="mt-3 text-xs leading-5 text-slate-300">
          Gunakan akun demo lokal atau hubungkan Supabase untuk auth production.
        </p>
      </div>
    </aside>
  );
}
