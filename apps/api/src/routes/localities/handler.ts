import { OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { locality } from "@/db/schema";
import { listLocalitiesRoute } from "./route";

export function LocalityRoutes(app: OpenAPIHono) {
  app.openapi(listLocalitiesRoute, async (c) => {
    const { area } = c.req.valid("query");

    const rows = await db.query.locality.findMany({
      where: eq(locality.area, area as "Bhubaneswar" | "Cuttack" | "Puri"),
      orderBy: (l, { asc }) => [asc(l.name)],
    });

    const localities = rows.map((r) => ({
      id: r.id,
      area: r.area,
      name: r.name,
      lat: r.lat ?? null,
      lng: r.lng ?? null,
      perSqftRate: r.perSqftRate ?? null,
    }));

    return c.json({ localities, total: localities.length }, 200);
  });
}
