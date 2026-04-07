"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, RotateCcw, MapPin } from "lucide-react";
import { Slider } from "@repo/ui/components/ui/slider";
import { localities } from "@/api";

type Area = "Bhubaneswar" | "Cuttack" | "Puri";

const BHK_OPTIONS = [
  { label: "1 RK", value: "1RK" },
  { label: "1 BHK", value: "1" },
  { label: "2 BHK", value: "2" },
  { label: "3 BHK", value: "3" },
  { label: "4 BHK", value: "4" },
  { label: "4+ BHK", value: "5+" },
];

const HOME_TYPES = [
  { label: "Apartment", value: "apartment" },
  { label: "Independent House", value: "independent_house" },
  { label: "Gated Villa", value: "gated_community_villa" },
  { label: "Standalone Building", value: "standalone_building" },
];

const FURNISHED_OPTIONS = [
  { label: "Fully Furnished", value: "fully_furnished" },
  { label: "Semi Furnished", value: "semi_furnished" },
  { label: "Unfurnished", value: "unfurnished" },
];

const PARKING_OPTIONS = [
  { label: "Bike", value: "bike" },
  { label: "Car", value: "car" },
  { label: "Both", value: "both" },
  { label: "None", value: "none" },
];

const PROPERTY_AGE_OPTIONS = [
  { label: "< 1 year", value: "<1yr" },
  { label: "1–3 years", value: "1-3 years" },
  { label: "4–7 years", value: "4-7 years" },
  { label: "7–10 years", value: "7-10 years" },
  { label: "10+ years", value: "10 plus" },
];

const BATHROOM_OPTIONS = [1, 2, 3, 4];

// Max price in Lakhs for sell, thousands for rent
const PRICE_MAX_SELL = 1000; // 10 Cr = 1000L
const PRICE_MAX_RENT = 200;  // ₹2,00,000/mo
const AREA_MAX = 10000;      // sq.ft.

type Locality = { id: string; name: string };

type Filters = {
  listingType: "sell" | "rent";
  area: Area;
  localityIds: string[];
  bhk: string | null;
  homeType: string | null;
  priceRange: [number, number];
  furnished: string | null;
  parking: string | null;
  propertyAge: string | null;
  bathrooms: number | null;
  builtUpArea: [number, number];
};

type Props = {
  initialArea: Area;
  initialListingType: "sell" | "rent";
  initialLocalityIds: string[];
  initialBhk: string | null;
  initialHomeType: string | null;
  initialPriceMin: number | null;
  initialPriceMax: number | null;
  initialFurnished: string | null;
  initialParking: string | null;
  initialPropertyAge: string | null;
  initialBathrooms: number | null;
  initialBuiltUpAreaMin: number | null;
  initialBuiltUpAreaMax: number | null;
  /** Locality objects matching the initial IDs */
  initialLocalityObjects: Locality[];
};

function formatPriceLabel(val: number, type: "sell" | "rent"): string {
  if (type === "sell") {
    if (val >= 100) return `₹${(val / 100).toFixed(1)}Cr`;
    return `₹${val}L`;
  }
  if (val >= 1) return `₹${val}k`;
  return `₹${val * 1000}`;
}

