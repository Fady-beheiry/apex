import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq, sql } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, productsTable } from "./_db";

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `APEX-${ts}-${rand}`;
}

async function enrichOrder(order: typeof ordersTable.$inferSelect) {
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  return {
    ...order,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),
    items: items.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { status, search, limit, offset } = req.query;
    let orders = await db.select().from(ordersTable)
      .limit(limit ? Number(limit) : 100)
      .offset(offset ? Number(offset) : 0)
      .orderBy(ordersTable.createdAt);

    if (status) orders = orders.filter((o) => o.status === status);
    if (search) {
      const q = String(search).toLowerCase();
      orders = orders.filter((o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.fullName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }

    return res.json(await Promise.all(orders.map(enrichOrder)));
  }

  if (req.method === "POST") {
    const { items, shippingFee, ...rest } = req.body;
    const productIds = [...new Set(items.map((i: any) => i.productId))];
    const products = await db.select().from(productsTable).where(
      productIds.length === 1
        ? eq(productsTable.id, productIds[0] as string)
        : sql`${productsTable.id} = ANY(${productIds})`
    );

    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const itemsWithDetails = items.map((item: any) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const price = Number(product.price);
      subtotal += price * item.quantity;
      return { ...item, productName: product.name, productImage: product.imageUrl, price: price.toString() };
    });

    const total = subtotal + shippingFee;
    const [order] = await db.insert(ordersTable).values({
      ...rest,
      orderNumber: generateOrderNumber(),
      shippingFee: shippingFee.toString(),
      subtotal: subtotal.toString(),
      total: total.toString(),
    }).returning();

    await db.insert(orderItemsTable).values(itemsWithDetails.map((item: any) => ({ ...item, orderId: order.id })));
    return res.status(201).json(await enrichOrder(order));
  }

  return res.status(405).json({ error: "Method not allowed" });
}
