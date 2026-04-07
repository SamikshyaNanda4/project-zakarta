import { notFound } from "next/navigation";
import { PropertyDetailClient } from "@/components/property-detail-client";
import type { PropertyPublic } from "@/api";
import { serverHttp } from "@/api/server";

// Server component: fetches property data, delegates contact reveal to client
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let property!: PropertyPublic;
  try {
    property = await serverHttp.GET<PropertyPublic>(`/properties/${id}`);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PropertyDetailClient property={property} />
    </main>
  );
}
