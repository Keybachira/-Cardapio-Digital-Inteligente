import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kianda — Grelha & Mar",
  description: "Cardápio digital Kianda. Escaneie, escolha, saboreie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-AO">
      <body>{children}</body>
    </html>
  );
}
