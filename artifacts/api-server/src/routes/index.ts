import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import bannersRouter from "./banners";
import adminRouter from "./admin";
import storeRouter from "./store";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(ordersRouter);
router.use(bannersRouter);
router.use(adminRouter);
router.use(storeRouter);

export default router;
