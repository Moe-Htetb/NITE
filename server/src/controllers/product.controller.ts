import { NextFunction, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { Product } from "../models/product.model";
import { AuthRequest } from "../middlewares/authMiddleware";

//@route POST | /api/v1/product/create
// @desc create product
// @access admin
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

//@route POST | /api/v1/products
// @desc get all product
// @access public
export const getAllProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const products = await Product.find({});
    res.status(200).json({ products });
  }
);

//@route POST | /api/v1/product/:id
// @desc get single product
// @access public
export const getSingleProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ product });
  }
);

//@route POST | /api/v1/product/update/:id
// @desc create product
// @access admin
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
  }
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
  }
);

// @route GET | api/products/new
// @desc Get all new products.
// @access Public
export const getNewProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const product = await Product.find({ is_new_arrival: true });
    res.status(200).json({ product });
  }
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

    // // Build meta links for pagination
    // const metaLinks = [];

    // // Previous link
    // metaLinks.push({
    //   url: prevPageUrl,
    //   label: "&laquo; Previous",
    //   active: false
    // });

    // // Page number links
    // for (let i = 1; i <= totalPages; i++) {
    //   metaLinks.push({
    //     url: `${baseUrl}?${buildQueryParams(i)}`,
    //     label: i.toString(),
    //     active: i === pageNum
    //   });
    // }

    // // Next link
    // metaLinks.push({
    //   url: nextPageUrl,
    //   label: "Next &raquo;",
    //   active: false
    // });

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
      // meta: {
      //   current_page: pageNum,
      //   from: from,
      //   last_page: totalPages,
      //   links: metaLinks,
      //   path: baseUrl,
      //   per_page: limitNum,
      //   to: to,
      //   total: totalProducts
      // }
    });
  }
);

// @route GET | api/products/meta
// @desc Get all unique colors and size and minPrice and maxPrice
// @access Public
export const getMetaProductController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const color = await Product.distinct("colors");
    const size = await Product.distinct("sizes");

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
      minPrice: priceRange[0]?.minPrice || 0,
      maxPrice: priceRange[0]?.maxPrice || 0,
    });
  }
);
