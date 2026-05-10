"use client";

import { Heart } from "lucide-react";
import { type JSX, useState } from "react";
import { cn } from "../lib/utils";

export interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  bhk: number;
  area: number; // in sq.ft
  locality: string;
  onWishlistToggle?: (id: string, isWishlisted: boolean) => void;
  className?: string;
  initialWishlisted?: boolean;
}

export function PropertyCard({
  id,
  image,
  title,
  price,
  bhk,
  area,
  locality,
  onWishlistToggle,
  className,
  initialWishlisted = false,
}: PropertyCardProps): JSX.Element {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

  const handleWishlistToggle = () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    onWishlistToggle?.(id, newState);
  };

  const formatPrice = (priceValue: number): string => {
    if (priceValue >= 10000000) {
      return `₹${(priceValue / 10000000).toFixed(1)}Cr`;
    }
    if (priceValue >= 100000) {
      return `₹${(priceValue / 100000).toFixed(1)}L`;
    }
    return `₹${priceValue.toLocaleString()}`;
  };

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-muted sm:h-56 lg:h-64">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={cn(
            "absolute right-3 top-3 flex items-center justify-center rounded-full p-2 backdrop-blur-sm transition-all duration-200",
            isWishlisted
              ? "bg-destructive/80 hover:bg-destructive"
              : "bg-black/30 hover:bg-black/50"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-200",
              isWishlisted
                ? "fill-destructive-foreground text-destructive-foreground"
                : "text-white"
            )}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 lg:p-6">
        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold text-foreground sm:text-base lg:text-lg">
          {title}
        </h3>

        {/* Price - Highlighted */}
        <div className="mt-3 mb-3">
          <p className="text-2xl font-bold text-primary sm:text-xl lg:text-2xl">
            {formatPrice(price)}
          </p>
        </div>

        {/* BHK and Area */}
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{bhk} BHK</span>
          <span>•</span>
          <span className="font-medium">{area.toLocaleString()} sq.ft</span>
        </div>

        {/* Locality */}
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {locality}
        </p>
      </div>
    </div>
  );
}
