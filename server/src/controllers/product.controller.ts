import { NextFunction, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { Product } from "../models/product.model";
import { AuthRequest } from "../middlewares/authMiddleware";
import { deleteImage, uploadSingleImage } from "../cloud/cloudinary";

//@route POST | /api/v1/product/create
// @desc create product
// @access admin

export const createProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        category,
        price,
        instock_count,
        rating_count,
        is_feature,
        is_new_arrival,
        sizes: sizesInput,
        colors: colorsInput,
      } = req.body;

      let sizesArray: string[] = [];
      if (sizesInput) {
        try {
          const parsedSizes =
            typeof sizesInput === "string"
              ? JSON.parse(sizesInput)
              : sizesInput;

          if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
            sizesArray = [
              ...new Set(
                parsedSizes.map((size: any) =>
                  String(size).toUpperCase().trim(),
                ),
              ),
            ];
          } else if (
            typeof parsedSizes === "string" &&
            parsedSizes.trim() !== ""
          ) {
            sizesArray = [parsedSizes.toUpperCase().trim()];
          }
        } catch (e) {
          sizesArray = [String(sizesInput).toUpperCase().trim()];
        }
      }

      let colorsArray: string[] = [];
      if (colorsInput) {
        try {
          const parsedColors =
            typeof colorsInput === "string"
              ? JSON.parse(colorsInput)
              : colorsInput;

          if (Array.isArray(parsedColors) && parsedColors.length > 0) {
            // Remove duplicates
            colorsArray = [
              ...new Set(
                parsedColors.map((color: any) => String(color).trim()),
              ),
            ];
          } else if (
            typeof parsedColors === "string" &&
            parsedColors.trim() !== ""
          ) {
            colorsArray = [parsedColors.trim()];
          }
        } catch (e) {
          colorsArray = [String(colorsInput).trim()];
        }
      }

      const priceNum = parseFloat(price);
      const instockCountNum = instock_count ? parseInt(instock_count, 10) : 0;
      const ratingCountNum = rating_count ? parseFloat(rating_count) : 0;

      const isFeature =
        is_feature === "true" || is_feature === true || is_feature === "1";
      const isNewArrival =
        is_new_arrival === "true" ||
        is_new_arrival === true ||
        is_new_arrival === "1";

      const images = req.files as Express.Multer.File[];

      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const base64Image = image.buffer.toString("base64");
          const dataUri = `data:${image.mimetype};base64,${base64Image}`;

          const uploadImg = await uploadSingleImage(dataUri, "NITE/products");
          return {
            url: uploadImg.url,
            public_alt: uploadImg.public_alt,
          };
        }),
      );

      const product = await Product.create({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: priceNum,
        instock_count: instockCountNum,
        sizes: sizesArray,
        colors: colorsArray,
        images: uploadedImages,
        is_new_arrival: isNewArrival,
        is_feature: isFeature,
        rating_count: ratingCountNum,
        userId: req.user?._id,
      });

      res.status(201).json({
        success: true,
        message: `${product.name} created successfully`,
        product,
      });
    } catch (error: any) {
      console.error("Create product error:", error);
      next(error);
    }
  },
);

//@route POST | /api/v1/products
// @desc get all product
// @access public
export const getAllProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const products = await Product.find({});
    res.status(200).json({ products });
  },
);

//@route POST | /api/v1/product/:id
// @desc get single product
// @access public
export const getSingleProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ product });
  },
);

