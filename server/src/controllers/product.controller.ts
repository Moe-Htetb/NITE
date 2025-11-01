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
    // const existingProduct = await Product.findOne({
    //   name,
    //   category,
    // });

    // if (existingProduct) {
    //   throw new Error("Product with this name already exists in this category");
    // }

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
    if (!product) throw new Error("Product not created");

    if (product) {
      res.status(201).json({
        message: `${product.name} created successfully`,
        product,
      });
    }
  }
);
export const getAllProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const products = await Product.find({});
    res.status(200).json({ products });
  }
);
export const getSingleProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ product });
  }
);

export const updateProductController = asyncHandler(
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

    const { id } = req.params;
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      res.status(404);
      throw new Error("No product found with is id.");
    }

    existingProduct.name = name || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.price = price || existingProduct.price;
    existingProduct.instock_count =
      instock_count || existingProduct.instock_count;
    existingProduct.category = category || existingProduct.category;
    existingProduct.sizes = sizes || existingProduct.sizes;
    existingProduct.colors = colors || existingProduct.colors;
    existingProduct.images = images || existingProduct.images;
    existingProduct.is_new_arrival =
      is_new_arrival || existingProduct.is_new_arrival;
    existingProduct.is_feature = is_feature || existingProduct.is_feature;
    existingProduct.rating_count = rating_count || existingProduct.rating_count;

    const updatedProduct = await existingProduct.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  }
);

export const deleteProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      res.status(404);
      throw new Error("No product found with is id.");
    }

    await existingProduct.deleteOne();
    res.status(404).json({ message: "Product destory!" });
  }
);
