import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as adminsSchema from "../../lib/db/src/schema/admins";
import * as bannersSchema from "../../lib/db/src/schema/banners";
import * as categoriesSchema from "../../lib/db/src/schema/categories";
import * as ordersSchema from "../../lib/db/src/schema/orders";
import * as productsSchema from "../../lib/db/src/schema/products";
import * as reviewsSchema from "../../lib/db/src/schema/reviews";

const schema = {
  ...adminsSchema,
  ...bannersSchema,
  ...categoriesSchema,
  ...ordersSchema,
  ...productsSchema,
  ...reviewsSchema,
};

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "../../lib/db/src/schema/admins";
export * from "../../lib/db/src/schema/banners";
export * from "../../lib/db/src/schema/categories";
export * from "../../lib/db/src/schema/orders";
export * from "../../lib/db/src/schema/products";
export * from "../../lib/db/src/schema/reviews";
