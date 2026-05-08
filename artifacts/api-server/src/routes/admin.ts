import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, sql } from "drizzle-orm";
import { db, adminsTable, ordersTable, productsTable, orderItemsTable } from "@workspace/db";
import { AdminLoginBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "apex-admin-secret-key-2024";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId: number };
    (req as Request & { adminId: number }).adminId = payload.adminId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.email, email));

  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name },
  });
});

router.get("/admin/me", requireAdmin, async (req, res): Promise<void> => {
  const adminId = (req as Request & { adminId: number }).adminId;
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, adminId));

  if (!admin) {
    res.status(401).json({ error: "Admin not found" });
    return;
  }

  res.json({ id: admin.id, email: admin.email, name: admin.name });
});

router.post("/admin/logout", async (_req, res): Promise<void> => {
  res.json({ success: true });
});

router.get("/admin/analytics", requireAdmin, async (_req, res): Promise<void> => {
  const [totalRevenue] = await db
    .select({ revenue: sql<number>`COALESCE(SUM(${ordersTable.total}), 0)` })
    .from(ordersTable);

  const [totalOrders] = await db.select({ count: sql<number>`COUNT(*)` }).from(ordersTable);
  const [totalProducts] = await db.select({ count: sql<number>`COUNT(*)` }).from(productsTable);

  const uniqueCustomers = await db
    .selectDistinct({ phone: ordersTable.phone })
    .from(ordersTable);

  const [pendingOrders] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));

  const [deliveredOrders] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "delivered"));

  const ordersByStatus = await db
    .select({
      status: ordersTable.status,
      count: sql<number>`COUNT(*)`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  const revenueByMonth = await db
    .select({
      month: sql<string>`TO_CHAR(${ordersTable.createdAt}, 'Mon YYYY')`,
      revenue: sql<number>`COALESCE(SUM(${ordersTable.total}), 0)`,
      orders: sql<number>`COUNT(*)`,
    })
    .from(ordersTable)
    .groupBy(sql`TO_CHAR(${ordersTable.createdAt}, 'Mon YYYY')`)
    .orderBy(sql`MIN(${ordersTable.createdAt})`);

  const topProducts = await db
    .select({
      productId: orderItemsTable.productId,
      productName: orderItemsTable.productName,
      totalSold: sql<number>`SUM(${orderItemsTable.quantity})`,
      revenue: sql<number>`SUM(${orderItemsTable.price} * ${orderItemsTable.quantity})`,
    })
    .from(orderItemsTable)
    .groupBy(orderItemsTable.productId, orderItemsTable.productName)
    .orderBy(sql`SUM(${orderItemsTable.quantity}) DESC`)
    .limit(5);

  res.json({
    totalRevenue: Number(totalRevenue?.revenue ?? 0),
    totalOrders: Number(totalOrders?.count ?? 0),
    totalCustomers: uniqueCustomers.length,
    totalProducts: Number(totalProducts?.count ?? 0),
    pendingOrders: Number(pendingOrders?.count ?? 0),
    deliveredOrders: Number(deliveredOrders?.count ?? 0),
    revenueByMonth: revenueByMonth.map((r) => ({
      month: r.month,
      revenue: Number(r.revenue),
      orders: Number(r.orders),
    })),
    ordersByStatus: ordersByStatus.map((o) => ({
      status: o.status,
      count: Number(o.count),
    })),
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      productName: p.productName,
      totalSold: Number(p.totalSold),
      revenue: Number(p.revenue),
    })),
  });
});

export default router;
