"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Landmark, PlusCircle } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/estatuas", label: "Estatuas", icon: Landmark, exact: false },
  { href: "/admin/estatuas/nueva", label: "Nueva estatua", icon: PlusCircle, exact: true },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
