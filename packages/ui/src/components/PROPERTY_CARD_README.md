# PropertyCard Component

A responsive, feature-rich real estate property card component built with React, TypeScript, and Tailwind CSS.

## Features

### Display Elements
- **Cover Image**: High-quality property image with hover zoom effect
- **Title**: Property name with text truncation (2 lines max)
- **Price**: Highlighted in primary color, auto-formatted (Cr/L)
- **BHK & Area**: "X BHK • Y sq.ft" format
- **Locality**: Location/address text
- **Wishlist Button**: Toggle-able heart icon with smooth animations

### Responsive Layout
- **Mobile (xs)**: 1 column grid
- **Tablet (sm)**: 2 column grid  
- **Desktop (lg)**: 3 column grid
- **Large Desktop (xl)**: 4 column grid

### Design Features
- Clean, modern card design with subtle shadows
- Smooth transitions and hover effects
- Image hover zoom (1.05x scale)
- Shadow elevation on hover
- Wishlist button with backdrop blur
- Proper color hierarchy with semantic colors
- Accessibility features (ARIA labels, proper button semantics)

## Components

### PropertyCard
Main reusable component for individual property display.

**Props:**
```typescript
interface PropertyCardProps {
  id: string;
  image: string;                    // Image URL
  title: string;                    // Property name
  price: number;                    // Price in rupees
  bhk: number;                      // Number of bedrooms
  area: number;                     // Area in sq.ft
  locality: string;                 // Location text
  onWishlistToggle?: (id, isWishlisted) => void;
  className?: string;               // Additional CSS classes
  initialWishlisted?: boolean;      // Initial wishlist state
}
```

### PropertyCardGrid
Container component for displaying multiple cards in responsive grid.

**Props:**
```typescript
interface PropertyCardGridProps {
  properties: PropertyCardProps[];   // Array of properties
  onWishlistToggle?: (id, isWishlisted) => void;
  className?: string;               // Additional CSS classes
}
```

## Usage

### Basic Single Card
```tsx
import { PropertyCard } from "@repo/ui/components/property-card";

<PropertyCard
  id="1"
  image="https://example.com/image.jpg"
  title="Modern Apartment"
  price={5500000}
  bhk={3}
  area={1200}
  locality="Bandra, Mumbai"
  onWishlistToggle={(id, isWishlisted) => 
    console.log(`Property ${id} wishlisted: ${isWishlisted}`)
  }
/>
```

### Property Listing Grid
```tsx
import { PropertyCardGrid } from "@repo/ui/components/property-card-grid";

const properties = [
  {
    id: "1",
    image: "https://example.com/image1.jpg",
    title: "Luxury Apartment",
    price: 5500000,
    bhk: 3,
    area: 1200,
    locality: "Bandra, Mumbai",
  },
  // ... more properties
];

<PropertyCardGrid
  properties={properties}
  onWishlistToggle={(id, isWishlisted) => {
    // Handle wishlist state
  }}
/>
```

## Styling Details

### Breakpoints & Grid
```
Mobile (xs):     grid-cols-1
Tablet (sm):     grid-cols-2  (gap-5)
Desktop (lg):    grid-cols-3  (gap-6)
Large (xl):      grid-cols-4  (gap-6)
```

### Color Usage
- **Image Background**: Muted color during load
- **Title Text**: Foreground color (semi-bold)
- **Price**: Primary color (bold, emphasized)
- **BHK/Area/Locality**: Muted-foreground color
- **Wishlist Active**: Destructive color (red)
- **Wishlist Inactive**: Black with transparency

### Spacing
- **Card Padding**: 
  - Mobile: 1rem (16px)
  - Tablet: 1.25rem (20px)
  - Desktop: 1.5rem (24px)
- **Content Gaps**: 0.75rem between elements
- **Grid Gaps**: 1rem-1.5rem responsive

### Typography
- **Title**: Text-lg semi-bold → line-clamp-2
- **Price**: Text-2xl bold
- **BHK/Area**: Text-sm medium
- **Locality**: Text-sm regular → line-clamp-1

## Hover Effects (Desktop)

1. **Image Zoom**: Scale 1 → 1.05 (300ms)
2. **Shadow Elevation**: Shadow-sm → shadow-md (300ms)
3. **Wishlist Button**: Background color transitions
4. **Smooth Transitions**: All animations use 300ms duration

## Accessibility

- Proper semantic HTML (`<button>`, `<h3>`)
- ARIA labels on wishlist button
- Proper focus states through Tailwind
- Image alt text from title
- Color contrast ratios meet WCAG standards

## Integration Example

```tsx
"use client";

import { useState } from "react";
import { PropertyCardGrid } from "@repo/ui/components/property-card-grid";

export function PropertyListingPage() {
  const [wishlists, setWishlists] = useState<Set<string>>(new Set());

  const handleWishlistToggle = (id: string, isWishlisted: boolean) => {
    const updated = new Set(wishlists);
    if (isWishlisted) {
      updated.add(id);
    } else {
      updated.delete(id);
    }
    setWishlists(updated);
    
    // Call your API to save wishlist
    saveToWishlist(id, isWishlisted);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      <PropertyCardGrid
        properties={properties}
        onWishlistToggle={handleWishlistToggle}
      />
    </div>
  );
}
```

## Price Formatting

The component automatically formats prices:
- ₹100,000 → ₹1L
- ₹10,000,000 → ₹1Cr
- ₹2,500,000 → ₹2.5Cr
- Regular numbers shown with thousand separators

## Customization

### Add Custom Styling
```tsx
<PropertyCard
  {...props}
  className="ring-2 ring-primary"  // Add custom classes
/>
```

### Change Grid Columns
```tsx
<PropertyCardGrid
  properties={properties}
  className="lg:grid-cols-2 xl:grid-cols-3"  // Override defaults
/>
```

## Dependencies

- React 19.2+
- Lucide React (for Heart icon)
- Tailwind CSS 3+
- TypeScript 5.9+

## Notes

- All price values should be in rupees (₹)
- Area should be provided in square feet (sq.ft)
- Image URLs should be accessible and properly sized
- Component uses client-side state for wishlist toggle
- For production, integrate with your backend API for persistence
