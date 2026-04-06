import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { property } from "@/db/schema";
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

function generateId(): string {
  return `prop_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export function PropertyRoutes(app: OpenAPIHono) {
  // GET /properties — public list (no contact)
  app.openapi(listPropertiesRoute, async (c) => {
    const rows = await db.query.property.findMany({
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });

    const properties = rows.map((p) => ({
      id: p.id,
      name: p.name,
      listingType: (p.listingType ?? "sell") as "sell" | "rent",
      bhk: p.bhk,
      city: p.city ?? "",
      price: p.price ?? null,
      description: p.description ?? null,
      userId: p.userId,
      createdAt: p.createdAt.toISOString(),
    }));

    return c.json({ properties, total: properties.length }, 200);
  });

  // GET /properties/:id — public detail (no contact)
  app.openapi(getPropertyRoute, async (c) => {
    const { id } = c.req.valid("param");
    const row = await db.query.property.findFirst({
      where: eq(property.id, id),
    });

    if (!row) {
      return c.json({ error: "Property not found" }, 404);
    }

    return c.json(
      {
        id: row.id,
        name: row.name,
        listingType: (row.listingType ?? "sell") as "sell" | "rent",
        bhk: row.bhk,
        city: row.city ?? "",
        price: row.price ?? null,
        description: row.description ?? null,
        userId: row.userId,
        createdAt: row.createdAt.toISOString(),
      },
      200
    );
  });

  // POST /properties — protected: auth + allowedToPost
  const protectedApp = new OpenAPIHono<AppVariables>();
  protectedApp.use(requireAuth);
  protectedApp.use(requireAllowedToPost);

  protectedApp.openapi(createPropertyRoute, async (c) => {
    const user = c.get("user") as typeof auth.$Infer.Session.user;
    const { name, listingType, bhk, city, contact, price, description } = c.req.valid("json");

    const newProperty = {
      id: generateId(),
      name,
      listingType,
      bhk,
      city,
      price: price ?? null,
      description: description ?? null,
      contact,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(property).values(newProperty);

    return c.json(
      {
        id: newProperty.id,
        name: newProperty.name,
        listingType: newProperty.listingType as "sell" | "rent",
        bhk: newProperty.bhk,
        city: newProperty.city,
        price: newProperty.price,
        description: newProperty.description,
        userId: newProperty.userId,
        createdAt: newProperty.createdAt.toISOString(),
      },
      201
    );
  });

  app.route("/", protectedApp);

  // POST /properties/:id/contact — protected: auth only (not allowedToPost)
  const contactApp = new OpenAPIHono<AppVariables>();
  contactApp.use(requireAuth);

  contactApp.openapi(getContactRoute, async (c) => {
    const { id } = c.req.valid("param");

    const row = await db.query.property.findFirst({
      where: eq(property.id, id),
    });

    if (!row) {
      return c.json({ error: "Property not found" }, 404);
    }

    // Future: log contact reveal for rate limiting / analytics
    return c.json({ contact: row.contact }, 200);
  });

  app.route("/", contactApp);
}
