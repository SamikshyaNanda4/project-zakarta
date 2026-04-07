"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { PropertyPublic } from "@/api";
import { properties } from "@/api";
import { authClient } from "@/lib/auth-client";
import { PropertyCard } from "./property-card";
import { AuthModal } from "./auth-modal";
import { LucideHome } from "lucide-react";

type FilterParams = {
  listingType?: "sell" | "rent";
  area?: string;
  localityIds?: string;
  bhk?: string;
  homeType?: string;
  priceMin?: number;
  priceMax?: number;
  builtUpAreaMin?: number;
  builtUpAreaMax?: number;
  furnished?: string;
  parking?: string;
  propertyAge?: string;
  bathrooms?: number;
};

type Props = {
  initialProperties: PropertyPublic[];
  initialTotal: number;
  filters: FilterParams;
  pageSize?: number;
};

export function InfinitePropertyList({
  initialProperties,
  initialTotal,
  filters,
  pageSize = 20,
}: Props) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [items, setItems] = useState<PropertyPublic[]>(initialProperties);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [pendingContactPropertyId, setPendingContactPropertyId] = useState<string | null>(null);
  const [revealedContacts, setRevealedContacts] = useState<Record<string, string>>({});
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!session?.user;
  const hasMore = items.length < total;

  // Reset when filters change
  useEffect(() => {
    setItems(initialProperties);
    setTotal(initialTotal);
    setPage(1);
  }, [initialProperties, initialTotal]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await properties.list({ ...filters, page: nextPage, pageSize });
      setItems((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = data.properties.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
      setTotal(data.total);
      setPage(nextPage);
    } catch {
      toast.error("Failed to load more properties.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, filters, pageSize]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loading, hasMore]);

  function handleRequestAuth(propertyId: string) {
    setPendingContactPropertyId(propertyId);
  }

  async function handleAuthSuccess() {
    setPendingContactPropertyId(null);
    if (pendingContactPropertyId) {
      try {
        const data = await properties.getContact(pendingContactPropertyId);
        setRevealedContacts((prev) => ({
          ...prev,
          [pendingContactPropertyId]: data.contact,
        }));
      } catch {
        toast.error("Sorry, the contact is unavailable right now.");
      }
    }
    router.refresh();
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <span className="text-3xl"><LucideHome color="green"/></span>
        </div>
        <p className="text-lg font-semibold text-gray-700">No properties found</p>
        <p className="mt-1 text-sm text-gray-400">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isLoggedIn={isLoggedIn}
            onRequestAuth={handleRequestAuth}
            preRevealedContact={revealedContacts[property.id]}
          />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      )}

      {/* End indicator */}
      {!hasMore && items.length > 0 && (
        <p className="text-center py-8 text-sm text-gray-400">
          Showing all {total} {total === 1 ? "property" : "properties"}
        </p>
      )}

      <AuthModal
        isOpen={pendingContactPropertyId !== null}
        onClose={() => setPendingContactPropertyId(null)}
        onSuccess={handleAuthSuccess}
        defaultTab="sign-in"
      />
    </>
  );
}
