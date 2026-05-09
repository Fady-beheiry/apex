import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq, and, sql } from "drizzle-orm";
import { db, productsTable, categoriesTable, reviewsTable } from "./_db";

async function enrichProduct(product: typeof productsTable.$inferSelect) {
  const cat = product.categoryId
    ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).then((r) => r[0])
    : null;
  const reviewStats = await db
    .select({
      avgRating: sql<number>`AVG(${reviewsTable.rating})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, product.id));

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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { category, search, featured, bestSeller, newArrival, limit, offset } = req.query;

    let conditions: any[] = [];
    if (featured === "true") conditions.push(eq(productsTable.isFeatured, true));
    if (bestSeller === "true") conditions.push(eq(productsTable.isBestSeller, true));
    if (newArrival === "true") conditions.push(eq(productsTable.isNewArrival, true));

    let products = await db
      .select()
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit ? Number(limit) : 100)
      .offset(offset ? Number(offset) : 0)
      .orderBy(productsTable.createdAt);

    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (category) {
      const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, String(category))).then((r) => r[0]);
      if (cat) products = products.filter((p) => p.categoryId === cat.id);
    }

    const enriched = await Promise.all(products.map(enrichProduct));
    return res.json(enriched);
  }

  if (req.method === "POST") {
    const { images, sizes, colors, price, comparePrice, ...rest } = req.body;
    const [product] = await db
      .insert(productsTable)
      .values({
        ...rest,
        price: String(price),
        comparePrice: comparePrice != null ? String(comparePrice) : null,
        images: images ?? [],
        sizes: sizes ?? [],
        colors: colors ?? [],
      })
      .returning();
    const enriched = await enrichProduct(product);
    return res.status(201).json(enriched);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
