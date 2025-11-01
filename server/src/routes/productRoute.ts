import { Router } from "express";
import { createProductController } from "../controllers/product.controller";
import { isAdmin, protect } from "../middlewares/authMiddleware";

const productRouter = Router();

productRouter.post(
  "/product/create",
  protect,
  isAdmin,
  createProductController
);
export default productRouter;
