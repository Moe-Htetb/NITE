// HomePage.tsx

import HeroSection from "../components/HeroSection";
import ProductShowcase from "../components/ProductShowcase";
import { useGetProductMetaQuery } from "@/store/rtk/productApi";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const { data: metaData, isLoading } = useGetProductMetaQuery();

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  // Use categories from API or show loading/empty state
  const categories = metaData?.category || [];

  return (
    <section className="min-h-screen bg-white">
      <HeroSection />

      {/* Categories Section */}
      {/* <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">
          Shop by Category
        </h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-700">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-700">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-black shadow-lg p-6 text-center hover:shadow-xl transition duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  📦
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black group-hover:text-gray-700 transition-colors duration-300">
                  {category}
                </h3>
                <p className="text-gray-600">View Products</p>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Product Showcase Section */}
      <ProductShowcase />
    </section>
  );
};

export default HomePage;
