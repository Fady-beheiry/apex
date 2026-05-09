import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq, sql } from "drizzle-orm";
import { db, productsTable, categoriesTable, reviewsTable } from "../_db";

async function enrichProduct(product: typeof productsTable.$inferSelect) {
  const cat = product.categoryId
    ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).then((r) => r[0])
    : null;
  const reviewStats = await db.select({
    avgRating: sql<number>`AVG(${reviewsTable.rating})`,
    count: sql<number>`COUNT(*)`,
  }).from(reviewsTable).where(eq(reviewsTable.productId, product.id));

  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice != null ? Number(product.comparePrice) : null,
    categoryName: cat?.name ?? null,
    averageRating: reviewStats[0]?.avgRating ? Number(Number(reviewStats[0].avgRating).toFixed(1)) : null,
    reviewCount: Number(reviewStats[0]?.count ?? 0),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const products = await db.select().from(productsTable).where(eq(productsTable.isBestSeller, true)).limit(8);
    return res.json(await Promise.all(products.map(enrichProduct)));
  }

  return res.status(405).json({ error: "Method not allowed" });
}
