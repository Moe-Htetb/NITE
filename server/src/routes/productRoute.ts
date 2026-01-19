import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getFeaturedProductController,
  getMetaProductController,
  getNewProductController,
  getProductsWithFilter,
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
import { upload } from "../utils/upload";

const productRouter = Router();

// Create product
productRouter.post(
  "/product/create",
  protect,
  isAdmin,
  // createProductValidator,
  // validateRequest,
  upload.array("images", 10),
  createProductController,
);

// Get all products (with filters)
productRouter.get("/products", getProductsWithFilter);

// Static routes - MUST come before dynamic routes
productRouter.get("/product/feature", getFeaturedProductController);
productRouter.get("/product/new", getNewProductController);
productRouter.get("/product/meta", getMetaProductController); // This now comes before :id

// Dynamic routes - come after all static routes
productRouter.get("/product/:id", getSingleProductController);

// Update and delete
productRouter.put(
  "/product/update/:id",
  protect,
  isAdmin,
  // updateProductValidator,
  // validateRequest,
  upload.array("images"),

  updateProductController,
);
productRouter.delete(
  "/product/delete/:id",
  protect,
  isAdmin,
  deleteProductValidator,
  validateRequest,
  deleteProductController,
);

export default productRouter;