//@route PATCH | /api/v1/product/update/:id
// @desc create product
// @access admin
export const updateProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        category,
        price,
        instock_count,
        rating_count,
        is_feature,
        is_new_arrival,
        sizes: sizesInput,
        colors: colorsInput,
        existingImages,
      } = req.body;

      const { id } = req.params;

      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        res.status(404);
        throw new Error("No product found with this id.");
      }

      let sizesArray: string[] = existingProduct.sizes;
      if (
        sizesInput !== undefined &&
        sizesInput !== null &&
        sizesInput !== ""
      ) {
        try {
          const parsedSizes =
            typeof sizesInput === "string"
              ? JSON.parse(sizesInput)
              : sizesInput;

          if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
            sizesArray = parsedSizes.map((size: any) => String(size).trim());
          } else if (
            typeof parsedSizes === "string" &&
            parsedSizes.trim() !== ""
          ) {
            sizesArray = [parsedSizes.trim()];
          }
        } catch (e) {
          console.error("Error parsing sizes:", e);
        }
      }

      let colorsArray: string[] = existingProduct.colors;
      if (
        colorsInput !== undefined &&
        colorsInput !== null &&
        colorsInput !== ""
      ) {
        try {
          const parsedColors =
            typeof colorsInput === "string"
              ? JSON.parse(colorsInput)
              : colorsInput;

          if (Array.isArray(parsedColors) && parsedColors.length > 0) {
            colorsArray = parsedColors.map((color: any) =>
              String(color).trim(),
            );
          } else if (
            typeof parsedColors === "string" &&
            parsedColors.trim() !== ""
          ) {
            colorsArray = [parsedColors.trim()];
          }
        } catch (e) {
          console.error("Error parsing colors:", e);
        }
      }

      const priceNum =
        price !== undefined && price !== null && price !== ""
          ? parseFloat(price)
          : existingProduct.price;

      const instockCountNum =
        instock_count !== undefined &&
        instock_count !== null &&
        instock_count !== ""
          ? parseInt(instock_count, 10)
          : existingProduct.instock_count;

      const ratingCountNum =
        rating_count !== undefined &&
        rating_count !== null &&
        rating_count !== ""
          ? parseFloat(rating_count)
          : existingProduct.rating_count;

      const isFeature =
        is_feature !== undefined && is_feature !== null && is_feature !== ""
          ? is_feature === "true" || is_feature === true || is_feature === "1"
          : existingProduct.is_feature;

      const isNewArrival =
        is_new_arrival !== undefined &&
        is_new_arrival !== null &&
        is_new_arrival !== ""
          ? is_new_arrival === "true" ||
            is_new_arrival === true ||
            is_new_arrival === "1"
          : existingProduct.is_new_arrival;

      if (name && name.trim() !== existingProduct.name) {
        const duplicateProduct = await Product.findOne({
          name: name.trim(),
          _id: { $ne: id },
        });

        if (duplicateProduct) {
          throw new Error("Product with this name already exists");
        }
      }

      let finalImages = existingProduct.images;

      let keepExistingImages: any[] = [];

      if (
        existingImages !== undefined &&
        existingImages !== null &&
        existingImages !== ""
      ) {
        try {
          const parsedImages =
            typeof existingImages === "string"
              ? JSON.parse(existingImages)
              : existingImages;

          if (Array.isArray(parsedImages)) {
            keepExistingImages = parsedImages.filter(
              (img: any) =>
                img &&
                typeof img === "object" &&
                typeof img.url === "string" &&
                typeof img.public_alt === "string" &&
                img.url.trim() !== "" &&
                img.public_alt.trim() !== "",
            );
          }
        } catch (e) {
          console.error("Error parsing existingImages:", e);

          keepExistingImages = existingProduct.images;
        }
      } else {
        keepExistingImages = existingProduct.images;
      }

      if (keepExistingImages.length > 0) {
        const imagesToDelete = existingProduct.images.filter((existingImg) => {
          return !keepExistingImages.some(
            (keepImg: any) => keepImg.public_alt === existingImg.public_alt,
          );
        });

        if (imagesToDelete.length > 0) {
          await Promise.all(
            imagesToDelete.map(async (img) => {
              if (img.public_alt) {
                try {
                  await deleteImage(img.public_alt);
                } catch (err) {
                  console.error(
                    `Failed to delete image ${img.public_alt}`,
                    err,
                  );
                }
              }
            }),
          );
        }
      }

      let uploadedNewImages: any[] = [];
      const newImages = req.files as Express.Multer.File[];

      if (newImages && newImages.length > 0) {
        uploadedNewImages = await Promise.all(
          newImages.map(async (image) => {
            const base64Image = image.buffer.toString("base64");
            const dataUri = `data:${image.mimetype};base64,${base64Image}`;

            const uploadImg = await uploadSingleImage(dataUri, "NITE/products");
            return {
              url: uploadImg.url,
              public_alt: uploadImg.public_alt,
            };
          }),
        );
      }

      finalImages = [...keepExistingImages, ...uploadedNewImages];

      if (finalImages.length === 0) {
        throw new Error("At least one image is required");
      }

      if (name !== undefined) existingProduct.name = name.trim();
      if (description !== undefined)
        existingProduct.description = description.trim();
      if (category !== undefined) existingProduct.category = category.trim();

      existingProduct.price = priceNum;
      existingProduct.instock_count = instockCountNum;
      existingProduct.sizes = sizesArray;
      existingProduct.colors = colorsArray;
      existingProduct.images = finalImages;
      existingProduct.is_new_arrival = isNewArrival;
      existingProduct.is_feature = isFeature;
      existingProduct.rating_count = ratingCountNum;

      const updatedProduct = await existingProduct.save();

      res.status(200).json({
        success: true,
        message: `${updatedProduct.name} updated successfully`,
        product: updatedProduct,
      });
    } catch (error: any) {
      console.error("Update product error:", error);
      next(error);
    }
  },
);
//@route POST | /api/v1/product/delete/:id
// @desc create product
// @access admin
export const deleteProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      res.status(404);
      throw new Error("No product found with is id.");
    }

    await existingProduct.deleteOne();
    res.status(200).json({ message: "Product destory Scuuessfully!" });
  },
);

