"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Building2,
  BedDouble,
  MapPin,
  IndianRupee,
  ImageOff,
} from "lucide-react";
import type { PropertyPublic } from "@/api";
import { properties } from "@/api";
import Link from "next/link";

type PropertyCardProps = {
  property: PropertyPublic;
  isLoggedIn: boolean;
  onRequestAuth: (propertyId: string) => void;
  preRevealedContact?: string;
};

function formatPrice(value: string | null, listingType: "sell" | "rent"): string {
  if (!value) return "Price on request";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (listingType === "sell") {
    if (num >= 100) return `₹${(num / 100).toFixed(2)} Cr`;
    return `₹${num.toFixed(2)} L`;
  }
  return `₹${num.toLocaleString("en-IN")}/mo`;
}

function homeTypeLabel(type: string | null): string {
  if (!type) return "Property";
  const map: Record<string, string> = {
    apartment: "Apartment",
    independent_house: "Independent House",
    gated_community_villa: "Gated Community",
    standalone_building: "Standalone Building",
  };
  return map[type] ?? type;
}

export function PropertyCard({
  property,
  isLoggedIn,
  onRequestAuth,
  preRevealedContact,
}: PropertyCardProps) {
  const [contact, setContact] = useState<string | null>(preRevealedContact ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preRevealedContact) setContact(preRevealedContact);
  }, [preRevealedContact]);

  async function handleGetContact() {
    if (!isLoggedIn) {
      onRequestAuth(property.id);
      return;
    }
    if (contact) return;
    setLoading(true);
    setError("");
    try {
      const data = await properties.getContact(property.id);
      setContact(data.contact);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact");
    } finally {
      setLoading(false);
    }
  }

  const isSell = property.listingType === "sell";
  const coverPhoto = property.photos?.[0]?.url ?? null;
  const price = isSell ? property.expectedPrice : property.expectedRent;

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Cover photo */}
      <div className="relative h-44 w-full bg-gray-100 shrink-0">
        {coverPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPhoto}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-10 w-10 text-gray-300" />
          </div>
        )}
        {/* Listing type badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isSell
              ? "bg-indigo-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {isSell ? "For Sale" : "For Rent"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="mb-1 text-sm font-semibold leading-snug text-gray-900 line-clamp-2">
          <Link href={`/properties/${property.id}`} className="hover:underline">
            {property.title}
          </Link>
        </h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          {property.localityName}, {property.area}
        </div>

        {/* Tags */}
        <dl className="mb-3 flex flex-wrap gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1">
            <BedDouble className="h-3.5 w-3.5 text-gray-400" />
            <dt className="sr-only">BHK</dt>
            <dd>{property.bhk === "1RK" ? "1 RK" : `${property.bhk} BHK`}</dd>
          </div>
          {property.homeType && (
            <div className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1">
              <Building2 className="h-3.5 w-3.5 text-gray-400" />
              <dt className="sr-only">Type</dt>
              <dd>{homeTypeLabel(property.homeType)}</dd>
            </div>
          )}
        </dl>

        {/* Price */}
        <div className="mb-4 flex items-center gap-1.5 text-base font-bold text-gray-900">
          <IndianRupee className="h-4 w-4 text-indigo-500" />
          {formatPrice(price, property.listingType)}
        </div>

        {/* Contact */}
        <div className="mt-auto">
          {contact ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-sm text-green-800">
              <Phone className="h-4 w-4 shrink-0 text-green-600" />
              <span className="font-semibold">{contact}</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleGetContact}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {loading ? "Loading…" : "Get Owner Contact"}
              </button>
              {error && (
                <p className="mt-2 text-center text-xs text-red-500">{error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
