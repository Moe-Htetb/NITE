// ProductShowcase.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetProductsQuery } from "@/store/rtk/productApi";
import type { Product } from "@/types/product";

const ProductShowcase = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"featured" | "new">("featured");

  const { data, isLoading: isLoading } = useGetProductsQuery({
    limit: 8,
    page: 1,
  });
  const featuredData = data?.data.filter((product) => product.is_feature);
  const newData = data?.data.filter((product) => product.is_new_arrival);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const getBadgeText = (product: Product) => {
    if (product.is_feature) return "FEATURED";
    if (product.is_new_arrival) return "NEW";
    return "";
  };

  const products = activeTab === "featured" ? featuredData : newData;

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Curated Collection
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Discover our handpicked selection of premium outdoor gear and latest
            innovations for your next adventure.
          </p>

          {/* Tab Navigation */}
          <div className="inline-flex bg-gray-100 rounded-2xl p-1 border border-gray-300">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "featured"
                  ? "bg-black text-white shadow-lg"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              Featured Products
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "new"
                  ? "bg-black text-white shadow-lg"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-700">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products!.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-700 text-lg">No products available</p>
          </div>
        )}

        {!isLoading && products!.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products!.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                {/* Product Image/Badge */}
                <div className="relative p-6 bg-gray-50">
                  {getBadgeText(product) && (
                    <div className="absolute top-1 left-4 z-10">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
                        {getBadgeText(product)}
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="w-full h-48 flex items-center justify-center overflow-hidden mt-3 bg-white rounded-lg">
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
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-black">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   handleAddToCart(product);
                      // }}
                      className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition-colors duration-300 transform group-hover:scale-105 flex items-center space-x-2 border-2 border-black"
                    >
                      {/* <ShoppingCart className="w-4 h-4" /> */}
                      <span>See Detail</span>
                    </button>
                  </div>

                  {/* Stock Info */}
                  {product.instock_count > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {product.instock_count} in stock
                    </p>
                  )}
                </div>

                {/* Hover Effect Border */}
                {/* <div className="absolute inset-0 border-2 border-transparent group-hover:border-black rounded-2xl pointer-events-none transition-all duration-500"></div> */}
              </div>
            ))}
          </div>
        )}

        {/* Features Banner */}
        <div className="mt-16 bg-black rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 border border-white/30">
                🚚
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm opacity-90">On orders over $100</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 border border-white/30">
                ↩️
              </div>
              <h3 className="font-semibold mb-2">30-Day Returns</h3>
              <p className="text-sm opacity-90">No questions asked</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 border border-white/30">
                🔒
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm opacity-90">100% protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