export function PropertiesFilterBar({
  initialArea,
  initialListingType,
  initialLocalityIds,
  initialBhk,
  initialHomeType,
  initialPriceMin,
  initialPriceMax,
  initialFurnished,
  initialParking,
  initialPropertyAge,
  initialBathrooms,
  initialBuiltUpAreaMin,
  initialBuiltUpAreaMax,
  initialLocalityObjects,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceMax = initialListingType === "sell" ? PRICE_MAX_SELL : PRICE_MAX_RENT;

  const [filters, setFilters] = useState<Filters>({
    listingType: initialListingType,
    area: initialArea,
    localityIds: initialLocalityIds,
    bhk: initialBhk,
    homeType: initialHomeType,
    priceRange: [initialPriceMin ?? 0, initialPriceMax ?? priceMax],
    furnished: initialFurnished,
    parking: initialParking,
    propertyAge: initialPropertyAge,
    bathrooms: initialBathrooms,
    builtUpArea: [initialBuiltUpAreaMin ?? 0, initialBuiltUpAreaMax ?? AREA_MAX],
  });

  const [localityObjects, setLocalityObjects] = useState<Locality[]>(initialLocalityObjects);
  const [allLocalities, setAllLocalities] = useState<Locality[]>([]);
  const [localitySearch, setLocalitySearch] = useState("");
  const [localitySuggestions, setLocalitySuggestions] = useState<Locality[]>([]);
  const [showLocalitySearch, setShowLocalitySearch] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const localityInputRef = useRef<HTMLInputElement>(null);


  // Fetch localities for the current area
  useEffect(() => {
    localities.list(filters.area)
      .then((d) => setAllLocalities(d.localities))
      .catch(() => setAllLocalities([]));
  }, [filters.area]);

  // Filter locality suggestions
  useEffect(() => {
    if (!localitySearch.trim()) {
      setLocalitySuggestions(allLocalities.filter((l) => !filters.localityIds.includes(l.id)));
      return;
    }
    const q = localitySearch.toLowerCase();
    setLocalitySuggestions(
      allLocalities.filter((l) => l.name.toLowerCase().includes(q) && !filters.localityIds.includes(l.id))
    );
  }, [localitySearch, allLocalities, filters.localityIds]);

  const push = useCallback((f: Filters) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("listingType", f.listingType);
    params.set("area", f.area);

    if (f.localityIds.length > 0) params.set("localityIds", f.localityIds.join(","));
    else params.delete("localityIds");

    if (f.bhk) params.set("bhk", f.bhk); else params.delete("bhk");
    if (f.homeType) params.set("homeType", f.homeType); else params.delete("homeType");
    if (f.priceRange[0] > 0) params.set("priceMin", String(f.priceRange[0])); else params.delete("priceMin");
    if (f.priceRange[1] < priceMax) params.set("priceMax", String(f.priceRange[1])); else params.delete("priceMax");
    if (f.furnished) params.set("furnished", f.furnished); else params.delete("furnished");
    if (f.parking) params.set("parking", f.parking); else params.delete("parking");
    if (f.propertyAge) params.set("propertyAge", f.propertyAge); else params.delete("propertyAge");
    if (f.bathrooms) params.set("bathrooms", String(f.bathrooms)); else params.delete("bathrooms");
    if (f.builtUpArea[0] > 0) params.set("builtUpAreaMin", String(f.builtUpArea[0])); else params.delete("builtUpAreaMin");
    if (f.builtUpArea[1] < AREA_MAX) params.set("builtUpAreaMax", String(f.builtUpArea[1])); else params.delete("builtUpAreaMax");

    router.push(`/properties?${params.toString()}`);
  }, [router, searchParams, priceMax]);

  function update(patch: Partial<Filters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    push(next);
  }

  function toggleBhk(val: string) {
    update({ bhk: filters.bhk === val ? null : val });
  }
  function toggleHomeType(val: string) {
    update({ homeType: filters.homeType === val ? null : val });
  }
  function toggleFurnished(val: string) {
    update({ furnished: filters.furnished === val ? null : val });
  }
  function toggleParking(val: string) {
    update({ parking: filters.parking === val ? null : val });
  }
  function togglePropertyAge(val: string) {
    update({ propertyAge: filters.propertyAge === val ? null : val });
  }
  function toggleBathrooms(val: number) {
    update({ bathrooms: filters.bathrooms === val ? null : val });
  }

  function addLocality(loc: Locality) {
    if (filters.localityIds.length >= 5) return;
    setLocalityObjects((prev) => [...prev, loc]);
    update({ localityIds: [...filters.localityIds, loc.id] });
    setLocalitySearch("");
  }
  function removeLocality(id: string) {
    setLocalityObjects((prev) => prev.filter((l) => l.id !== id));
    update({ localityIds: filters.localityIds.filter((i) => i !== id) });
  }

  function resetAll() {
    const reset: Filters = {
      listingType: filters.listingType,
      area: filters.area,
      localityIds: [],
      bhk: null,
      homeType: null,
      priceRange: [0, priceMax],
      furnished: null,
      parking: null,
      propertyAge: null,
      bathrooms: null,
      builtUpArea: [0, AREA_MAX],
    };
    setLocalityObjects([]);
    setFilters(reset);
    push(reset);
  }

  const hasActiveFilters =
    filters.localityIds.length > 0 ||
    filters.bhk ||
    filters.homeType ||
    filters.furnished ||
    filters.parking ||
    filters.propertyAge ||
    filters.bathrooms ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < priceMax ||
    filters.builtUpArea[0] > 0 ||
    filters.builtUpArea[1] < AREA_MAX;

  return (
    <div
      ref={barRef}
      className="sticky top-14 z-20 bg-white border-b border-gray-100 shadow-sm"
    >
      {/* ── Quick filter strip ─────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center gap-2">
        {/* Listing type toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
          {(["sell", "rent"] as const).map((t) => (
            <button
              key={t}
              onClick={() => update({ listingType: t, priceRange: [0, t === "sell" ? PRICE_MAX_SELL : PRICE_MAX_RENT] })}
              className={`px-3 py-1.5 transition-colors capitalize ${
                filters.listingType === t
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t === "sell" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>

        {/* BHK quick filters */}
        {BHK_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggleBhk(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filters.bhk === opt.value
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
            }`}
          >
            {opt.label}
          </button>
        ))}

        {/* More Filters button */}
        <button
          onClick={() => setShowMoreFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            showMoreFilters || hasActiveFilters
              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
              : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          More Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          )}
          <ChevronDown className={`h-3 w-3 transition-transform ${showMoreFilters ? "rotate-180" : ""}`} />
        </button>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}

        {/* Active locality chips */}
        {localityObjects.map((loc) => (
          <span
            key={loc.id}
            className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            <MapPin className="h-3 w-3" />
            {loc.name}
            <button onClick={() => removeLocality(loc.id)} className="hover:text-emerald-600">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {/* ── Expanded filter panel ──────────────────────────────────── */}
      {showMoreFilters && (
        <div className="border-t border-gray-100 bg-gray-50/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* Locality search */}
            <div className="lg:col-span-2 xl:col-span-2">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Localities</p>
              <div
                className={`flex flex-wrap gap-1.5 items-center min-h-9 px-3 bg-white border rounded-xl cursor-text transition-colors ${
                  showLocalitySearch ? "border-emerald-400 ring-1 ring-emerald-200" : "border-gray-200"
                }`}
                onClick={() => { setShowLocalitySearch(true); localityInputRef.current?.focus(); }}
              >
                {localityObjects.map((loc) => (
                  <span key={loc.id} className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {loc.name}
                    <button onClick={(e) => { e.stopPropagation(); removeLocality(loc.id); }}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {filters.localityIds.length < 5 && (
                  <div className="relative flex-1 min-w-[120px]">
                    <input
                      ref={localityInputRef}
                      type="text"
                      value={localitySearch}
                      onChange={(e) => { setLocalitySearch(e.target.value); setShowLocalitySearch(true); }}
                      onFocus={() => setShowLocalitySearch(true)}
                      onBlur={() => setTimeout(() => setShowLocalitySearch(false), 150)}
                      placeholder="Search locality…"
                      className="w-full text-xs outline-none bg-transparent py-2 placeholder:text-gray-400"
                    />
                    {showLocalitySearch && localitySuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 max-h-44 overflow-y-auto">
                        {localitySuggestions.map((loc) => (
                          <button
                            key={loc.id}
                            onMouseDown={(e) => { e.preventDefault(); addLocality(loc); }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition-colors"
                          >
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {loc.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {filters.localityIds.length >= 5 && (
                <p className="text-xs text-amber-600 mt-1">Maximum 5 localities selected</p>
              )}
            </div>

            {/* Price Range */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Price Range
              </p>
              <div className="px-1">
                <Slider
                  min={0}
                  max={priceMax}
                  step={filters.listingType === "sell" ? 5 : 2}
                  value={filters.priceRange}
                  onValueChange={(v) => setFilters((prev) => ({ ...prev, priceRange: v as [number, number] }))}
                  onValueCommit={(v) => update({ priceRange: v as [number, number] })}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{formatPriceLabel(filters.priceRange[0], filters.listingType)}</span>
                  <span>{formatPriceLabel(filters.priceRange[1], filters.listingType)}</span>
                </div>
              </div>
            </div>

            {/* Built Up Area (sell only) */}
            {filters.listingType === "sell" && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Built Up Area (sq.ft.)
                </p>
                <div className="px-1">
                  <Slider
                    min={0}
                    max={AREA_MAX}
                    step={50}
                    value={filters.builtUpArea}
                    onValueChange={(v) => setFilters((prev) => ({ ...prev, builtUpArea: v as [number, number] }))}
                    onValueCommit={(v) => update({ builtUpArea: v as [number, number] })}
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{filters.builtUpArea[0].toLocaleString()} sq.ft.</span>
                    <span>{filters.builtUpArea[1].toLocaleString()} sq.ft.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Property Type */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Property Type</p>
              <div className="flex flex-col gap-1.5">
                {HOME_TYPES.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.homeType === opt.value}
                      onChange={() => toggleHomeType(opt.value)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 accent-emerald-600"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-emerald-700 transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Furnishing</p>
              <div className="flex flex-col gap-1.5">
                {FURNISHED_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.furnished === opt.value}
                      onChange={() => toggleFurnished(opt.value)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 accent-emerald-600"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-emerald-700 transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Parking */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Parking</p>
              <div className="flex flex-wrap gap-1.5">
                {PARKING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleParking(opt.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      filters.parking === opt.value
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Age */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Property Age</p>
              <div className="flex flex-wrap gap-1.5">
                {PROPERTY_AGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => togglePropertyAge(opt.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      filters.propertyAge === opt.value
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Bathrooms</p>
              <div className="flex gap-2">
                {BATHROOM_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleBathrooms(n)}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-all ${
                      filters.bathrooms === n
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
                    }`}
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Panel footer */}
          <div className="border-t border-gray-100 bg-white px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <button
              onClick={resetAll}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset all filters
            </button>
            <button
              onClick={() => setShowMoreFilters(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
