import { PropertiesListClient } from "@/components/properties-list-client";
import type { PropertyListResponse } from "@/api";
import { API_URL } from "@/lib/env";
import ProductCarousel from "@/components/Corousal/dynamic-corousal";

export const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "Immerse yourself in crystal-clear sound with our latest noise-cancelling technology.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: 2,
    name: "Animal",
    description: "A picture of an animal that depicts negligance towards what is happening in the real world",
    image:"https://images.unsplash.com/photo-1774314706341-041341ae7af5?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
  // Add more products...
]

// Server component: fetch on every request for fresh listings
export default async function HomePage() {
  let data: PropertyListResponse = { properties: [], total: 0 };

  try {
    const res = await fetch(`${API_URL}/properties`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    data = await res.json() as PropertyListResponse;
  } catch (err) {
    console.error("[HomePage] Failed to fetch properties:", err);
  }

  return (
    <>
    <ProductCarousel products={products} />
    <main className="mx-auto max-w-7xl px-4 py-3 sm:px-3   lg:px-8">
      <div className="mb-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Property Listings
        </h1>
        <p className="mt-2 text-base text-gray-500">
          {data.total > 0
            ? `${data.total} ${data.total === 1 ? " stadout property" : " standout properties"} featured for today.`
            : "Browse available properties above."}
        </p>
      </div>
      
      {/* Client component handles session, auth modal, and contact reveal */}
      
      <PropertiesListClient initialProperties={data.properties} />
    </main>
    </>
  );
}
