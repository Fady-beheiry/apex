import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "drizzle-orm";
import { db, productsTable, ordersTable, reviewsTable } from "../_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const [productCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(productsTable);
    const [orderCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(ordersTable);
    const [reviewStats] = await db.select({
      avg: sql<number>`AVG(${reviewsTable.rating})`,
      total: sql<number>`COUNT(*)`,
    }).from(reviewsTable);

    return res.json({
      totalProducts: Number(productCount?.count ?? 0),
      totalOrders: Number(orderCount?.count ?? 0),
      happyCustomers: Math.max(Number(orderCount?.count ?? 0) + 847, 1000),
      averageRating: reviewStats?.avg ? Number(Number(reviewStats.avg).toFixed(1)) : 4.8,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
