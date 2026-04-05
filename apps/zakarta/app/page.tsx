import { API_URL } from "@/lib/env";
import { PropertiesListClient } from "@/components/properties-list-client";
import type { PropertyListResponse } from "@/lib/api";

// Server component: fetch on every request for fresh listings
export default async function HomePage() {
  let data: PropertyListResponse = { properties: [], total: 0 };

  try {
    const res = await fetch(`${API_URL}/properties`, { cache: "no-store" });
    if (res.ok) {
      data = await res.json();
    }
  } catch {
    // API unavailable — render empty list gracefully
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Property Listings
        </h1>
        <p className="mt-2 text-base text-gray-500">
          {data.total > 0
            ? `${data.total} ${data.total === 1 ? "property" : "properties"} available`
            : "Browse available properties below."}
        </p>
      </div>

      {/* Client component handles session, auth modal, and contact reveal */}
      <PropertiesListClient initialProperties={data.properties} />
    </main>
  );
}
