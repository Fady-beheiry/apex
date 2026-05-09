import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, productsTable } from "./_db";

async function enrichCategory(cat: typeof categoriesTable.$inferSelect) {
  const [result] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(productsTable)
    .where(eq(productsTable.categoryId, cat.id));
  return { ...cat, productCount: Number(result?.count ?? 0) };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
    const enriched = await Promise.all(categories.map(enrichCategory));
    return res.json(enriched);
  }

  if (req.method === "POST") {
    const [cat] = await db.insert(categoriesTable).values(req.body).returning();
    return res.status(201).json(await enrichCategory(cat));
  }

  return res.status(405).json({ error: "Method not allowed" });
}
