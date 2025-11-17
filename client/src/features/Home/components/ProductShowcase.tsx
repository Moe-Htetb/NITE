// ProductShowcase.tsx
import { useState } from "react";
import type { featureProduct } from "../../../types/product";

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState("featured");

  const featuredProducts: featureProduct[] = [
    {
      id: 1,
      product_name: "Explorer Pro Backpack",
      price: "$129.99",
      originalPrice: "$159.99",
      image: "🎒",
      rating: 4.8,
      reviews: 124,
      badge: "BESTSELLER",
      description:
        "Weather-resistant backpack with laptop compartment and hydration pocket",
    },
    {
      id: 2,
      product_name: "Trailblazer Hiking Boots",
      price: "$89.99",
      originalPrice: "$119.99",
      image: "👟",
      rating: 4.6,
      reviews: 89,
      badge: "FEATURED",
      description: "Waterproof leather boots with advanced grip technology",
    },
    {
      id: 3,
      product_name: "Alpine Ultra Tent",
      price: "$199.99",
      originalPrice: "$249.99",
      image: "⛺",
      rating: 4.9,
      reviews: 67,
      badge: "POPULAR",
      description: "4-season tent for extreme weather conditions",
    },
    {
      id: 4,
      product_name: "SolarCharge Power Bank",
      price: "$49.99",
      originalPrice: "$69.99",
      image: "🔋",
      rating: 4.7,
      reviews: 203,
      badge: "LIMITED",
      description: "Solar-powered 20,000mAh power bank with fast charging",
    },
  ];

  const newArrivals = [
    {
      id: 5,
      product_name: "AeroLight Sleeping Bag",
      price: "$149.99",
      image: "🛌",
      rating: 4.5,
      reviews: 23,
      badge: "NEW",
      description: "Ultra-lightweight sleeping bag for backpackers",
    },
    {
      id: 6,
      product_name: "ClimbPro Harness",
      price: "$79.99",
      image: "🪢",
      rating: 4.8,
      reviews: 15,
      badge: "NEW",
      description: "Professional climbing harness with quick-adjust buckles",
    },
    {
      id: 7,
      product_name: "TrailMaster GPS Watch",
      price: "$199.99",
      image: "⌚",
      rating: 4.4,
      reviews: 31,
      badge: "HOT",
      description: "GPS navigation watch with heart rate monitoring",
    },
    {
      id: 8,
      product_name: "AquaPure Filter Bottle",
      price: "$34.99",
      image: "💧",
      rating: 4.6,
      reviews: 42,
      badge: "TRENDING",
      description: "Water filtration bottle for outdoor adventures",
    },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "BESTSELLER":
        return "bg-orange-500 text-white";
      case "FEATURED":
        return "bg-purple-500 text-white";
      case "POPULAR":
        return "bg-pink-500 text-white";
      case "LIMITED":
        return "bg-red-500 text-white";
      case "NEW":
        return "bg-emerald-500 text-white";
      case "HOT":
        return "bg-red-500 text-white";
      case "TRENDING":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const products: featureProduct[] =
    activeTab === "featured" ? featuredProducts : newArrivals;

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Curated Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our handpicked selection of premium outdoor gear and latest
            innovations for your next adventure.
          </p>

          {/* Tab Navigation */}
          <div className="inline-flex bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "featured"
                  ? "bg-white text-emerald-600 shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Featured Products
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === "new"
                  ? "bg-white text-emerald-600 shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl overflow-hidden"
            >
              {/* Product Image/Badge */}
              <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${getBadgeColor(
                      product.badge
                    )}`}
                  >
                    {product.badge}
                  </span>
                </div>
                <div className="w-full h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                  {product.image}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-300">
                    ❤️
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                  {product.product_name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(product.rating)
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-emerald-600">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors duration-300 transform group-hover:scale-105 flex items-center space-x-2">
                    <span>Add</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-200 rounded-2xl pointer-events-none transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-105">
            View All{" "}
            {activeTab === "featured" ? "Featured Products" : "New Arrivals"}
          </button>
        </div>

        {/* Features Banner */}
        <div className="mt-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                🚚
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm opacity-90">On orders over $100</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                ↩️
              </div>
              <h3 className="font-semibold mb-2">30-Day Returns</h3>
              <p className="text-sm opacity-90">No questions asked</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
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
