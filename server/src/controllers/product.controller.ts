import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { Product } from "../models/product.model";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      name,
      description,
      price,
      instock_count,
      category,
      sizes,
      colors,
      images,
      is_new_arrival,
      is_feature,
      rating_count,
    } = req.body;

    if (!name) throw new Error("Name is required");

    if (!description) throw new Error("Description is required");

    if (!price) throw new Error("Price is required");

    if (!instock_count) throw new Error("Instock_count is required");

    if (!category) throw new Error("Category is required");

    if (!sizes) throw new Error("Sizes is required");

    if (!colors) throw new Error("Colors is required");

    if (!images) throw new Error("Images is required");

    if (!rating_count) throw new Error("Rating_count is required");

    const product = await Product.create({
      name,
      description,
      price,
      instock_count,
      category,
      sizes,
      colors,
      images,
      is_new_arrival,
      is_feature,
      rating_count,
      userId: req.user?._id,
    });

    if (product) {
      res.status(201).json({
        message: `${product.name} created successfully`,
        product,
      });
    }
  }
);
