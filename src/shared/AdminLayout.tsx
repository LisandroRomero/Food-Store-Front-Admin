import type { ReactNode } from "react";

import Sidebar from "./SideBar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />

      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
