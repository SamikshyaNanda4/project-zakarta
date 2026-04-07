import type { PropertyListResponse, LocalityListResponse } from "@/api";
import { API_URL } from "@/lib/env";
import { PropertiesFilterBar } from "@/components/properties-filter-bar";
import { InfinitePropertyList } from "@/components/infinite-property-list";

type Area = "Bhubaneswar" | "Cuttack" | "Puri";
const VALID_AREAS: Area[] = ["Bhubaneswar", "Cuttack", "Puri"];

type SearchParams = {
  listingType?: string;
  area?: string;
  localityIds?: string;
  bhk?: string;
  homeType?: string;
  priceMin?: string;
  priceMax?: string;
  builtUpAreaMin?: string;
  builtUpAreaMax?: string;
  furnished?: string;
  parking?: string;
  propertyAge?: string;
  bathrooms?: string;
};

async function fetchProperties(params: URLSearchParams): Promise<PropertyListResponse> {
  try {
    const res = await fetch(`${API_URL}/properties?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return { properties: [], total: 0 };
    return res.json() as Promise<PropertyListResponse>;
  } catch {
    return { properties: [], total: 0 };
  }
}

async function fetchLocalities(area: Area): Promise<LocalityListResponse> {
  try {
    const res = await fetch(`${API_URL}/localities?area=${encodeURIComponent(area)}`, {
      cache: "force-cache",
    });
    if (!res.ok) return { localities: [], total: 0 };
    return res.json() as Promise<LocalityListResponse>;
  } catch {
    return { localities: [], total: 0 };
  }
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const listingType: "sell" | "rent" =
    sp.listingType === "rent" ? "rent" : "sell";
  const area: Area = VALID_AREAS.includes(sp.area as Area)
    ? (sp.area as Area)
    : "Bhubaneswar";
  const localityIdsRaw = sp.localityIds ?? "";
  const localityIds = localityIdsRaw
    ? localityIdsRaw.split(",").slice(0, 5).map((s) => s.trim()).filter(Boolean)
    : [];

  const bhk = sp.bhk ?? null;
  const homeType = sp.homeType ?? null;
  const priceMin = sp.priceMin ? parseFloat(sp.priceMin) : null;
  const priceMax = sp.priceMax ? parseFloat(sp.priceMax) : null;
  const builtUpAreaMin = sp.builtUpAreaMin ? parseFloat(sp.builtUpAreaMin) : null;
  const builtUpAreaMax = sp.builtUpAreaMax ? parseFloat(sp.builtUpAreaMax) : null;
  const furnished = sp.furnished ?? null;
  const parking = sp.parking ?? null;
  const propertyAge = sp.propertyAge ?? null;
  const bathrooms = sp.bathrooms ? parseInt(sp.bathrooms, 10) : null;

  // Build API query
  const params = new URLSearchParams();
  params.set("listingType", listingType);
  params.set("area", area);
  if (localityIds.length > 0) params.set("localityIds", localityIds.join(","));
  if (bhk) params.set("bhk", bhk);
  if (homeType) params.set("homeType", homeType);
  if (priceMin != null) params.set("priceMin", String(priceMin));
  if (priceMax != null) params.set("priceMax", String(priceMax));
  if (builtUpAreaMin != null) params.set("builtUpAreaMin", String(builtUpAreaMin));
  if (builtUpAreaMax != null) params.set("builtUpAreaMax", String(builtUpAreaMax));
  if (furnished) params.set("furnished", furnished);
  if (parking) params.set("parking", parking);
  if (propertyAge) params.set("propertyAge", propertyAge);
  if (bathrooms) params.set("bathrooms", String(bathrooms));
  params.set("pageSize", "20");

  const [data, localitiesData] = await Promise.all([
    fetchProperties(params),
    fetchLocalities(area),
  ]);

  // Resolve locality names from IDs for the filter bar
  const initialLocalityObjects = localitiesData.localities
    .filter((l) => localityIds.includes(l.id))
    .map((l) => ({ id: l.id, name: l.name }));

  const filterParams = {
    listingType,
    area,
    localityIds: localityIds.length > 0 ? localityIds.join(",") : undefined,
    bhk: bhk ?? undefined,
    homeType: homeType ?? undefined,
    priceMin: priceMin ?? undefined,
    priceMax: priceMax ?? undefined,
    builtUpAreaMin: builtUpAreaMin ?? undefined,
    builtUpAreaMax: builtUpAreaMax ?? undefined,
    furnished: furnished ?? undefined,
    parking: parking ?? undefined,
    propertyAge: propertyAge ?? undefined,
    bathrooms: bathrooms ?? undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky filter bar */}
      <PropertiesFilterBar
        initialArea={area}
        initialListingType={listingType}
        initialLocalityIds={localityIds}
        initialBhk={bhk}
        initialHomeType={homeType}
        initialPriceMin={priceMin}
        initialPriceMax={priceMax}
        initialFurnished={furnished}
        initialParking={parking}
        initialPropertyAge={propertyAge}
        initialBathrooms={bathrooms}
        initialBuiltUpAreaMin={builtUpAreaMin}
        initialBuiltUpAreaMax={builtUpAreaMax}
        initialLocalityObjects={initialLocalityObjects}
      />

      {/* Results */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {listingType === "sell" ? "Properties for Sale" : "Properties for Rent"}
              {" "}in {area}
            </h1>
            {localityIds.length > 0 && (
              <p className="mt-0.5 text-sm text-gray-500">
                {initialLocalityObjects.map((l) => l.name).join(", ")}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 shrink-0">
            {data.total} {data.total === 1 ? "result" : "results"}
          </p>
        </div>

        <InfinitePropertyList
          initialProperties={data.properties}
          initialTotal={data.total}
          filters={filterParams}
          pageSize={20}
        />
      </main>
    </div>
  );
}
