import { Router, type IRouter } from "express";
import { eq, ilike, and, sql } from "drizzle-orm";
import { db, productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
  ListProductReviewsParams,
  CreateProductReviewParams,
  CreateProductReviewBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

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

router.get("/products", async (req, res): Promise<void> => {
  const query = ListProductsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category, search, featured, bestSeller, newArrival, limit, offset } = query.data;

  let conditions: ReturnType<typeof eq>[] = [];

  if (featured === true) conditions.push(eq(productsTable.isFeatured, true));
  if (bestSeller === true) conditions.push(eq(productsTable.isBestSeller, true));
  if (newArrival === true) conditions.push(eq(productsTable.isNewArrival, true));

  let products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit ?? 100)
    .offset(offset ?? 0)
    .orderBy(productsTable.createdAt);

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }

  if (category) {
    const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category)).then((r) => r[0]);
    if (cat) {
      products = products.filter((p) => p.categoryId === cat.id);
    }
  }

  const enriched = await Promise.all(products.map(enrichProduct));
  res.json(enriched);
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).where(eq(productsTable.isFeatured, true)).limit(8);
  const enriched = await Promise.all(products.map(enrichProduct));
  res.json(enriched);
});

router.get("/products/best-sellers", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).where(eq(productsTable.isBestSeller, true)).limit(8);
  const enriched = await Promise.all(products.map(enrichProduct));
  res.json(enriched);
});

router.get("/products/new-arrivals", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).where(eq(productsTable.isNewArrival, true)).limit(8);
  const enriched = await Promise.all(products.map(enrichProduct));
  res.json(enriched);
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { images, sizes, colors, price, comparePrice, ...rest } = parsed.data;
  const [product] = await db
    .insert(productsTable)
    .values({
      ...rest,
      price: price.toString(),
      comparePrice: comparePrice != null ? comparePrice.toString() : null,
      images: images ?? [],
      sizes: sizes ?? [],
      colors: colors ?? [],
    })
    .returning();

  const enriched = await enrichProduct(product);
  res.status(201).json(enriched);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const enriched = await enrichProduct(product);
  res.json(enriched);
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { price, comparePrice, ...updateRest } = parsed.data;
  const [product] = await db
    .update(productsTable)
    .set({
      ...updateRest,
      ...(price !== undefined ? { price: price.toString() } : {}),
      ...(comparePrice !== undefined ? { comparePrice: comparePrice != null ? comparePrice.toString() : null } : {}),
    })
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const enriched = await enrichProduct(product);
  res.json(enriched);
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.delete(productsTable).where(eq(productsTable.id, params.data.id)).returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/products/:id/reviews", async (req, res): Promise<void> => {
  const params = ListProductReviewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, params.data.id))
    .orderBy(reviewsTable.createdAt);

  res.json(reviews);
});

router.post("/products/:id/reviews", async (req, res): Promise<void> => {
  const params = CreateProductReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateProductReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, productId: params.data.id })
    .returning();

  res.status(201).json(review);
});

export default router;
