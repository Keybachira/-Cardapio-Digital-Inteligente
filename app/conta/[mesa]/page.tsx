import { notFound } from "next/navigation";
import { MESAS } from "@/lib/mock-data";
import ContaClient from "@/components/conta/ContaClient";

export default async function ContaPage({
  params,
  searchParams,
}: {
  params: Promise<{ mesa: string }>;
  searchParams: Promise<{ codigo?: string }>;
}) {
  const { mesa } = await params;
  const { codigo } = await searchParams;
  const mesaObj = MESAS.find((m) => m.id === mesa);
  if (!mesaObj) notFound();

  return (
    <ContaClient
      mesaId={mesaObj.id}
      numeroMesa={mesaObj.numero}
      codigoInicial={codigo}
    />
  );
}

export function generateStaticParams() {
  return MESAS.map((m) => ({ mesa: m.id }));
}
