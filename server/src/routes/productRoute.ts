import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getFeaturedProductController,
  getNewProductController,
  getSingleProductController,
  updateProductController,
} from "../controllers/product.controller";
import { isAdmin, protect } from "../middlewares/authMiddleware";
import {
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} from "../validators/productValidator";
import { validateRequest } from "../middlewares/validateRequest";

const productRouter = Router();

productRouter.post(
  "/product/create",
  protect,
  isAdmin,
  createProductValidator,
  validateRequest,
  createProductController
);

productRouter.get("/products", getAllProductController);
productRouter.get("/product/:id", getSingleProductController);

productRouter.put(
  "/product/update/:id",
  protect,
  isAdmin,
  updateProductValidator,
  validateRequest,
  updateProductController
);
productRouter.delete(
  "/product/delete/:id",
  protect,
  isAdmin,
  deleteProductValidator,
  validateRequest,
  deleteProductController
);
productRouter.get("/product/feature", getFeaturedProductController);
productRouter.get("/product/new", getNewProductController);

export default productRouter;