// @route GET | api/products/feature
// @desc Get all feature products.
// @access Public
export const getFeaturedProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const product = await Product.find({ is_feature: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ product });
  },
);

// @route GET | api/products/new
// @desc Get all new products.
// @access Public
export const getNewProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const product = await Product.find({ is_new_arrival: true });
    res.status(200).json({ product });
  },
);
// @route GET | api/products/keyword={name}
// @desc Get all filter products.
// @access Public

export const getProductsWithFilter = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      color,
      size,
      is_feature,
      is_new_arrival,
      sort_by = "createdAt",
      sort_direction = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    let query: any = {};

    // Search by keyword (name, description, or category)
    if (keyword) {
      const keywordStr = keyword.toString().trim();
      if (keywordStr) {
        query.$or = [
          { name: { $regex: keywordStr, $options: "i" } },
          { description: { $regex: keywordStr, $options: "i" } },
          { category: { $regex: keywordStr, $options: "i" } },
        ];
      }
    }

    // Category filter
    if (category) {
      query.category = { $regex: category.toString(), $options: "i" };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Color filter (multiple colors)
    if (color) {
      const colorArray = Array.isArray(color)
        ? color.map((c) => new RegExp(`^${c.toString().trim()}$`, "i"))
        : [new RegExp(`^${color.toString().trim()}$`, "i")];

      query.colors = { $in: colorArray };
    }

    // Size filter (multiple sizes)
    if (size) {
      const sizeArray = Array.isArray(size)
        ? size.map((s) => s.toString().toUpperCase().trim())
        : [size.toString().toUpperCase().trim()];

      query.sizes = { $in: sizeArray };
    }

    // Feature filter
    if (is_feature !== undefined && is_feature !== null && is_feature !== "") {
      query.is_feature = is_feature === "true" || is_feature === "1";
    }

    // New arrival filter
    if (
      is_new_arrival !== undefined &&
      is_new_arrival !== null &&
      is_new_arrival !== ""
    ) {
      query.is_new_arrival =
        is_new_arrival === "true" || is_new_arrival === "1";
    }

    // Sorting logic
    let sort: any = {};
    if (sort_by === "latest" || sort_by === "createdAt") {
      sort.createdAt = sort_direction === "asc" ? 1 : -1;
    } else if (sort_by === "price") {
      sort.price = sort_direction === "asc" ? 1 : -1;
    } else if (sort_by === "rating") {
      sort.rating_count = sort_direction === "asc" ? 1 : -1;
    } else if (sort_by === "name") {
      sort.name = sort_direction === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort
    }

    // Pagination calculation
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const products = await Product.find(query)
      .select("-__v") // Exclude version field
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Build base URL
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
      req.path
    }`;

    // Build query parameters without page
    const buildQueryParams = (pageNumber: number = pageNum) => {
      const params = new URLSearchParams();

      if (keyword) params.append("keyword", keyword as string);
      if (category) params.append("category", category as string);
      if (minPrice) params.append("minPrice", minPrice as string);
      if (maxPrice) params.append("maxPrice", maxPrice as string);

      if (color) {
        if (Array.isArray(color)) {
          color.forEach((c) => params.append("color", c as string));
        } else {
          params.append("color", color as string);
        }
      }

      if (size) {
        if (Array.isArray(size)) {
          size.forEach((s) => params.append("size", s as string));
        } else {
          params.append("size", size as string);
        }
      }

      if (
        is_feature !== undefined &&
        is_feature !== null &&
        is_feature !== ""
      ) {
        params.append("is_feature", is_feature as string);
      }

      if (
        is_new_arrival !== undefined &&
        is_new_arrival !== null &&
        is_new_arrival !== ""
      ) {
        params.append("is_new_arrival", is_new_arrival as string);
      }

      if (sort_by) params.append("sort_by", sort_by as string);
      if (sort_direction)
        params.append("sort_direction", sort_direction as string);

      params.append("limit", limitNum.toString());
      params.append("page", pageNumber.toString());

      return params.toString();
    };

    // Build links
    const firstPageUrl = `${baseUrl}?${buildQueryParams(1)}`;
    const lastPageUrl = `${baseUrl}?${buildQueryParams(totalPages)}`;
    const prevPageUrl =
      pageNum > 1 ? `${baseUrl}?${buildQueryParams(pageNum - 1)}` : null;
    const nextPageUrl =
      pageNum < totalPages
        ? `${baseUrl}?${buildQueryParams(pageNum + 1)}`
        : null;

    // Build meta links for pagination (like in users - show ALL pages)
    const metaLinks = [];

    // Previous link
    metaLinks.push({
      url: prevPageUrl,
      label: "&laquo; Previous",
      active: false,
    });

    // Page number links (show ALL pages like in users)
    for (let i = 1; i <= totalPages; i++) {
      metaLinks.push({
        url: `${baseUrl}?${buildQueryParams(i)}`,
        label: i.toString(),
        active: i === pageNum,
      });
    }

    // Next link
    metaLinks.push({
      url: nextPageUrl,
      label: "Next &raquo;",
      active: false,
    });

    // Calculate from and to
    const from = totalProducts > 0 ? (pageNum - 1) * limitNum + 1 : null;
    const to =
      totalProducts > 0 ? Math.min(pageNum * limitNum, totalProducts) : null;

    // Send response (EXACT SAME FORMAT AS USERS)
    res.json({
      data: products,
      links: {
        first: firstPageUrl,
        last: lastPageUrl,
        prev: prevPageUrl,
        next: nextPageUrl,
        totalProducts,
        totalPages,
        from,
        to,
      },
      meta: {
        current_page: pageNum,
        from: from,
        last_page: totalPages,
        links: metaLinks,
        path: baseUrl,
        per_page: limitNum,
        to: to,
        total: totalProducts,
      },
    });
  },
);
// @route GET | api/products/meta
// @desc Get all unique colors and size and minPrice and maxPrice
// @access Public
export const getMetaProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const color = await Product.distinct("colors");
    const size = await Product.distinct("sizes");
    const category = await Product.distinct("category");

    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(200).json({
      colors: color,
      sizes: size,
      category: category,
      minPrice: priceRange[0]?.minPrice || 0,
      maxPrice: priceRange[0]?.maxPrice || 0,
    });
  },
);
