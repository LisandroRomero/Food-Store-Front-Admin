import type { ReactNode } from "react";

import Sidebar from "./SideBar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 bg-slate-950">
        {children}
      </main>
    </div>
  );
}
