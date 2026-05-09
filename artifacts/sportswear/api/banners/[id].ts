import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, bannersTable } from "../_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = String(req.query.id);

  if (req.method === "PATCH") {
    const [banner] = await db.update(bannersTable).set(req.body).where(eq(bannersTable.id, id)).returning();
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    return res.json(banner);
  }

  if (req.method === "DELETE") {
    const [banner] = await db.delete(bannersTable).where(eq(bannersTable.id, id)).returning();
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
