import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, bannersTable } from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const banners = await db.select().from(bannersTable).where(eq(bannersTable.isActive, true)).orderBy(bannersTable.sortOrder);
    return res.json(banners);
  }

  if (req.method === "POST") {
    const [banner] = await db.insert(bannersTable).values({
      ...req.body,
      isActive: req.body.isActive ?? true,
      sortOrder: req.body.sortOrder ?? 0,
    }).returning();
    return res.status(201).json(banner);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
