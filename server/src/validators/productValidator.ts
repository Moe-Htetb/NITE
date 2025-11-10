import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be a positive number greater than 0"),

  body("instock_count")
    .notEmpty()
    .withMessage("Stock count is required")
    .isInt({ min: 0 })
    .withMessage("Stock count must be a non-negative integer"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("sizes")
    .notEmpty()
    .withMessage("At least one size is required")
    .isArray({ min: 1 })
    .withMessage("Sizes must be a non-empty array")
    .custom((sizes) => {
      if (
        !sizes.every((size: any) => typeof size === "string" && size.length > 0)
      ) {
        throw new Error("All sizes must be non-empty strings");
      }
      return true;
    }),

  body("colors")
    .notEmpty()
    .withMessage("At least one color is required")
    .isArray({ min: 1 })
    .withMessage("Colors must be a non-empty array")
    .custom((colors) => {
      if (
        !colors.every(
          (color: any) => typeof color === "string" && color.length > 0
        )
      ) {
        throw new Error("All colors must be non-empty strings");
      }
      return true;
    }),

  //   body("image")
  //     .notEmpty()
  //     .withMessage("At least one product image is required")
  //     .isArray({ min: 1 })
  //     .withMessage("Images must be a non-empty array")
  //     .custom((images) => {
  //       if (
  //         !images.every(
  //           (img: any) =>
  //             typeof img === "object" &&
  //             img.url &&
  //             typeof img.url === "string" &&
  //             img.public_alt &&
  //             typeof img.public_alt === "string"
  //         )
  //       ) {
  //         throw new Error(
  //           "Each image must have both URL and public_alt as strings"
  //         );
  //       }
  //       return true;
  //     }),

  body("is_new_arrival")
    .notEmpty()
    .withMessage("New arrival status is required")
    .isBoolean()
    .withMessage("New arrival status must be true or false"),

  body("is_feature")
    .notEmpty()
    .withMessage("Feature status is required")
    .isBoolean()
    .withMessage("Feature status must be true or false"),

  body("rating_count")
    .notEmpty()
    .withMessage("Rating count is required")
    .isFloat({ min: 0 })
    .withMessage("Rating count must be a number between 0 and 5"),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Price must be a positive number greater than 0"),

  body("instock_count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock count must be a non-negative integer"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("sizes")
    .optional()
    .isArray()
    .withMessage("Sizes must be an array")
    .custom((sizes) => {
      if (
        sizes &&
        !sizes.every((size: any) => typeof size === "string" && size.length > 0)
      ) {
        throw new Error("All sizes must be non-empty strings");
      }
      return true;
    }),

  body("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array")
    .custom((colors) => {
      if (
        colors &&
        !colors.every(
          (color: any) => typeof color === "string" && color.length > 0
        )
      ) {
        throw new Error("All colors must be non-empty strings");
      }
      return true;
    }),

  body("image")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images) => {
      if (
        images &&
        !images.every(
          (img: any) =>
            typeof img === "object" &&
            img.url &&
            typeof img.url === "string" &&
            img.public_alt &&
            typeof img.public_alt === "string"
        )
      ) {
        throw new Error(
          "Each image must have both URL and public_alt as strings"
        );
      }
      return true;
    }),

  body("is_new_arrival")
    .optional()
    .isBoolean()
    .withMessage("New arrival status must be true or false"),

  body("is_feature")
    .optional()
    .isBoolean()
    .withMessage("Feature status must be true or false"),

  body("rating_count")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating count must be a number between 0 and 5"),
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
