"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PropertyPublic } from "@/lib/api";
import { propertiesApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { PropertyCard } from "./property-card";
import { AuthModal } from "./auth-modal";

type Props = {
  initialProperties: PropertyPublic[];
};

export function PropertiesListClient({ initialProperties }: Props) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // Which property triggered the auth modal
  const [pendingContactPropertyId, setPendingContactPropertyId] = useState<
    string | null
  >(null);

  // Contacts revealed per property (keyed by id)
  const [revealedContacts, setRevealedContacts] = useState<
    Record<string, string>
  >({});

  const isLoggedIn = !!session?.user;

  function handleRequestAuth(propertyId: string) {
    setPendingContactPropertyId(propertyId);
  }

  async function handleAuthSuccess() {
    setPendingContactPropertyId(null);

    if (pendingContactPropertyId) {
      // Auto-fetch contact for the property that triggered auth
      try {
        const data = await propertiesApi.getContact(pendingContactPropertyId);
        setRevealedContacts((prev) => ({
          ...prev,
          [pendingContactPropertyId]: data.contact,
        }));
      } catch {
        // Silently fail — user can click again
      }
    }

    // Refresh to pick up new session state
    router.refresh();
  }

  return (
    <>
      {initialProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-gray-500">
            No properties listed yet.
          </p>
          <p className="mt-1 text-sm text-gray-400">Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isLoggedIn={isLoggedIn}
              onRequestAuth={handleRequestAuth}
              // Pass pre-revealed contact from this component's state
              preRevealedContact={revealedContacts[property.id]}
            />
          ))}
        </div>
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
