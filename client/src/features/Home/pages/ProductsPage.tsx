import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  useGetProductsQuery,
  useGetProductMetaQuery,
} from "@/store/rtk/productApi";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import type { ProductsFilterParams } from "@/types/product";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract URL parameters
  const queryParams = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      keyword: searchParams.get("keyword") || "",
      isFeature: searchParams.get("is_feature"),
      isNewArrival: searchParams.get("is_new_arrival"),
      colors: searchParams.getAll("color") || [],
      sizes: searchParams.getAll("size") || [],
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      page: parseInt(searchParams.get("page") || "1"),
      sort_by: searchParams.get("sort_by") || "createdAt",
      sort_direction: searchParams.get("sort_direction") || "desc",
    }),
    [searchParams],
  );

  const [localKeyword, setLocalKeyword] = useState(queryParams.keyword);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    queryParams.colors,
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    queryParams.sizes,
  );
  const [priceRange, setPriceRange] = useState({
    min: queryParams.minPrice,
    max: queryParams.maxPrice,
  });

  // Memoize query parameters for the API call
  const apiQueryParams = useMemo(() => {
    const params: ProductsFilterParams = {
      category: queryParams.category || undefined,
      keyword: queryParams.keyword || undefined,
      is_feature: queryParams.isFeature === "true" ? true : undefined,
      is_new_arrival: queryParams.isNewArrival === "true" ? true : undefined,
      color: queryParams.colors.length > 0 ? queryParams.colors : undefined,
      size: queryParams.sizes.length > 0 ? queryParams.sizes : undefined,
      page: queryParams.page,
      limit: 12,
      sort_by: queryParams.sort_by,
      sort_direction: queryParams.sort_direction,
    };

    // Convert string prices to numbers
    if (queryParams.minPrice) {
      const minPriceNum = Number(queryParams.minPrice);
      if (!isNaN(minPriceNum)) {
        params.minPrice = minPriceNum;
      }
    }

    if (queryParams.maxPrice) {
      const maxPriceNum = Number(queryParams.maxPrice);
      if (!isNaN(maxPriceNum)) {
        params.maxPrice = maxPriceNum;
      }
    }

    return params;
  }, [queryParams]);

  // Get products with all filters
  const { data, isLoading, error } = useGetProductsQuery(apiQueryParams);

  // Get meta data for filters
  const { data: metaData } = useGetProductMetaQuery();

  // Initialize state from URL params on component mount
  useEffect(() => {
    setLocalKeyword(queryParams.keyword);
    setSelectedColors(queryParams.colors);
    setSelectedSizes(queryParams.sizes);
    setPriceRange({
      min: queryParams.minPrice,
      max: queryParams.maxPrice,
    });
  }, []); // Empty dependency array - runs once on mount

  // Create a stable debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("keyword", value);
      } else {
        params.delete("keyword");
      }
      params.set("page", "1");
      setSearchParams(params);
    }, 500),
    [searchParams, setSearchParams],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalKeyword(value);
    debouncedSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch.flush();
  };

  const handleFilterChange = useCallback(
    (type: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams);

      let newColors = [...selectedColors];
      let newSizes = [...selectedSizes];

      if (type === "color") {
        newColors = checked
          ? [...selectedColors, value]
          : selectedColors.filter((c) => c !== value);
        setSelectedColors(newColors);
        params.delete("color");
        newColors.forEach((color) => params.append("color", color));
      } else if (type === "size") {
        newSizes = checked
          ? [...selectedSizes, value]
          : selectedSizes.filter((s) => s !== value);
        setSelectedSizes(newSizes);
        params.delete("size");
        newSizes.forEach((size) => params.append("size", size));
      }

      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, selectedColors, selectedSizes, setSearchParams],
  );

  const handlePriceChange = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (priceRange.min) {
      params.set("minPrice", priceRange.min);
    } else {
      params.delete("minPrice");
    }
    if (priceRange.max) {
      params.set("maxPrice", priceRange.max);
    } else {
      params.delete("maxPrice");
    }
    params.set("page", "1");
    setSearchParams(params);
  }, [priceRange, searchParams, setSearchParams]);

  const handleSortChange = useCallback(
    (newSort: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("sort_by", newSort);
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("sort_by", "createdAt");
    params.set("sort_direction", "desc");

    setSearchParams(params);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange({ min: "", max: "" });
    setLocalKeyword("");
  }, [setSearchParams]);

  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/product/${productId}`);
    },
    [navigate],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (queryParams.category) count++;
    if (queryParams.isFeature === "true") count++;
    if (queryParams.isNewArrival === "true") count++;
    if (selectedColors.length > 0) count++;
    if (selectedSizes.length > 0) count++;
    if (priceRange.min || priceRange.max) count++;
    if (localKeyword) count++;
    return count;
  }, [queryParams, selectedColors, selectedSizes, priceRange, localKeyword]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            {queryParams.isFeature === "true"
              ? "Featured Products"
              : queryParams.isNewArrival === "true"
                ? "New Arrivals"
                : queryParams.category
                  ? `${queryParams.category} Products`
                  : "All Products"}
          </h1>

          {/* Search Bar */}
          <div className="mb-6 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={localKeyword}
                onChange={handleSearchChange}
                placeholder="Search products by name, description, or category..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </form>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">Sort by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={
                    queryParams.sort_by === "createdAt" ? "default" : "outline"
                  }
                  size="sm"
                  className={
                    queryParams.sort_by === "createdAt"
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 text-black hover:bg-gray-100"
                  }
                  onClick={() => handleSortChange("createdAt")}
                >
                  Latest
                </Button>
                <Button
                  variant={
                    queryParams.sort_by === "price" ? "default" : "outline"
                  }
                  size="sm"
                  className={
                    queryParams.sort_by === "price"
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 text-black hover:bg-gray-100"
                  }
                  onClick={() => handleSortChange("price")}
                >
                  Price
                </Button>
                <Button
                  variant={
                    queryParams.sort_by === "rating" ? "default" : "outline"
                  }
                  size="sm"
                  className={
                    queryParams.sort_by === "rating"
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 text-black hover:bg-gray-100"
                  }
                  onClick={() => handleSortChange("rating")}
                >
                  Rating
                </Button>
                <Button
                  variant={
                    queryParams.sort_by === "name" ? "default" : "outline"
                  }
                  size="sm"
                  className={
                    queryParams.sort_by === "name"
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 text-black hover:bg-gray-100"
                  }
                  onClick={() => handleSortChange("name")}
                >
                  Name
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set(
                    "sort_direction",
                    queryParams.sort_direction === "desc" ? "asc" : "desc",
                  );
                  setSearchParams(params);
                }}
                className="border border-gray-300 text-black hover:bg-gray-100"
              >
                {queryParams.sort_direction === "desc"
                  ? "Descending"
                  : "Ascending"}
              </Button>

              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="border border-gray-300 text-black hover:bg-gray-100"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters ({activeFilterCount})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid: Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Left */}
          <div className="lg:col-span-1">
            <div className="sticky top-16">
              {metaData && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5" />
                      Filters
                    </h3>

                    {/* Active Filters */}
                    {activeFilterCount > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">
                          Active filters: {activeFilterCount}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear all
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Colors Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-black mb-3">Colors</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {metaData.colors?.map((color) => (
                        <div key={color} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`color-${color}`}
                            checked={selectedColors.includes(color)}
                            onChange={(e) =>
                              handleFilterChange(
                                "color",
                                color,
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`color-${color}`}
                            className="ml-2 text-gray-700 text-sm flex items-center gap-2"
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300"
                              // style={{ backgroundColor: color.toLowerCase() }}
                            />
                            {color}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sizes Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-black mb-3">Sizes</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {metaData.sizes?.map((size) => (
                        <div key={size} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`size-${size}`}
                            checked={selectedSizes.includes(size)}
                            onChange={(e) =>
                              handleFilterChange("size", size, e.target.checked)
                            }
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`size-${size}`}
                            className="ml-2 text-gray-700 text-sm"
                          >
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-black mb-3">
                      Price Range
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Min Price
                          </label>
                          <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) =>
                              setPriceRange({
                                ...priceRange,
                                min: e.target.value,
                              })
                            }
                            placeholder={`Min: $${metaData.minPrice}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Max Price
                          </label>
                          <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) =>
                              setPriceRange({
                                ...priceRange,
                                max: e.target.value,
                              })
                            }
                            placeholder={`Max: $${metaData.maxPrice}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handlePriceChange}
                        className="w-full bg-black text-white hover:bg-gray-900 text-sm"
                      >
                        Apply Price Filter
                      </Button>
                      <div className="text-xs text-gray-500 text-center">
                        Range: ${metaData.minPrice} - ${metaData.maxPrice}
                      </div>
                    </div>
                  </div>

                  {/* Category Filter (if you have categories in meta) */}
                  {metaData.category && metaData.category.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-black mb-3">
                        Category
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {metaData.category.map((cat) => (
                          <div key={cat} className="flex items-center">
                            <input
                              type="radio"
                              id={`category-${cat}`}
                              name="category"
                              checked={queryParams.category === cat}
                              onChange={() => {
                                const params = new URLSearchParams(
                                  searchParams,
                                );
                                params.set("category", cat);
                                params.set("page", "1");
                                setSearchParams(params);
                              }}
                              className="h-4 w-4 text-black focus:ring-black border-gray-300"
                            />
                            <label
                              htmlFor={`category-${cat}`}
                              className="ml-2 text-gray-700 text-sm capitalize"
                            >
                              {cat}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid - Right */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                <p className="mt-4 text-gray-700">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">Error loading products</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-4 border border-gray-300 text-black hover:bg-gray-100"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && data && (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-gray-600 text-sm">
                    Showing {data.meta.from} to {data.meta.to} of{" "}
                    {data.meta.total} products
                  </div>
                  <div className="text-sm text-gray-600">
                    Page {queryParams.page} of {data.links.totalPages}
                  </div>
                </div>

                {data.data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-700 text-lg mb-2">
                        No products found
                      </p>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your filters or search term
                      </p>
                      <Button
                        onClick={clearAllFilters}
                        className="bg-black text-white hover:bg-gray-900"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {data.data.map((product) => (
                        <div
                          key={product._id}
                          className="group bg-white rounded-xl border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer"
                          onClick={() => handleProductClick(product._id)}
                        >
                          {/* Product Image */}
                          <div className="relative p-4 bg-gray-50">
                            {product.is_feature && (
                              <div className="absolute top-3 left-3 z-10">
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-black text-white">
                                  FEATURED
                                </span>
                              </div>
                            )}
                            {product.is_new_arrival && (
                              <div className="absolute top-3 left-3 z-10">
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-black text-white">
                                  NEW
                                </span>
                              </div>
                            )}

                            <div className="w-full h-40 flex items-center justify-center overflow-hidden bg-white rounded-lg">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-100 text-gray-400">
                                  📦
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <h3 className="font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>

                            {/* Product Meta */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {product.colors
                                ?.slice(0, 2)
                                .map((color, index) => (
                                  <span
                                    key={index}
                                    className="text-xs px-2 py-1 bg-gray-100 rounded"
                                  >
                                    {color}
                                  </span>
                                ))}
                              {product.sizes?.slice(0, 2).map((size, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-gray-100 rounded"
                                >
                                  {size}
                                </span>
                              ))}
                            </div>

                            {/* Rating */}
                            {product.rating_count > 0 && (
                              <div className="flex items-center mb-3">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-sm ${
                                        i < Math.floor(product.rating_count)
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600 ml-2">
                                  ({product.rating_count.toFixed(1)})
                                </span>
                              </div>
                            )}

                            {/* Price and CTA */}
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-black">
                                ${product.price.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                className="bg-black text-white hover:bg-gray-900 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductClick(product._id);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {data.meta && data.links.totalPages > 1 && (
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t">
                        <div className="text-sm text-gray-600">
                          Showing {data.meta.from} to {data.meta.to} of{" "}
                          {data.meta.total} products
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border border-gray-300 text-black hover:bg-gray-100"
                            disabled={queryParams.page === 1}
                            onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              params.set(
                                "page",
                                (queryParams.page - 1).toString(),
                              );
                              setSearchParams(params);
                            }}
                          >
                            Previous
                          </Button>

                          <div className="flex items-center gap-1">
                            {Array.from(
                              { length: Math.min(5, data.meta.last_page) },
                              (_, i) => {
                                let pageNum = i + 1;
                                if (data.meta.last_page > 5) {
                                  if (queryParams.page > 3) {
                                    pageNum = queryParams.page - 2 + i;
                                    if (pageNum > data.meta.last_page)
                                      return null;
                                    if (pageNum < 1) pageNum = 1;
                                  }
                                }

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      queryParams.page === pageNum
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => {
                                      const params = new URLSearchParams(
                                        searchParams,
                                      );
                                      params.set("page", pageNum.toString());
                                      setSearchParams(params);
                                    }}
                                    className={
                                      queryParams.page === pageNum
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "border border-gray-300 text-black hover:bg-gray-100"
                                    }
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              },
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border border-gray-300 text-black hover:bg-gray-100"
                            disabled={queryParams.page >= data.links.totalPages}
                            onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              params.set(
                                "page",
                                (queryParams.page + 1).toString(),
                              );
                              setSearchParams(params);
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
