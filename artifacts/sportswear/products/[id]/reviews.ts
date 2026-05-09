import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, reviewsTable } from "../../_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = String(req.query.id);

  if (req.method === "GET") {
    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.productId, id)).orderBy(reviewsTable.createdAt);
    return res.json(reviews);
  }

  if (req.method === "POST") {
    const [review] = await db.insert(reviewsTable).values({ ...req.body, productId: id }).returning();
    return res.status(201).json(review);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
