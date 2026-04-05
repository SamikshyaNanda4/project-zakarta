import { notFound } from "next/navigation";
import { API_URL } from "@/lib/env";
import { PropertyDetailClient } from "@/components/property-detail-client";
import type { PropertyPublic } from "@/lib/api";

// Server component: fetches property data, delegates contact reveal to client
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${API_URL}/properties/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) notFound();

  const property: PropertyPublic = await res.json();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PropertyDetailClient property={property} />
    </main>
  );
}
