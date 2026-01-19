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
      // Log what's coming in FormData
      console.log("FormData body:", req.body);
      console.log("Files:", req.files);

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

      // Validate required fields
      if (!name || !description || !category || !price) {
        throw new Error("Required fields: name, description, category, price");
      }

      // Parse arrays from FormData strings
      let sizesArray: string[] = [];
      if (sizesInput) {
        try {
          sizesArray =
            typeof sizesInput === "string"
              ? JSON.parse(sizesInput)
              : Array.isArray(sizesInput)
                ? sizesInput
                : [sizesInput];
        } catch (e) {
          sizesArray = [sizesInput as string];
        }
      }

      let colorsArray: string[] = [];
      if (colorsInput) {
        try {
          colorsArray =
            typeof colorsInput === "string"
              ? JSON.parse(colorsInput)
              : Array.isArray(colorsInput)
                ? colorsInput
                : [colorsInput];
        } catch (e) {
          colorsArray = [colorsInput as string];
        }
      }

      // Convert string numbers to actual numbers
      const priceNum = parseFloat(price);
      const instockCountNum = instock_count ? parseInt(instock_count, 10) : 0;
      const ratingCountNum = rating_count ? parseFloat(rating_count) : 0;

      // Validate numbers
      if (isNaN(priceNum)) {
        throw new Error("Price must be a valid number");
      }

      // Parse booleans from FormData strings
      const isFeature =
        is_feature === "true" || is_feature === true || is_feature === "1";
      const isNewArrival =
        is_new_arrival === "true" ||
        is_new_arrival === true ||
        is_new_arrival === "1";

      // Check if product with same name already exists
      const existingProduct = await Product.findOne({ name });

      if (existingProduct) {
        throw new Error("Product with this name already exists");
      }

      // Handle image uploads from FormData
      const images = req.files as Express.Multer.File[];

      if (!images || images.length === 0) {
        throw new Error("At least one image is required");
      }

      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          // Convert buffer to base64 string properly for Cloudinary
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

//@route POST | /api/v1/product/update/:id
// @desc create product
// @access admin
export const updateProductController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, description, category, existingImages } = req.body;

    const sizes = Array.isArray(req.body.sizes)
      ? req.body.sizes
      : [req.body.sizes];
    const colors = Array.isArray(req.body.colors)
      ? req.body.colors
      : [req.body.colors];

    const price = Number(req.body.price);
    const instock_count = Number(req.body.instock_count);
    const rating_count = Number(req.body.rating_count);

    const is_feature = req.body.is_feature === "true";
    const is_new_arrival = req.body.is_new_arrival === "true";

    // parse existing images
    const keepExistingImages = existingImages ? JSON.parse(existingImages) : [];

    // new images
    const newImages = req.files as Express.Multer.File[];

    const { id } = req.params;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      res.status(404);
      throw new Error("No product found with is id.");
    }

    // existing product image from db -> [{url:image_url,public_alt:abcd},{url:image_url,public_alt:efgh}]
    // existing image -> [{url:image_url,public_alt:abcd}]
    // [{url:image_url,public_alt:abcd}] existing images
    // [{url:image_url,public_alt:efgh}] image to delete

    // find images to delete from cloud
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
              console.log(`Failed to delete image ${img.public_alt}`, err);
            }
          }
        }),
      );
    }

    // upload new images
    let uploadedNewImages: any[] = [];
    if (newImages && newImages.length > 0) {
      uploadedNewImages = await Promise.all(
        newImages.map(async (image) => {
          const uploadImg = await uploadSingleImage(
            `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
            "fash.com/products",
          );
          return {
            url: uploadImg.url,
            public_alt: uploadImg.public_alt,
          };
        }),
      );
    }

    const finalImages = [...keepExistingImages, ...uploadedNewImages];

    existingProduct.name = name || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.price = price || existingProduct.price;
    existingProduct.instock_count =
      instock_count || existingProduct.instock_count;
    existingProduct.category = category || existingProduct.category;
    existingProduct.sizes = sizes || existingProduct.sizes;
    existingProduct.colors = colors || existingProduct.colors;
    existingProduct.images = finalImages;
    existingProduct.is_new_arrival =
      is_new_arrival || existingProduct.is_new_arrival;
    existingProduct.is_feature = is_feature || existingProduct.is_feature;
    existingProduct.rating_count = rating_count || existingProduct.rating_count;

    const updatedProduct = await existingProduct.save();

    res.status(200).json(updatedProduct);
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
    res.status(404).json({ message: "Product destory!" });
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
      sort_by = "createdAt",
      sort_direction = "desc",
      page = 1,
      limit = 5,
    } = req.query;

    let query: any = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }
    if (category) query.category = { $regex: category, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (color) {
      const colorArray = Array.isArray(color) ? color : [color];
      query.colors = {
        $in: colorArray.map((c) => new RegExp(c as string, "i")),
      };
    }

    if (size) {
      const sizeArray = Array.isArray(size) ? size : [size];
      query.sizes = {
        $in: sizeArray.map((s) => (s as string).toUpperCase()),
      };
    }

    // Sorting logic
    let sort: any = {};
    if (sort_by === "latest" || sort_by === "createdAt") {
      sort.createdAt = sort_direction === "asc" ? 1 : -1;
    } else if (sort_by === "rating") {
      sort.rating_count = sort_direction === "desc" ? -1 : 1;
    } else if (sort_by === "price") {
      sort.price = sort_direction === "asc" ? 1 : -1;
    } else if (sort_by === "name") {
      sort.name = sort_direction === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    // Pagination calculation
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const products = await Product.find(query)
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

    // Build meta links for pagination
    const metaLinks = [];

    // Previous link
    metaLinks.push({
      url: prevPageUrl,
      label: "&laquo; Previous",
      active: false,
    });

    // Page number links
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

    // Send response
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
