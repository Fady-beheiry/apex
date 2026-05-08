import { Router, type IRouter } from "express";
import { eq, ilike, sql } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  TrackOrderParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

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
    items: items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
}

router.get("/orders", async (req, res): Promise<void> => {
  const query = ListOrdersQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { status, search, limit, offset } = query.data;

  let orders = await db
    .select()
    .from(ordersTable)
    .limit(limit ?? 100)
    .offset(offset ?? 0)
    .orderBy(ordersTable.createdAt);

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.fullName.toLowerCase().includes(q) ||
        o.phone.includes(q),
    );
  }

  const enriched = await Promise.all(orders.map(enrichOrder));
  res.json(enriched);
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { items, shippingFee, ...rest } = parsed.data;

  // Fetch product prices
  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await db.select().from(productsTable).where(
    productIds.length === 1
      ? eq(productsTable.id, productIds[0])
      : sql`${productsTable.id} = ANY(${productIds})`,
  );

  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const itemsWithDetails = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    const price = Number(product.price);
    subtotal += price * item.quantity;
    return {
      ...item,
      productName: product.name,
      productImage: product.imageUrl,
      price: price.toString(),
    };
  });

  const total = subtotal + shippingFee;
  const orderNumber = generateOrderNumber();

  const [order] = await db
    .insert(ordersTable)
    .values({
      ...rest,
      orderNumber,
      shippingFee: shippingFee.toString(),
      subtotal: subtotal.toString(),
      total: total.toString(),
    })
    .returning();

  await db.insert(orderItemsTable).values(
    itemsWithDetails.map((item) => ({
      ...item,
      orderId: order.id,
    })),
  );

  const enriched = await enrichOrder(order);
  res.status(201).json(enriched);
});

router.get("/orders/track/:orderNumber", async (req, res): Promise<void> => {
  const params = TrackOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.orderNumber, params.data.orderNumber));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const enriched = await enrichOrder(order);
  res.json(enriched);
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const enriched = await enrichOrder(order);
  res.json(enriched);
});

router.patch("/orders/:id/status", async (req, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const enriched = await enrichOrder(order);
  res.json(enriched);
});

export default router;
