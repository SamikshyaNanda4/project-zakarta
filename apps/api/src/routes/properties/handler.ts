import { OpenAPIHono } from "@hono/zod-openapi";
import { eq, isNotNull, inArray, and } from "drizzle-orm";
import { db } from "@/db/db";
import {
  property,
  propertySell,
  propertyRent,
  sellAmenity,
  rentAmenity,
  propertyPhoto,
  locality,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { requireAuth, requireAllowedToPost } from "@/middleware/require-auth";
import {
  listPropertiesRoute,
  getPropertyRoute,
  createPropertyRoute,
  getContactRoute,
} from "./route";

type AppVariables = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

function buildPublicProperty(
  
  row: typeof property.$inferSelect,
  loc: { name: string; area: string },
  sellRow: typeof propertySell.$inferSelect | null,
  rentRow: typeof propertyRent.$inferSelect | null,
  photos: Array<{ url: string; order: number }>,
  amenities: Array<typeof sellAmenity.$inferSelect | typeof rentAmenity.$inferSelect> = []
) {
  return {
    id: row.id,
    title: row.title,
    listingType: row.listingType as "sell" | "rent",
    localityId: row.localityId,
    localityName: loc.name,
    area: loc.area,
    bhk: sellRow?.bhk ?? rentRow?.bhk ?? "",
    userId: row.userId,
    createdAt: row.createdAt.toISOString(),
    featuredAt: row.featuredAt ? row.featuredAt.toISOString() : null,
    expectedPrice: sellRow?.expectedPrice ?? null,
    expectedRent: rentRow?.expectedRent ?? null,
    description: sellRow?.description ?? rentRow?.description ?? null,
    homeType: sellRow?.homeType ?? rentRow?.homeType ?? null,
    photos,
    amenities:
  amenities
    ?.filter((a) => {
      if (typeof a.value === "boolean") return a.value === true;  // rent
      return a.value === "yes";                                    // sell
    })
    .map((a) => a.name) ?? [],
  };
}

export function PropertyRoutes(app: OpenAPIHono) {
  // ── GET /properties ──────────────────────────────────────────────────────────
  app.openapi(listPropertiesRoute, async (c) => {
    const {
      listingType,
      area,
      localityId,
      localityIds,
      bhk,
      homeType,
      priceMin,
      priceMax,
      builtUpAreaMin,
      builtUpAreaMax,
      furnished,
      parking,
      propertyAge,
      bathrooms,
      featured,
      page = 1,
      pageSize = 20,
    } = c.req.valid("query");

    //  DB-level where conditions
    const conditions = [];
    if (listingType) conditions.push(eq(property.listingType, listingType));
    if (featured === "true") conditions.push(isNotNull(property.featuredAt));

    // Locality filtering: localityIds (comma-sepzarated, up to 5)
    if (localityIds) {
      const ids = localityIds
        .split(",")
        .slice(0, 5)
        .map((s) => s.trim())
        .filter(Boolean);
      if (ids.length > 0) conditions.push(inArray(property.localityId, ids));
    } else if (localityId) {
      conditions.push(eq(property.localityId, localityId));
    }

    const rows = await db.query.property.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (p, { desc }) => [desc(p.createdAt)],
     with: {
  locality: true,

  sellDetails: {
    with: {
      amenities: true   
    }
  },
  

  rentDetails: {
  with: {
    amenities: true
  }
},
  photos: true,
},
    });

    // In-memory filters for fields on sell/rent detail tables
    let filtered = rows;
    if (area) filtered = filtered.filter((r) => r.locality.area === area);
    if (bhk)
      filtered = filtered.filter(
        (r) => (r.sellDetails?.bhk ?? r.rentDetails?.bhk) === bhk
      );
    if (homeType)
      filtered = filtered.filter(
        (r) => (r.sellDetails?.homeType ?? r.rentDetails?.homeType) === homeType
      );
    if (furnished)
      filtered = filtered.filter(
        (r) =>
          (r.sellDetails?.furnishedStatus ?? r.rentDetails?.furnished) ===
          furnished
      );
    if (parking)
      filtered = filtered.filter(
        (r) => (r.sellDetails?.parking ?? r.rentDetails?.parking) === parking
      );
    if (propertyAge)
      filtered = filtered.filter(
        (r) =>
          (r.sellDetails?.propertyAge ?? r.rentDetails?.propertyAge) ===
          propertyAge
      );
    if (bathrooms)
      filtered = filtered.filter(
        (r) =>
          (r.sellDetails?.bathrooms ?? r.rentDetails?.bathrooms) === bathrooms
      );
    if (priceMin != null) {
      filtered = filtered.filter((r) => {
        const price =
          r.sellDetails?.expectedPrice ?? r.rentDetails?.expectedRent;
        return price != null && parseFloat(price) >= priceMin!;
      });
    }
    if (priceMax != null) {
      filtered = filtered.filter((r) => {
        const price =
          r.sellDetails?.expectedPrice ?? r.rentDetails?.expectedRent;
        return price != null && parseFloat(price) <= priceMax!;
      });
    }
    if (builtUpAreaMin != null) {
      filtered = filtered.filter(
        (r) =>
          r.sellDetails != null && r.sellDetails.builtUpArea >= builtUpAreaMin!
      );
    }
    if (builtUpAreaMax != null) {
      filtered = filtered.filter(
        (r) =>
          r.sellDetails != null && r.sellDetails.builtUpArea <= builtUpAreaMax!
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const properties = paginated.map((r) =>
      buildPublicProperty(
        r,
        { name: r.locality.name, area: r.locality.area },
        r.sellDetails ?? null,
        r.rentDetails ?? null,
        r.photos.map((p) => ({ url: p.url, order: p.order })),
        [
  ...(r.sellDetails?.amenities ?? []),
  ...(r.rentDetails?.amenities ?? []),
]
        
      )
    );

    return c.json({ properties, total }, 200);
  });

  // ── GET /properties/:id ──────────────────────────────────────────────────────
  app.openapi(getPropertyRoute, async (c) => {
    const { id } = c.req.valid("param");

   const row = await db.query.property.findFirst({
  where: eq(property.id, id),
  with: {
    locality: true,

    photos: true,

    sellDetails: {
      with: {
        amenities: true
      }
    },

    rentDetails: {
      with: {
        amenities: true   // 👈 ADD THIS (IMPORTANT)
      }
    },
  },
});

    if (!row) return c.json({ error: "Property not found" }, 404);

    return c.json(
  buildPublicProperty(
    row,
    { name: row.locality.name, area: row.locality.area },
    row.sellDetails ?? null,
    row.rentDetails ?? null,
    row.photos.map((p) => ({ url: p.url, order: p.order })),
    [
      ...(row.sellDetails?.amenities ?? []),
      ...(row.rentDetails?.amenities ?? []),
    ]
  ),
  200
);
  });

  // ── POST /properties (protected) ─────────────────────────────────────────────
  const protectedApp = new OpenAPIHono<AppVariables>();
  protectedApp.use("/properties", requireAuth);
  protectedApp.use("/properties", requireAllowedToPost);

  protectedApp.openapi(createPropertyRoute, async (c) => {
    const authUser = c.get("user") as typeof auth.$Infer.Session.user;
    const body = c.req.valid("json");

    // Verify locality exists
    const localityRow = await db.query.locality.findFirst({
      where: eq(locality.id, body.localityId),
    });
    if (!localityRow) return c.json({ error: "Locality not found" }, 422);

    const propertyId = generateId("prop");

    // Insert base property
    const newProperty = {
      id: propertyId,
      userId: authUser.id,
      localityId: body.localityId,
      listingType: body.listingType as "sell" | "rent",
      title: body.title,
      contact: body.contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.insert(property).values(newProperty);

    let sellRow: typeof propertySell.$inferSelect | null = null;
    let rentRow: typeof propertyRent.$inferSelect | null = null;

    if (body.listingType === "sell") {
      const sellId = generateId("sell");
      const insertSell: typeof propertySell.$inferInsert = {
        id: sellId,
        propertyId,
        homeType: body.homeType,
        apartmentName: body.apartmentName ?? null,
        bhk: body.bhk,
        ownershipType: body.ownershipType,
        builtUpArea: body.builtUpArea,
        carpetArea: body.carpetArea,
        propertyAge: body.propertyAge,
        facing: body.facing ?? null,
        floorType: body.floorType,
        floorNumber: body.floorNumber ?? null,
        totalFloors: body.totalFloors,
        expectedPrice: String(body.expectedPrice),
        availableFrom: body.availableFrom,
        maintenanceCost: body.maintenanceCost
          ? String(body.maintenanceCost)
          : null,
        description: body.description ?? null,
        kitchenType: body.kitchenType ?? null,
        furnishedStatus: body.furnishedStatus ?? null,
        parking: body.parking ?? null,
        bathrooms: body.bathrooms,
        kitchens: body.kitchens,
        whoShows: body.whoShows,
        currentStatus: body.currentStatus ?? null,
        khataCertificate: body.khataCertificate ?? null,
        allotmentLetter: body.allotmentLetter ?? null,
        saleDeedCertificate: body.saleDeedCertificate ?? null,
        paidPropertyTax: body.paidPropertyTax ?? null,
        occupancyCertificate: body.occupancyCertificate ?? null,
        availabilityPeriod: body.availabilityPeriod ?? null,
        availabilityStartTime: body.availabilityStartTime ?? null,
        availabilityEndTime: body.availabilityEndTime ?? null,
      };
      const [inserted] = await db
        .insert(propertySell)
        .values(insertSell)
        .returning();
      sellRow = inserted!;

      // Insert sell amenities
      const { amenities } = body;
      const amenityRows: Array<typeof sellAmenity.$inferInsert> = [
        {
          propertySellId: sellId,
          name: "gym",
          value: amenities.gym ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "powerBackup",
          value: amenities.powerBackup,
        },
        {
          propertySellId: sellId,
          name: "gatedSociety",
          value: amenities.gatedSociety ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "clubHouse",
          value: amenities.clubHouse ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "lift",
          value: amenities.lift ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "intercom",
          value: amenities.intercom ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "shoppingCenter",
          value: amenities.shoppingCenter ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "sewageTreatment",
          value: amenities.sewageTreatment ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "gasPipeline",
          value: amenities.gasPipeline ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "swimmingPool",
          value: amenities.swimmingPool ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "fireSafety",
          value: amenities.fireSafety ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "childrenPlayArea",
          value: amenities.childrenPlayArea ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "park",
          value: amenities.park ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "visitorParking",
          value: amenities.visitorParking ? "yes" : "no",
        },
        {
          propertySellId: sellId,
          name: "internetServices",
          value: amenities.internetServices ? "yes" : "no",
        },
      ];
      await db.insert(sellAmenity).values(amenityRows);
    } else {
      const rentId = generateId("rent");
      const insertRent: typeof propertyRent.$inferInsert = {
        id: rentId,
        propertyId,
        homeType: body.homeType,
        bhk: body.bhk,
        floorNumber: body.floorNumber ?? null,
        totalFloors: body.totalFloors,
        propertyAge: body.propertyAge,
        facing: body.facing ?? null,
        floorType: body.floorType,
        availableForLease: body.availableForLease,
        expectedRent: String(body.expectedRent),
        expectedDeposit: String(body.expectedDeposit),
        monthlyMaintenanceExtra: body.monthlyMaintenanceExtra,
        monthlyMaintenanceAmount: body.monthlyMaintenanceAmount
          ? String(body.monthlyMaintenanceAmount)
          : null,
        availableFrom: body.availableFrom,
        preferredTenants: body.preferredTenants.join(","),
        furnished: body.furnished,
        parking: body.parking ?? null,
        description: body.description ?? null,
        bathrooms: body.bathrooms,
        balcony: body.balcony,
        waterSupply: body.waterSupply ?? null,
        petAllowed: body.petAllowed,
        gym: body.gym,
        nonVegAllowed: body.nonVegAllowed,
        gatedSecurity: body.gatedSecurity,
        whoShows: body.whoShows,
        currentCondition: body.currentCondition,
        directionDescription: body.directionDescription ?? null,
      };
      const [inserted] = await db
        .insert(propertyRent)
        .values(insertRent)
        .returning();
      rentRow = inserted!;

      // Insert rent amenities
      const { amenities } = body;
      const amenityRows: Array<typeof rentAmenity.$inferInsert> =
        Object.entries(amenities).map(([name, value]) => ({
          propertyRentId: rentId,
          name,
          value: value as boolean,
        }));
      await db.insert(rentAmenity).values(amenityRows);
    }

    // Insert photos if provided
    if (body.photos?.length) {
      const photoRows = body.photos.map((p) => ({
        id: generateId("photo"),
        propertyId,
        url: p.url,
        order: p.order,
        createdAt: new Date(),
      }));
      await db.insert(propertyPhoto).values(photoRows);
    }

    return c.json(
      buildPublicProperty(
        { ...newProperty, featuredAt: null, updatedAt: new Date() },
        { name: localityRow.name, area: localityRow.area },
        sellRow,
        rentRow,
        (body.photos ?? []).map((p) => ({ url: p.url, order: p.order })),
        []
      ),
      201
    );
  });

  app.route("/", protectedApp);

  // ── POST /properties/:id/contact (auth required) ─────────────────────────────
  const contactApp = new OpenAPIHono<AppVariables>();
  contactApp.use("/properties/:id/contact", requireAuth);

  contactApp.openapi(getContactRoute, async (c) => {
    const { id } = c.req.valid("param");

    const row = await db.query.property.findFirst({
      where: eq(property.id, id),
    });

    if (!row) return c.json({ error: "Property not found" }, 404);

    return c.json({ contact: row.contact }, 200);
  });

  app.route("/", contactApp);
}
