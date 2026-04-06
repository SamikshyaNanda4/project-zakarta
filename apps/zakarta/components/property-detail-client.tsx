"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, BedDouble, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PropertyPublic } from "@/api";
import { properties } from "@/api";
import { authClient } from "@/lib/auth-client";
import { AuthModal } from "./auth-modal";

type Props = {
  property: PropertyPublic;
};

export function PropertyDetailClient({ property }: Props) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [contact, setContact] = useState<string | null>(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [contactError, setContactError] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isLoggedIn = !!session?.user;

  async function fetchContact() {
    setLoadingContact(true);
    setContactError("");
    try {
      const data = await properties.getContact(property.id);
      setContact(data.contact);
    } catch (err) {
      setContactError(
        err instanceof Error ? err.message : "Failed to fetch contact"
      );
    } finally {
      setLoadingContact(false);
    }
  }

  function handleGetContact() {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    if (!contact) fetchContact();
  }

  async function handleAuthSuccess() {
    setAuthModalOpen(false);
    // No redirect — we're already on the property page
    router.refresh();
    // Fetch contact right after auth
    await fetchContact();
  }

  return (
    <>
      {/* Back nav */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <article className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Title */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            Listed
          </span>
        </div>

        {/* Meta */}
        <dl className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-gray-400" />
            <dt className="sr-only">BHK</dt>
            <dd className="font-medium">{property.bhk} BHK</dd>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            <dt className="sr-only">Type</dt>
            <dd className="font-medium">Apartment</dd>
          </div>
        </dl>

        {/* Contact section */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Contact Owner
          </h2>

          {contact ? (
            <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3">
              <Phone className="h-5 w-5 shrink-0 text-green-600" />
              <span className="text-base font-semibold text-green-800">
                {contact}
              </span>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm text-gray-500">
                {isLoggedIn
                  ? "Click below to reveal the owner's contact number."
                  : "Sign in to view the contact details for this property."}
              </p>
              <button
                onClick={handleGetContact}
                disabled={loadingContact}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {loadingContact ? "Loading…" : "Get Contact"}
              </button>
              {contactError && (
                <p className="mt-2 text-sm text-red-500">{contactError}</p>
              )}
            </div>
          )}
        </div>
      </article>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultTab="sign-in"
      />
    </>
  );
}
