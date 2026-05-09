import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, productsTable } from "../_db";

async function enrichCategory(cat: typeof categoriesTable.$inferSelect) {
  const [result] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(productsTable)
    .where(eq(productsTable.categoryId, cat.id));
  return { ...cat, productCount: Number(result?.count ?? 0) };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = String(req.query.id);

  if (req.method === "PATCH") {
    const [cat] = await db.update(categoriesTable).set(req.body).where(eq(categoriesTable.id, id)).returning();
    if (!cat) return res.status(404).json({ error: "Category not found" });
    return res.json(await enrichCategory(cat));
  }

  if (req.method === "DELETE") {
    const [cat] = await db.delete(categoriesTable).where(eq(categoriesTable.id, id)).returning();
    if (!cat) return res.status(404).json({ error: "Category not found" });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
