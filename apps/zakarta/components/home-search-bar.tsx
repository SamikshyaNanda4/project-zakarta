"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, X, ChevronDown } from "lucide-react";
import { localities } from "@/api";

type Area = "Bhubaneswar" | "Cuttack" | "Puri";
type ListingType = "buy" | "rent";
type BhkOption = "1RK" | "1" | "2" | "3" | "4" | "5+";

type Locality = { id: string; name: string };

const BHK_OPTIONS: { label: string; value: BhkOption }[] = [
  { label: "1 RK", value: "1RK" },
  { label: "1 BHK", value: "1" },
  { label: "2 BHK", value: "2" },
  { label: "3 BHK", value: "3" },
  { label: "4 BHK", value: "4" },
  { label: "4+ BHK", value: "5+" },
];

const AREAS: Area[] = ["Bhubaneswar", "Cuttack", "Puri"];

type RecentSearch = {
  id: string;
  name: string;
  area: Area;
  type: "buy" | "rent";
};

export function HomeSearchBar() {
  const router = useRouter();
  const [listingType, setListingType] = useState<ListingType>("buy");
  const [area, setArea] = useState<Area>("Bhubaneswar");
  const [selectedBhk, setSelectedBhk] = useState<BhkOption | null>(null);
  const [selectedLocalities, setSelectedLocalities] = useState<Locality[]>([]);
  const [localitySearch, setLocalitySearch] = useState("");
  const [allLocalities, setAllLocalities] = useState<Locality[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const localityWrapRef = useRef<HTMLDivElement>(null);

  const fetchLocalities = useCallback(async (a: Area) => {
    setLoadingLocalities(true);
    try {
      const data = await localities.list(a);
      setAllLocalities(data.localities);
    } catch {
      setAllLocalities([]);
    } finally {
      setLoadingLocalities(false);
    }
  }, []);

  useEffect(() => {
    fetchLocalities(area);
    setSelectedLocalities([]);
  }, [area, fetchLocalities]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        localityWrapRef.current &&
        !localityWrapRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) {
        setShowAreaDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addLocality(loc: Locality) {
    if (selectedLocalities.length >= 5) return;
    if (selectedLocalities.find((s) => s.id === loc.id)) return;
    setSelectedLocalities((prev) => [...prev, loc]);
    setLocalitySearch("");
    inputRef.current?.focus();
  }

  function removeLocality(id: string) {
    setSelectedLocalities((prev) => prev.filter((l) => l.id !== id));
  }

  function toggleBhk(val: BhkOption) {
    setSelectedBhk((prev) => (prev === val ? null : val));
  }

function saveRecent(
  localities: Locality[],
  area: Area,
  type: ListingType
) {
  if (typeof window === "undefined") return;

  let existing: RecentSearch[] = [];

try {
  const parsed = JSON.parse(localStorage.getItem("recent_searches") || "[]");
  if (Array.isArray(parsed)) {
    existing = parsed;
  }
} catch {
  existing = [];
}

  const newEntries: RecentSearch[] = localities.map((loc) => ({
    id: loc.id,
    name: loc.name,
    area,
    type,
  }));

  const uniqueMap = new Map<string, RecentSearch>();

  [...existing, ...newEntries].forEach((item) => {
    uniqueMap.set(item.id + "_" + item.type, item);
  });

  const grouped = new Map<string, RecentSearch[]>();

  Array.from(uniqueMap.values()).forEach((item) => {
    if (!grouped.has(item.area)) {
      grouped.set(item.area, []);
    }
    grouped.get(item.area)!.push(item);
  });

  const AREA_ORDER: Area[] = ["Bhubaneswar", "Cuttack", "Puri"];
  const final: RecentSearch[] = [];

  AREA_ORDER.forEach((area) => {
    const items = grouped.get(area);
    if (items) {
      final.push(...items.slice(-2));
    }
  });

  localStorage.setItem("recent_searches", JSON.stringify(final));
}

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("listingType", listingType === "buy" ? "sell" : "rent");
    params.set("area", area);
    if (selectedLocalities.length > 0) {
      params.set("localityIds", selectedLocalities.map((l) => l.id).join(","));
      saveRecent(selectedLocalities, area, listingType);
    }
    if (selectedBhk) params.set("bhk", selectedBhk);
    router.push(`/properties?${params.toString()}`);
  }

  const visibleSuggestions = allLocalities
    .filter((l) => {
      if (selectedLocalities.find((s) => s.id === l.id)) return false;
      if (!localitySearch.trim()) return true;
      return l.name.toLowerCase().includes(localitySearch.toLowerCase());
    });

  return (
    /* No overflow-hidden — dropdowns must escape the card */
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Tabs — use rounded-t-2xl so corners clip only the top */}
      <div className="flex border-b border-gray-100 rounded-t-2xl overflow-hidden">
        {(["buy", "rent"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setListingType(t)}
            className={`relative px-8 py-3.5 text-sm font-semibold transition-colors capitalize ${
              listingType === t
                ? "text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "buy" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start">

          {/* City / Area selector */}
          <div className="relative z-30" ref={areaRef}>
            <button
              onClick={() => setShowAreaDropdown((v) => !v)}
              className="flex items-center gap-2 h-11 px-4 border border-gray-200 rounded-sm bg-gray-50 text-sm font-medium text-gray-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              {area}
              <ChevronDown
                className={`h-3.5 w-3.5 text-gray-400 transition-transform ${showAreaDropdown ? "rotate-180" : ""}`}
              />
            </button>
            {showAreaDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1">
                {AREAS.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setArea(a);
                      setShowAreaDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                      area === a
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Locality multi-select */}
          <div className="relative flex-1 min-w-0 z-20" ref={localityWrapRef}>
            <div
              className={`flex flex-wrap items-center gap-1.5 min-h-11 px-3 border rounded-sm bg-white transition-colors cursor-text ${
                showSuggestions
                  ? "border-emerald-500 ring-2 ring-emerald-100"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
              onClick={() => {
                inputRef.current?.focus();
                setShowSuggestions(true);
              }}
            >
              {selectedLocalities.map((loc) => (
                <span
                  key={loc.id}
                  className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {loc.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLocality(loc.id);
                    }}
                    className="hover:text-emerald-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {selectedLocalities.length < 5 ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={localitySearch}
                  onChange={(e) => {
                    setLocalitySearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={
                    selectedLocalities.length === 0
                      ? "Search locality or landmark…"
                      : "Add more localities…"
                  }
                  className="flex-1 min-w-0 text-sm outline-none placeholder:text-gray-400 bg-transparent py-2"
                />
              ) : (
                <span className="text-xs text-amber-600 font-medium ml-1 py-2">
                  Max 5 localities
                </span>
              )}
            </div>

            {/* Suggestions dropdown — renders below, not clipped */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-60 overflow-y-auto">
                {loadingLocalities ? (
                  <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin inline-block" />
                    Loading localities…
                  </div>
                ) : visibleSuggestions.length > 0 ? (
                  visibleSuggestions.map((loc) => (
                    <button
                      key={loc.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addLocality(loc);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {loc.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400">
                    {localitySearch ? "No localities found" : "No more localities to show"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-none flex items-center gap-2 text-sm transition-colors shrink-0 shadow-sm"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

        {/* BHK filter row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 shrink-0">BHK:</span>
          {BHK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleBhk(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedBhk === opt.value
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
          {(selectedBhk || selectedLocalities.length > 0) && (
            <button
              onClick={() => {
                setSelectedBhk(null);
                setSelectedLocalities([]);
              }}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
