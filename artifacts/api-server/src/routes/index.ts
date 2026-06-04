import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import productsRouter from "./products";
import addressesRouter from "./addresses";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import adminRouter from "./admin";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use("/", healthRouter);
router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/addresses", addressesRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/admin", adminRouter);
router.use("/payments", paymentsRouter);

export default router;
