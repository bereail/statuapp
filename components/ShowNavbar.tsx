"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

const HIDE_ON = [/^\/admin/];

export default function ShowNavbar() {
  const pathname = usePathname();
  const hide = HIDE_ON.some((rx) => rx.test(pathname));
  if (hide) return null;
  return <Navbar />;
}
