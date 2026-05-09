import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, adminsTable } from "../_db";

const JWT_SECRET = process.env.SESSION_SECRET ?? "apex-admin-secret-key-2024";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { adminId: number };
      const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, payload.adminId));
      if (!admin) return res.status(401).json({ error: "Admin not found" });
      return res.json({ id: admin.id, email: admin.email, name: admin.name });
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
