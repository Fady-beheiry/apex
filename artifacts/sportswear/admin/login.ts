import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, adminsTable } from "../_db";

const JWT_SECRET = process.env.SESSION_SECRET ?? "apex-admin-secret-key-2024";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { email, password } = req.body;
    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.email, email));
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
