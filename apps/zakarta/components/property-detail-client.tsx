"use client";
const amenityConfig: Record<string, { label: string; icon: string }> = {
  gym: { label: "Gym", icon: "/icons/gym.svg" },
  lift: { label: "Lift", icon: "/icons/lift.svg" },
  shoppingCenter: { label: "Shopping Center", icon: "/icons/shoppingcenter.svg" },

  powerBackup: { label: "Power Backup", icon: "/icons/power.svg" }, // ⚠️ NOTE: file missing (see below)

  gatedSociety: { label: "Gated Society", icon: "/icons/gated.svg" },
  clubHouse: { label: "Club House", icon: "/icons/club.svg" },
  intercom: { label: "Intercom", icon: "/icons/intercom.svg" },

  sewageTreatment: { label: "Sewage Treatment", icon: "/icons/sewage.svg" },
  gasPipeline: { label: "Gas Pipeline", icon: "/icons/gas.svg" },
  swimmingPool: { label: "Swimming Pool", icon: "/icons/pool.svg" },
  fireSafety: { label: "Fire Safety", icon: "/icons/fire.svg" },

  childrenPlayArea: { label: "Play Area", icon: "/icons/playarea.svg" },
  park: { label: "Park", icon: "/icons/park.svg" },

  visitorParking: { label: "Visitor Parking", icon: "/icons/parking.svg" },
  internetServices: { label: "Internet Services", icon: "/icons/internet.svg" },

  // EXTRA icons (jo tumhare folder me hai but use nahi ho rahe the)
  ac: { label: "Air Conditioning", icon: "/icons/ac.svg" },
  garden: { label: "Garden", icon: "/icons/garden.svg" },
  houseKeeping: { label: "Housekeeping", icon: "/icons/housekeeping.svg" },
  laundry: { label: "Laundry", icon: "/icons/laundry.svg" },
  meat: { label: "Non-Veg Allowed", icon: "/icons/meat.svg" },
  pet: { label: "Pet Friendly", icon: "/icons/pet.svg" },
  rainwaterHarvesting: { label: "Rainwater Harvesting", icon: "/icons/rainwater.svg" },
  washingMachine: { label: "Washing Machine", icon: "/icons/washingmachine.svg" },
};




import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  BedDouble,
  Building2,
  ArrowLeft,
  MapPin,
  IndianRupee,
  CalendarDays,
  ImageOff,
} from "lucide-react";
import Link from "next/link";
import type { PropertyPublic } from "@/api";
import { properties } from "@/api";
import { authClient } from "@/lib/auth-client";
import { AuthModal } from "./auth-modal";

type Props = {
  property: PropertyPublic;
};

function formatPrice(value: string | null, listingType: "sell" | "rent"): string {
  if (!value) return "Price on request";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (listingType === "sell") {
    if (num >= 100) return `₹${(num / 100).toFixed(2)} Cr`;
    return `₹${num.toFixed(2)} Lakhs`;
  }
  return `₹${num.toLocaleString("en-IN")} / month`;
}

function homeTypeLabel(type: string | null): string {
  if (!type) return "";
  const map: Record<string, string> = {
    apartment: "Apartment",
    independent_house: "Independent House / Villa",
    gated_community_villa: "Gated Community Villa",
    standalone_building: "Standalone Building",
  };
  return map[type] ?? type;
}

function DetailPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
      <span className="text-gray-400">{icon}</span>
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

export function PropertyDetailClient({ property }: Props) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [contact, setContact] = useState<string | null>(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [contactError, setContactError] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isLoggedIn = !!session?.user;
  const isSell = property.listingType === "sell";

  async function fetchContact() {
    setLoadingContact(true);
    setContactError("");
    try {
      const data = await properties.getContact(property.id);
      setContact(data.contact);
    } catch (err) {
      setContactError(err instanceof Error ? err.message : "Failed to fetch contact");
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
    router.refresh();
    await fetchContact();
  }

  const price = isSell ? property.expectedPrice : property.expectedRent;
  const sortedPhotos = [...(property.photos ?? [])].sort((a, b) => a.order - b.order);

  return (
    <>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <article className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Photo gallery */}
        {sortedPhotos.length > 0 ? (
          <div className="grid gap-1 grid-cols-2 sm:grid-cols-3 h-64 overflow-hidden">
            {sortedPhotos.slice(0, 6).map((photo, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={photo.url}
                alt={`${property.title} photo ${i + 1}`}
                className={`h-full w-full object-cover ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-gray-100">
            <ImageOff className="h-12 w-12 text-gray-300" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span
                className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isSell ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {isSell ? "For Sale" : "For Rent"}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-gray-400" />
                {property.localityName}, {property.area}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-500">{isSell ? "Expected Price" : "Monthly Rent"}</p>
              <p className="text-2xl font-bold text-indigo-600">
                {formatPrice(price, property.listingType)}
              </p>
            </div>
          </div>

          {/* Key details */}
          <div className="mb-6 flex flex-wrap gap-2">
            <DetailPill
              icon={<BedDouble className="h-4 w-4" />}
              label="BHK"
              value={property.bhk === "1RK" ? "1 RK" : `${property.bhk} BHK`}
            />
            {property.homeType && (
              <DetailPill
                icon={<Building2 className="h-4 w-4" />}
                label="Type"
                value={homeTypeLabel(property.homeType)}
              />
            )}
            <DetailPill
              icon={<IndianRupee className="h-4 w-4" />}
              label="Listing"
              value={isSell ? "For Sale" : "For Rent"}
            />
            <DetailPill
              icon={<CalendarDays className="h-4 w-4" />}
              label="Listed"
              value={new Date(property.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
          </div>

{/* Description */}
{property.description && (
  <div className="mb-6">

    {/* Header + Share button */}
    <div className="mb-2 flex items-center gap-2">

      <button
        className="text-xs text-indigo-600 hover:underline"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: property.title,
              url: window.location.href,
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
          }
        }}
      >
        🔗 Share
      </button>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        Description
      </h2>

    </div>

    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
      {property.description}
    </p>
  </div>
)}


{/* Amenities */}
{property.amenities && property.amenities.length > 0 && (
  <div className="mb-6">
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
      Amenities
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {property.amenities.map((amenity) => {
        const config = amenityConfig[amenity];

        return (
          <div
            key={amenity}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 transition"
          >
            {config?.icon && (
              <img
                src={config.icon}
                alt={config.label}
                className="h-4 w-4 object-contain"
              />
            )}
            <span className="text-xs font-medium text-gray-700">
              {config?.label ?? amenity}
            </span>
          </div>
        );
      })}
    </div>
  </div>
)}



          {/* Contact section */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Contact Owner
            </h2>
            {contact ? (
              <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3">
                <Phone className="h-5 w-5 shrink-0 text-green-600" />
                <span className="text-base font-semibold text-green-800">{contact}</span>
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
                  {loadingContact ? "Loading…" : "Get Owner Contact"}
                </button>
                {contactError && (
                  <p className="mt-2 text-sm text-red-500">{contactError}</p>
                )}
              </div>
            )}
          </div>
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
