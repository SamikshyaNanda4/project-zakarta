"use client";

import { useState } from "react";
import { PropertyCardGrid } from "@repo/ui/components/property-card-grid";
import type { PropertyCardProps } from "@repo/ui/components/property-card";

// Sample properties for testing
const SAMPLE_PROPERTIES: PropertyCardProps[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1570129477492-45201ea5d3d9?w=500&h=300&fit=crop",
    title: "Luxury Modern Apartment in Bandra",
    price: 5500000,
    bhk: 3,
    area: 1200,
    locality: "Bandra, Mumbai",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
    title: "Contemporary Villa with Pool",
    price: 12000000,
    bhk: 4,
    area: 2500,
    locality: "Powai, Mumbai",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=300&fit=crop",
    title: "Cozy Studio Apartment Downtown",
    price: 2500000,
    bhk: 1,
    area: 500,
    locality: "Lower Parel, Mumbai",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1585399363565-0e96b3ff6b8b?w=500&h=300&fit=crop",
    title: "Spacious Family Home with Terrace",
    price: 8500000,
    bhk: 5,
    area: 2000,
    locality: "Juhu, Mumbai",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop",
    title: "Penthouse Suite with Ocean View",
    price: 15000000,
    bhk: 3,
    area: 1800,
    locality: "Fort, Mumbai",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1566228040560-7757143f2070?w=500&h=300&fit=crop",
    title: "Beachfront Property Premium",
    price: 25000000,
    bhk: 4,
    area: 3500,
    locality: "Versova, Mumbai",
  },
];

export default function PropertyCardTestPage() {
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  const handleWishlistToggle = (id: string, isWishlisted: boolean) => {
    const newWishlisted = new Set(wishlisted);
    if (isWishlisted) {
      newWishlisted.add(id);
    } else {
      newWishlisted.delete(id);
    }
    setWishlisted(newWishlisted);
    console.log(`Property ${id} wishlisted: ${isWishlisted}`);
  };

  const propertiesWithWishlist: PropertyCardProps[] = SAMPLE_PROPERTIES.map(
    (property) => ({
      ...property,
      initialWishlisted: wishlisted.has(property.id),
    })
  );

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            PropertyCard Component Test
          </h1>
          <p className="mt-2 text-muted-foreground">
            Responsive grid: 1 column (mobile) → 2 columns (tablet) → 3 columns
            (desktop) → 4 columns (large)
          </p>
        </div>

        {/* Wishlist Stats */}
        <div className="mb-8 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Wishlisted Properties: <span className="font-semibold text-foreground">{wishlisted.size}</span>
          </p>
          {wishlisted.size > 0 && (
            <p className="mt-2 text-sm text-foreground">
              IDs: {Array.from(wishlisted).join(", ")}
            </p>
          )}
        </div>

        {/* Property Grid */}
        <PropertyCardGrid
          properties={propertiesWithWishlist}
          onWishlistToggle={handleWishlistToggle}
        />

        {/* Testing Instructions */}
        <div className="mt-12 space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground">
            Testing Instructions
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              ✅ <strong>Mobile View:</strong> Resize to mobile width (&lt;
              640px) - Should show 1 column
            </li>
            <li>
              ✅ <strong>Tablet View:</strong> Resize to tablet width (640px -
              1024px) - Should show 2 columns
            </li>
            <li>
              ✅ <strong>Desktop View:</strong> Resize to desktop (1024px -
              1280px) - Should show 3 columns
            </li>
            <li>
              ✅ <strong>Large Desktop:</strong> Resize to large desktop (&gt;
              1280px) - Should show 4 columns
            </li>
            <li>
              ✅ <strong>Wishlist Toggle:</strong> Click heart button to
              toggle filled/outlined state
            </li>
            <li>
              ✅ <strong>Hover Effects:</strong> Desktop only - image zoom on
              hover, shadow elevation
            </li>
            <li>
              ✅ <strong>Price Formatting:</strong> Check that prices are
              formatted as ₹XCr or ₹XL
            </li>
            <li>
              ✅ <strong>Dark Mode:</strong> Test with light and dark mode
              toggle (if available)
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
