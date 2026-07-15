import { notFound } from "next/navigation";
import { MESAS } from "@/lib/mock-data";
import MenuClient from "@/components/menu/MenuClient";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ mesa: string }>;
}) {
  const { mesa } = await params;
  const mesaObj = MESAS.find((m) => m.id === mesa);
  if (!mesaObj) notFound();

  return <MenuClient mesaId={mesaObj.id} numeroMesa={mesaObj.numero} />;
}

export function generateStaticParams() {
  return MESAS.map((m) => ({ mesa: m.id }));
}
