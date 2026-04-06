"use client";

import { useState, useEffect } from "react";
import { Phone, Building2, BedDouble } from "lucide-react";
import type { PropertyPublic } from "@/api";
import { properties } from "@/api";
import Link from "next/link";

type PropertyCardProps = {
  property: PropertyPublic;
  isLoggedIn: boolean;
  /** Called when the user requests contact but isn't logged in */
  onRequestAuth: (propertyId: string) => void;
  /** Contact already revealed by a parent (e.g. after auth modal success) */
  preRevealedContact?: string;
};

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

    if (contact) return; // already revealed

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

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-snug text-gray-900">
          <Link href={`/properties/${property.id}`} className="hover:underline">
            {property.name}
          </Link>
        </h3>
        <span className="shrink-0 rounded-full bg-emerald-100   px-2.5 py-0.5 text-xs font-medium text-white-700">
          Listed
        </span>
      </div>

      {/* Meta */}
      <dl className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <BedDouble className="h-4 w-4 text-gray-400" />
          <dt className="sr-only">BHK</dt>
          <dd>{property.bhk} BHK</dd>
        </div>
        <div className="flex items-center gap-1">
          <Building2 className="h-4 w-4 text-gray-400" />
          <dt className="sr-only">Type</dt>
          <dd>Apartment</dd>
        </div>
      </dl>

      {/* Contact reveal */}
      <div className="mt-auto">
        {contact ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-sm text-green-800">
            <Phone className="h-4 w-4 shrink-0 text-green-600" />
            <span className="font-medium">{contact}</span>
          </div>
        ) : (
          <>
            <button
              onClick={handleGetContact}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {loading ? "Loading…" : "Get Contact"}
            </button>
            {error && (
              <p className="mt-2 text-center text-xs text-red-500">{error}</p>
            )}
          </>
        )}
      </div>
    </article>
  );
}
