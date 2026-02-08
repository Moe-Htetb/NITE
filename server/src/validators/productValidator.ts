import { body, param } from "express-validator";
import mongoose from "mongoose";
import { Product } from "../models/product.model";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Product name cannot exceed 200 characters")
    .custom(async (value) => {
      const existingProduct = await Product.findOne({ name: value });
      if (existingProduct) {
        throw new Error("Product with this name already exists");
      }
      return true;
    }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number"),

  body("instock_count")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= 0;
    })
    .withMessage("In-stock count must be a valid non-negative integer"),

  body("rating_count")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0 && num <= 5;
    })
    .withMessage("Rating must be between 0 and 5"),

  body("is_feature")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      return ["true", "false", "1", "0", true, false].includes(value);
    })
    .withMessage("is_feature must be a boolean value (true/false/1/0)"),

  body("is_new_arrival")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      return ["true", "false", "1", "0", true, false].includes(value);
    })
    .withMessage("is_new_arrival must be a boolean value (true/false/1/0)"),

  body("sizes")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      try {
        const sizes = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(sizes)) return false;
        // Validate each size is a non-empty string
        const validSizes = sizes.every(
          (size) => typeof size === "string" && size.trim() !== "",
        );
        if (!validSizes) return false;
        // Convert to uppercase and remove duplicates
        const uniqueSizes = [
          ...new Set(sizes.map((s: string) => s.toUpperCase().trim())),
        ];
        return uniqueSizes.length > 0;
      } catch {
        return false;
      }
    })
    .withMessage("Sizes must be a valid non-empty array of strings"),

  body("colors")
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      try {
        const colors = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(colors)) return false;
        // Validate each color is a non-empty string
        const validColors = colors.every(
          (color) => typeof color === "string" && color.trim() !== "",
        );
        if (!validColors) return false;
        // Remove duplicates
        const uniqueColors = [...new Set(colors.map((c: string) => c.trim()))];
        return uniqueColors.length > 0;
      } catch {
        return false;
      }
    })
    .withMessage("Colors must be a valid non-empty array of strings"),

  body("images").custom((value, { req }) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new Error("At least one image is required");
    }

    // Validate file types
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];
    const invalidFiles = files.filter(
      (file) => !allowedMimeTypes.includes(file.mimetype),
    );

    if (invalidFiles.length > 0) {
      throw new Error(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`,
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      throw new Error(`File size too large. Maximum size is 5MB`);
    }

    return true;
  }),
];

export const validateUpdateProduct = [
  param("id").isMongoId().withMessage("Invalid product ID"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Product name cannot exceed 200 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number"),

  body("instock_count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("In-stock count must be a valid non-negative integer"),

  body("rating_count")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  body("is_feature")
    .optional()
    .isBoolean()
    .withMessage("is_feature must be a boolean value"),

  body("is_new_arrival")
    .optional()
    .isBoolean()
    .withMessage("is_new_arrival must be a boolean value"),

  body("sizes")
    .optional()
    .custom((value) => {
      try {
        const sizes = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(sizes)) return false;
        return sizes.every(
          (size) => typeof size === "string" && size.trim() !== "",
        );
      } catch {
        return false;
      }
    })
    .withMessage("Sizes must be a valid array of strings"),

  body("colors")
    .optional()
    .custom((value) => {
      try {
        const colors = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(colors)) return false;
        return colors.every(
          (color) => typeof color === "string" && color.trim() !== "",
        );
      } catch {
        return false;
      }
    })
    .withMessage("Colors must be a valid array of strings"),

  body("existingImages")
    .optional()
    .custom((value) => {
      try {
        const images = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(images)) return false;

        // Validate each image object
        return images.every((img) => {
          return (
            img &&
            typeof img === "object" &&
            typeof img.url === "string" &&
            typeof img.public_alt === "string"
          );
        });
      } catch {
        return false;
      }
    })
    .withMessage("existingImages must be a valid array of image objects"),
];

export const deleteProductValidator = [
  param("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid product ID format");
      }
      return true;
    }),
];

export const getProductByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid product ID format");
      }
      return true;
    }),
];
