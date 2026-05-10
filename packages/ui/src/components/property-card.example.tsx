/**
 * PropertyCard Component - Example Usage
 *
 * This example demonstrates how to use the PropertyCard and PropertyCardGrid components
 * to build a responsive real estate property listing page.
 */

"use client";

import { useState } from "react";
import { PropertyCard } from "./property-card";
import { PropertyCardGrid } from "./property-card-grid";
import type { PropertyCardProps } from "./property-card";

// Sample data for demonstration
const SAMPLE_PROPERTIES: PropertyCardProps[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1570129477492-45201ea5d3d9?w=500&h=300&fit=crop",
    title: "Luxury Modern Apartment",
    price: 5500000,
    bhk: 3,
    area: 1200,
    locality: "Bandra, Mumbai",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
    title: "Contemporary Villa",
    price: 12000000,
    bhk: 4,
    area: 2500,
    locality: "Powai, Mumbai",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=300&fit=crop",
    title: "Cozy Studio Apartment",
    price: 2500000,
    bhk: 1,
    area: 500,
    locality: "Lower Parel, Mumbai",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1585399363565-0e96b3ff6b8b?w=500&h=300&fit=crop",
    title: "Spacious Family Home",
    price: 8500000,
    bhk: 5,
    area: 2000,
    locality: "Juhu, Mumbai",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop",
    title: "Penthouse Suite",
    price: 15000000,
    bhk: 3,
    area: 1800,
    locality: "Fort, Mumbai",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1566228040560-7757143f2070?w=500&h=300&fit=crop",
    title: "Beachfront Property",
    price: 25000000,
    bhk: 4,
    area: 3500,
    locality: "Versova, Mumbai",
  },
];

export function PropertyCardDemo() {
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  const handleWishlistToggle = (id: string, isWishlisted: boolean) => {
    const newWishlisted = new Set(wishlisted);
    if (isWishlisted) {
      newWishlisted.add(id);
    } else {
      newWishlisted.delete(id);
    }
    setWishlisted(newWishlisted);
  };

  const propertiesWithWishlist: PropertyCardProps[] = SAMPLE_PROPERTIES.map((property) => ({
    ...property,
    initialWishlisted: wishlisted.has(property.id),
  }));

  return (
    <div className="space-y-8 py-8">
      {/* Single Card Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Single Property Card</h2>
        <div className="max-w-sm">
          {propertiesWithWishlist[0] && (
            <PropertyCard
              id={propertiesWithWishlist[0].id}
              image={propertiesWithWishlist[0].image}
              title={propertiesWithWishlist[0].title}
              price={propertiesWithWishlist[0].price}
              bhk={propertiesWithWishlist[0].bhk}
              area={propertiesWithWishlist[0].area}
              locality={propertiesWithWishlist[0].locality}
              initialWishlisted={propertiesWithWishlist[0].initialWishlisted}
              onWishlistToggle={handleWishlistToggle}
            />
          )}
        </div>
      </section>

      {/* Grid Example - Responsive Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Property Listing Grid</h2>
        <p className="text-muted-foreground">
          Responsive layout: 1 column on mobile, 2 columns on tablet, 3-4 columns
          on desktop
        </p>
        <PropertyCardGrid
          properties={propertiesWithWishlist}
          onWishlistToggle={handleWishlistToggle}
        />
      </section>
    </div>
  );
}

/**
 * USAGE GUIDE:
 *
 * 1. Individual Card:
 *    import { PropertyCard } from "@repo/ui/components/property-card";
 *
 *    <PropertyCard
 *      id="1"
 *      image="/property-image.jpg"
 *      title="Modern Apartment"
 *      price={5500000}
 *      bhk={3}
 *      area={1200}
 *      locality="Bandra, Mumbai"
 *      onWishlistToggle={(id, isWishlisted) => console.log(id, isWishlisted)}
 *      initialWishlisted={false}
 *    />
 *
 * 2. Grid Layout:
 *    import { PropertyCardGrid } from "@repo/ui/components/property-card-grid";
 *
 *    const properties = [
 *      {
 *        id: "1",
 *        image: "/property-image.jpg",
 *        title: "Modern Apartment",
 *        price: 5500000,
 *        bhk: 3,
 *        area: 1200,
 *        locality: "Bandra, Mumbai",
 *      },
 *      // ... more properties
 *    ];
 *
 *    <PropertyCardGrid
 *      properties={properties}
 *      onWishlistToggle={(id, isWishlisted) => console.log(id, isWishlisted)}
 *    />
 *
 * PROPS BREAKDOWN:
 *
 * PropertyCard:
 * - id: Unique identifier for the property
 * - image: URL to the cover image
 * - title: Property name/title
 * - price: Price in rupees (automatically formatted: Cr/L)
 * - bhk: Number of bedrooms
 * - area: Area in square feet
 * - locality: Location/address text
 * - onWishlistToggle: Callback when heart button is clicked
 * - initialWishlisted: Set initial wishlist state
 * - className: Additional CSS classes for customization
 *
 * PropertyCardGrid:
 * - properties: Array of PropertyCardProps
 * - onWishlistToggle: Wishlist callback
 * - className: Additional grid classes
 *
 * RESPONSIVE BREAKPOINTS:
 * - Mobile (xs): 1 column
 * - Tablet (sm): 2 columns
 * - Desktop (lg): 3 columns
 * - Large Desktop (xl): 4 columns
 *
 * STYLING:
 * - Uses Tailwind CSS with the project's theme variables
 * - Supports dark mode via the theme system
 * - Hover effects: Image zoom + shadow increase
 * - Wishlist button: Filled state on dark destructive background
 * - Clean typography with proper hierarchy
 * - Balanced padding and spacing
 */
