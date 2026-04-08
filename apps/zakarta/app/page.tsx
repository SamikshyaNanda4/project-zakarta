import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PropertyListResponse } from "@/api";
import { API_URL } from "@/lib/env";
import ProductCarousel from "@/components/Corousal/dynamic-corousal";
import { HomeSearchBar } from "@/components/home-search-bar";
import { PropertiesListClient } from "@/components/properties-list-client";

export const products = [
  {
    id: 1,
    name: "Premium 3BHK Properties in Kalinga Nagar",
    description: "Spacious • Vaastu-compliant • Ready to move",
    image: "https://images.unsplash.com/photo-1617217139357-b77ae58ad4b2?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    name: "Puri Heritage Apartments",
    description: "Reverberation of the Old Puri Heritage",
    image:"https://images.unsplash.com/photo-1655352710727-6c89536454b3?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

async function getFeaturedProperties(): Promise<PropertyListResponse> {
  try {
    const res = await fetch(
      `${API_URL}/properties?featured=true&pageSize=6`,
      { cache: "no-store" }
    );
    if (!res.ok) return { properties: [], total: 0 };
    return res.json() as Promise<PropertyListResponse>;
  } catch {
    return { properties: [], total: 0 };
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProperties();

  return (
    <>
      <ProductCarousel products={products} />

      <section className="bg-gradient-to-b from-emerald-50/60 to-white py-10 px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-2">
            Find your perfect home
          </p>
          <h1 className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Search Properties in<br />
            <span className="text-emerald-600">Odisha</span>
          </h1>
          <HomeSearchBar />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
            <p className="mt-1 text-sm text-gray-500">
              {featured.total > 0
                ? `${featured.total} handpicked ${featured.total === 1 ? "property" : "properties"} for you`
                : "Be the first to list your property!"}
            </p>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-gray-200">
            <p className="text-lg font-medium text-gray-400">No featured properties yet.</p>
            <Link
              href="/properties"
              className="mt-3 text-sm text-emerald-600 hover:underline font-medium"
            >
              Browse all listings →
            </Link>
          </div>
        ) : (
          <PropertiesListClient initialProperties={featured.properties} />
        )}
      </main>
    </>
  );
}
