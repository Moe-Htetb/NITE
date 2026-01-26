import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useGetProductsQuery } from "@/store/rtk/productApi";
import { useAppDispatch } from "@/types/useRedux";
import { addToCart } from "@/store/cartSlice";
import type { Product } from "@/types/product";
import { ShoppingCart, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const category = searchParams.get("category") || "";
  const keyword = searchParams.get("keyword") || "";
  const isFeature = searchParams.get("is_feature");
  const isNewArrival = searchParams.get("is_new_arrival");
  const page = parseInt(searchParams.get("page") || "1");
  const sort_by = searchParams.get("sort_by") || "createdAt";
  const sort_direction = searchParams.get("sort_direction") || "desc";

  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useGetProductsQuery({
    category: category || undefined,
    keyword: keyword || undefined,
    is_feature: isFeature === "true" ? true : undefined,
    is_new_arrival: isNewArrival === "true" ? true : undefined,
    page,
    limit: 12,
    sort_by,
    sort_direction,
  });

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localKeyword) {
      params.set("keyword", localKeyword);
    } else {
      params.delete("keyword");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort_by", newSort);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        product,
        quantity: 1,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            {isFeature === "true"
              ? "Featured Products"
              : isNewArrival === "true"
                ? "New Arrivals"
                : category
                  ? `${category} Products`
                  : "All Products"}
          </h1>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-900 px-6"
              >
                Search
              </Button>
            </form>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-2 border-black text-black hover:bg-gray-100"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {(category || isFeature === "true" || isNewArrival === "true") && (
                <Button
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-gray-100"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("category");
                    params.delete("is_feature");
                    params.delete("is_new_arrival");
                    setSearchParams(params);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-700 font-medium">Sort by:</span>
            <div className="flex gap-2">
              <Button
                variant={sort_by === "createdAt" ? "default" : "outline"}
                size="sm"
                className={
                  sort_by === "createdAt"
                    ? "bg-black text-white"
                    : "border-2 border-black text-black"
                }
                onClick={() => handleSortChange("createdAt")}
              >
                Latest
              </Button>
              <Button
                variant={sort_by === "price" ? "default" : "outline"}
                size="sm"
                className={
                  sort_by === "price"
                    ? "bg-black text-white"
                    : "border-2 border-black text-black"
                }
                onClick={() => handleSortChange("price")}
              >
                Price
              </Button>
              <Button
                variant={sort_by === "rating" ? "default" : "outline"}
                size="sm"
                className={
                  sort_by === "rating"
                    ? "bg-black text-white"
                    : "border-2 border-black text-black"
                }
                onClick={() => handleSortChange("rating")}
              >
                Rating
              </Button>
            </div>
          </div>
        </div>

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
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data.data.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Product Image */}
                  <div className="relative p-6 bg-gray-50">
                    {product.is_feature && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
                          FEATURED
                        </span>
                      </div>
                    )}
                    {product.is_new_arrival && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
                          NEW
                        </span>
                      </div>
                    )}

                    <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-white rounded-lg">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">
                          📦
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    {product.rating_count > 0 && (
                      <div className="flex items-center mb-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(product.rating_count)
                                  ? "text-black"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          ({product.rating_count.toFixed(1)})
                        </span>
                      </div>
                    )}

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-black">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-black text-white hover:bg-gray-900 flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.meta && data.meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  className="border-2 border-black text-black"
                  disabled={page === 1}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", (page - 1).toString());
                    setSearchParams(params);
                  }}
                >
                  Previous
                </Button>
                <span className="text-gray-700 px-4">
                  Page {page} of {data.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  className="border-2 border-black text-black"
                  disabled={page >= data.meta.totalPages}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", (page + 1).toString());
                    setSearchParams(params);
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && data && data.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-700 text-lg mb-4">No products found</p>
            <Button
              onClick={() => {
                setSearchParams({});
                navigate("/products");
              }}
              className="bg-black text-white hover:bg-gray-900"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
