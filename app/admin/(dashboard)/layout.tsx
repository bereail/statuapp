import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Panel admin — StatuApp",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold">StatuApp — Admin</span>
            <AdminNav />
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
