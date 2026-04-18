"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { SessionUser, SidebarItem } from "@/types/domain";

export function DashboardShell({
  user,
  items,
  children,
}: {
  user: SessionUser;
  items: SidebarItem[];
  children: ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handleToggleSidebar() {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileSidebarOpen((value) => !value);
      return;
    }

    setSidebarCollapsed((value) => !value);
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#edf2f7_0%,#f8fafc_28%,#f8fafc_100%)]">
      {mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      ) : null}

      <Sidebar
        user={user}
        items={items}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggle={handleToggleSidebar}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className={sidebarCollapsed ? "hidden lg:block lg:w-[5.25rem]" : "hidden lg:block lg:w-[17rem]"} />
      <main className="min-w-0 flex-1 overflow-x-hidden p-3 md:p-5">
        <div className="mx-auto max-w-7xl space-y-5 overflow-x-hidden">
          <div
            className={`fixed top-3 right-3 z-20 lg:top-5 lg:right-5 ${
              sidebarCollapsed ? "lg:left-[6.5rem]" : "lg:left-[18.25rem]"
            }`}
          >
            <div className="mx-auto max-w-7xl">
              <Topbar user={user} onToggleSidebar={handleToggleSidebar} />
            </div>
          </div>
          <div
            className={`fixed right-3 bottom-3 z-20 lg:right-5 lg:bottom-5 ${
              sidebarCollapsed ? "lg:left-[6.5rem]" : "lg:left-[18.25rem]"
            }`}
          >
            <div className="mx-auto max-w-7xl">
              <Footer />
            </div>
          </div>
          <div className="pt-32 pb-28 md:pt-36 md:pb-32">{children}</div>
        </div>
      </main>
    </div>
  );
}
