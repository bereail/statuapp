"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

const HIDE_ON = [/^\/estatuas\/[^/]+$/, /^\/admin/]; // detalle de estatua y panel admin

export default function ShowFooter() {
  const pathname = usePathname();
  const hide = HIDE_ON.some(rx => rx.test(pathname));
  if (hide) return null;
  return <Footer />;
}
