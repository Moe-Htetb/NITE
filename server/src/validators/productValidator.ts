import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createProductValidator = [
  body("name").notEmpty().isString().withMessage("Name is required"),
  body("description")
    .notEmpty()
    .isString()
    .withMessage("description is required"),
  body("price").notEmpty().isNumeric().withMessage("price is required"),
  body("instock_count")
    .isInt()
    .isString()
    .withMessage("instock_count is required"),
  body("category").notEmpty().isString().withMessage("category is required"),
  body("sizes").notEmpty().isArray({ min: 1 }).withMessage("sizes is required"),
  body("colors")
    .notEmpty()
    .isArray({ min: 1 })
    .withMessage("colors is required"),
  body("images").isArray({ min: 1 }).withMessage("Images must be array."),
  body("images.*.file").notEmpty().withMessage("Each image must have file."),
  body("images.*.preview")
    .notEmpty()
    .withMessage("Each image must have preview."),
  body("is_new_arrival")
    .isBoolean()
    .withMessage("is_new_arrival must be boolean."),
  body("is_new_arrival")
    .notEmpty()
    .isBoolean()
    .withMessage("is_new_arrival is required"),
  body("is_feature")
    .notEmpty()
    .isBoolean()
    .withMessage("is_feature is required"),
  body("rating_count")
    .notEmpty()
    .isInt()
    .withMessage("rating_count is required"),
];

export const updateProductValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("instock_count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock count must be a non-negative integer"),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("sizes")
    .optional()
    .isArray()
    .withMessage("Sizes must be an array of strings"),
  body("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*.url")
    .optional()
    .isString()
    .withMessage("Each image must have a URL"),
  body("images.*.public_alt")
    .optional()
    .isString()
    .withMessage("Each image must have a public_alt"),
  body("is_new_arrival")
    .optional()
    .isBoolean()
    .withMessage("is_new_arrival must be a boolean"),
  body("is_feature")
    .optional()
    .isBoolean()
    .withMessage("is_feature must be a boolean"),
  body("rating_count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Rating count must be a non-negative integer"),
];

export const deleteProductValidator = [
  param("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID"),
];
