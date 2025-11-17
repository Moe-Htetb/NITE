// HomePage.tsx

import HeroSection from "../components/HeroSection";
import ProductShowcase from "../components/ProductShowcase";

const HomePage = () => {
  const categories = [
    { name: "Hiking Gear", icon: "🥾", count: "24 items" },
    { name: "Camping Equipment", icon: "🏕️", count: "18 items" },
    { name: "Travel Accessories", icon: "🧳", count: "32 items" },
    { name: "Outdoor Clothing", icon: "🧥", count: "45 items" },
  ];

  return (
    <section className="min-h-screen bg-gray-50">
      <HeroSection />

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition duration-300 cursor-pointer group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-gray-600">{category.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Showcase Section */}
      <ProductShowcase />

      {/* Newsletter Section (existing) */}
      {/* <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Your Travel Inspiration Straight to Your Inbox
          </h2>
          <p className="text-gray-300 mb-8">
            Subscribe for exclusive deals and adventure tips
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default HomePage;
