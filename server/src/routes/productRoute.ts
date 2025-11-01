import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductController,
  updateProductController,
} from "../controllers/product.controller";
import { isAdmin, protect } from "../middlewares/authMiddleware";

const productRouter = Router();

productRouter.post(
  "/product/create",
  protect,
  isAdmin,
  createProductController
);

productRouter.get("/products", getAllProductController);
productRouter.get("/product/:id", getSingleProductController);

productRouter.put(
  "/product/update/:id",
  protect,
  isAdmin,
  updateProductController
);
productRouter.delete(
  "/product/delete/:id",
  protect,
  isAdmin,
  deleteProductController
);
export default productRouter;
