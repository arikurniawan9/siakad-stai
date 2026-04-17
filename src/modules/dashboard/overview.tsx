"use client";

import { BarChart3, BookMarked, CreditCard, UserRoundCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { announcementFeed, dashboardMetrics } from "@/lib/constants";
import type { SessionUser } from "@/types/domain";

const trendData = [
  { month: "Jan", mahasiswa: 2250, pembayaran: 780 },
  { month: "Feb", mahasiswa: 2310, pembayaran: 810 },
  { month: "Mar", mahasiswa: 2365, pembayaran: 845 },
  { month: "Apr", mahasiswa: 2481, pembayaran: 910 },
];

const highlightCards = [
  {
    title: "Approval Flow",
    value: "27 item",
    icon: UserRoundCheck,
    description: "KRS, dispensasi, dan surat menunggu validasi.",
  },
  {
    title: "Akademik",
    value: "84 kelas",
    icon: BookMarked,
    description: "Perkuliahan aktif dan monitoring kapasitas kelas.",
  },
  {
    title: "Keuangan",
    value: "93% paid",
    icon: CreditCard,
    description: "Registrasi semester tervalidasi setelah pembayaran.",
  },
  {
    title: "Laporan",
    value: "11 export",
    icon: BarChart3,
    description: "Excel dan PDF siap untuk pimpinan dan prodi.",
  },
];

export function DashboardOverview({ user }: { user: SessionUser }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-3">
        {dashboardMetrics[user.role].map((metric) => (
          <Card key={metric.label}>
            <p className="text-sm text-slate-500">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <h3 className="text-3xl font-semibold text-slate-900">{metric.value}</h3>
              <Badge>{metric.change}</Badge>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Grafik Operasional</p>
              <h3 className="text-xl font-semibold text-slate-900">Mahasiswa Aktif vs Pembayaran</h3>
            </div>
            <Badge>Realtime snapshot</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mahasiswa" fill="#0f766e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pembayaran" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Pengumuman & Notifikasi</p>
          <div className="mt-4 space-y-4">
            {announcementFeed
              .filter((item) => item.role === "Semua" || item.role === user.role)
              .map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <Badge>{item.createdAt}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlightCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--primary-strong)]">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h4>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
