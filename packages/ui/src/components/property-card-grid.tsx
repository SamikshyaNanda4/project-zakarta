"use client";

import { type JSX } from "react";
import { cn } from "../lib/utils";
import { PropertyCard, type PropertyCardProps } from "./property-card";

interface PropertyCardGridProps {
  properties: PropertyCardProps[];
  onWishlistToggle?: (id: string, isWishlisted: boolean) => void;
  className?: string;
}

export function PropertyCardGrid({
  properties,
  onWishlistToggle,
  className,
}: PropertyCardGridProps): JSX.Element {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-5 lg:gap-6",
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4",
        className
      )}
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          {...property}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
}
