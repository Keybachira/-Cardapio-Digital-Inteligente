"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { estaAutenticado } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin";
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    setAutenticado(estaAutenticado());
  }, []);

  useEffect(() => {
    if (!isLogin && !autenticado) {
      router.replace("/admin");
    }
  }, [isLogin, autenticado, router]);

  if (isLogin) return <>{children}</>;

  if (!autenticado) return <div className="min-h-screen" style={{ background: "var(--ink)" }} />;

  return (
    <div className="min-h-screen flex flex-col sm:flex-row" style={{ background: "var(--ink)" }}>
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
