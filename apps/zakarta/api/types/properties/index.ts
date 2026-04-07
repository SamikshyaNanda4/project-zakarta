export type PropertyListingType = "sell" | "rent";

export type PropertyPhoto = {
  url: string;
  order: number;
};

export type PropertyPublic = {
  id: string;
  title: string;
  listingType: PropertyListingType;
  localityId: string;
  localityName: string;
  area: string;
  bhk: string;
  userId: string;
  createdAt: string;
  featuredAt: string | null;
  expectedPrice: string | null;
  expectedRent: string | null;
  description: string | null;
  homeType: string | null;
  photos: PropertyPhoto[];
};

export type PropertyListResponse = {
  properties: PropertyPublic[];
  total: number;
};

export type ContactResponse = {
  contact: string;
};

// ── Sell body ─────────────────────────────────────────────────────────────────

export type SellAmenities = {
  gym: boolean;
  powerBackup: "full" | "partial" | "none";
  gatedSociety: boolean;
  clubHouse: boolean;
  lift: boolean;
  intercom: boolean;
  shoppingCenter: boolean;
  sewageTreatment: boolean;
  gasPipeline: boolean;
  swimmingPool: boolean;
  fireSafety: boolean;
  childrenPlayArea: boolean;
  park: boolean;
  visitorParking: boolean;
  internetServices: boolean;
};

export type RentAmenities = {
  lift: boolean;
  ac: boolean;
  intercom: boolean;
  childrenPlayArea: boolean;
  gasPipeline: boolean;
  rainwaterHarvesting: boolean;
  houseKeeping: boolean;
  visitorParking: boolean;
  internetServices: boolean;
  clubHouse: boolean;
  swimmingPool: boolean;
  fireSafety: boolean;
  shoppingCenter: boolean;
  park: boolean;
  sewageTreatment: boolean;
  powerBackup: boolean;
  washingMachine: boolean;
  laundry: boolean;
};

export type CreateSellPropertyBody = {
  listingType: "sell";
  title: string;
  contact: string;
  localityId: string;
  homeType: "apartment" | "independent_house" | "gated_community_villa" | "standalone_building";
  apartmentName?: string;
  bhk: "1RK" | "1" | "2" | "3" | "4" | "5+";
  ownershipType: "self" | "on_loan";
  builtUpArea: number;
  carpetArea: number;
  propertyAge: "<1yr" | "1-3 years" | "4-7 years" | "7-10 years" | "10 plus";
  facing?: string;
  floorType: string;
  floorNumber?: number;
  totalFloors: number;
  expectedPrice: number;
  availableFrom: string;
  maintenanceCost?: number;
  description?: string;
  kitchenType?: string;
  furnishedStatus?: string;
  parking?: string;
  bathrooms: number;
  kitchens: number;
  whoShows: string;
  currentStatus?: string;
  amenities: SellAmenities;
  khataCertificate?: string;
  allotmentLetter?: string;
  saleDeedCertificate?: string;
  paidPropertyTax?: string;
  occupancyCertificate?: string;
  availabilityPeriod?: string;
  availabilityStartTime?: string;
  availabilityEndTime?: string;
  photos?: Array<{ url: string; order: number }>;
};

export type CreateRentPropertyBody = {
  listingType: "rent";
  title: string;
  contact: string;
  localityId: string;
  homeType: "apartment" | "independent_house" | "gated_community_villa";
  bhk: "1RK" | "1" | "2" | "3" | "4" | "5+";
  floorNumber?: number;
  totalFloors: number;
  propertyAge: string;
  facing?: string;
  floorType: string;
  availableForLease: boolean;
  expectedRent: number;
  expectedDeposit: number;
  monthlyMaintenanceExtra: boolean;
  monthlyMaintenanceAmount?: number;
  availableFrom: string;
  preferredTenants: string[];
  furnished: string;
  parking?: string;
  description?: string;
  bathrooms: number;
  balcony: number;
  waterSupply?: string;
  petAllowed: boolean;
  gym: boolean;
  nonVegAllowed: boolean;
  gatedSecurity: boolean;
  whoShows: string;
  currentCondition: string;
  directionDescription?: string;
  amenities: RentAmenities;
  photos?: Array<{ url: string; order: number }>;
};

export type CreatePropertyBody = CreateSellPropertyBody | CreateRentPropertyBody;
