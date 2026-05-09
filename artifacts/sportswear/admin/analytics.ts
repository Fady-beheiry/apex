import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { eq, sql } from "drizzle-orm";
import { db, adminsTable, ordersTable, productsTable, orderItemsTable } from "../_db";

const JWT_SECRET = process.env.SESSION_SECRET ?? "apex-admin-secret-key-2024";

function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  try {
    jwt.verify(authHeader.slice(7), JWT_SECRET);
    return true;
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    if (!requireAdmin(req, res)) return;

    const [totalRevenue] = await db.select({ revenue: sql<number>`COALESCE(SUM(${ordersTable.total}), 0)` }).from(ordersTable);
    const [totalOrders] = await db.select({ count: sql<number>`COUNT(*)` }).from(ordersTable);
    const [totalProducts] = await db.select({ count: sql<number>`COUNT(*)` }).from(productsTable);
    const uniqueCustomers = await db.selectDistinct({ phone: ordersTable.phone }).from(ordersTable);
    const [pendingOrders] = await db.select({ count: sql<number>`COUNT(*)` }).from(ordersTable).where(eq(ordersTable.status, "pending"));
    const [deliveredOrders] = await db.select({ count: sql<number>`COUNT(*)` }).from(ordersTable).where(eq(ordersTable.status, "delivered"));

    const ordersByStatus = await db.select({
      status: ordersTable.status,
      count: sql<number>`COUNT(*)`,
    }).from(ordersTable).groupBy(ordersTable.status);

    const revenueByMonth = await db.select({
      month: sql<string>`TO_CHAR(${ordersTable.createdAt}, 'Mon YYYY')`,
      revenue: sql<number>`COALESCE(SUM(${ordersTable.total}), 0)`,
      orders: sql<number>`COUNT(*)`,
    }).from(ordersTable)
      .groupBy(sql`TO_CHAR(${ordersTable.createdAt}, 'Mon YYYY')`)
      .orderBy(sql`MIN(${ordersTable.createdAt})`);

    const topProducts = await db.select({
      productId: orderItemsTable.productId,
      productName: orderItemsTable.productName,
      totalSold: sql<number>`SUM(${orderItemsTable.quantity})`,
      revenue: sql<number>`SUM(${orderItemsTable.price} * ${orderItemsTable.quantity})`,
    }).from(orderItemsTable)
      .groupBy(orderItemsTable.productId, orderItemsTable.productName)
      .orderBy(sql`SUM(${orderItemsTable.quantity}) DESC`)
      .limit(5);

    return res.json({
      totalRevenue: Number(totalRevenue?.revenue ?? 0),
      totalOrders: Number(totalOrders?.count ?? 0),
      totalCustomers: uniqueCustomers.length,
      totalProducts: Number(totalProducts?.count ?? 0),
      pendingOrders: Number(pendingOrders?.count ?? 0),
      deliveredOrders: Number(deliveredOrders?.count ?? 0),
      revenueByMonth: revenueByMonth.map((r) => ({ month: r.month, revenue: Number(r.revenue), orders: Number(r.orders) })),
      ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: Number(o.count) })),
      topProducts: topProducts.map((p) => ({ productId: p.productId, productName: p.productName, totalSold: Number(p.totalSold), revenue: Number(p.revenue) })),
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
