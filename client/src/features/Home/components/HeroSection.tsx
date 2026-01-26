// HeroSection.tsx
import { useNavigate } from "react-router";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white py-20 overflow-hidden border-b border-gray-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-black rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-black rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-black rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-black rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-full shadow-sm mb-6">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">
                Summer Sale - Up to 50% Off
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              Adventure Awaits with
              <span className="text-black block">Premium Gear</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Discover carefully curated outdoor equipment and travel essentials
              that transform your journeys into unforgettable experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/products")}
                className="group bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Start Exploring</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              <button
                onClick={() => navigate("/products")}
                className="border-2 border-black text-black px-8 py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 bg-white"
              >
                View Products
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-300">
              <div className="text-center px-2 sm:px-0">
                <div className="text-xl sm:text-2xl font-bold text-black">10K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center px-2 sm:px-0">
                <div className="text-xl sm:text-2xl font-bold text-black">50+</div>
                <div className="text-xs sm:text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center px-2 sm:px-0">
                <div className="text-xl sm:text-2xl font-bold text-black">4.9★</div>
                <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative mt-8 lg:mt-0">
            {/* Header - Centered */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">
                Featured Products
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Handpicked selections for your next adventure
              </p>
            </div>

            {/* Product Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {/* Featured Product 1 */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-gray-200 hover:border-black shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-xl sm:rounded-2xl mb-2 sm:mb-3 md:mb-4 flex items-center justify-center text-xl sm:text-2xl mx-auto">
                  🎒
                </div>
                <h3 className="font-semibold text-black mb-1 sm:mb-2 text-xs sm:text-sm md:text-base text-center line-clamp-2">
                  Explorer Backpack
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-black">$129</span>
                  <div className="flex text-black text-xs sm:text-sm">★★★★☆</div>
                </div>
              </div>

              {/* Featured Product 2 */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-gray-200 hover:border-black shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-xl sm:rounded-2xl mb-2 sm:mb-3 md:mb-4 flex items-center justify-center text-xl sm:text-2xl mx-auto">
                  👟
                </div>
                <h3 className="font-semibold text-black mb-1 sm:mb-2 text-xs sm:text-sm md:text-base text-center line-clamp-2">
                  Trail Hikers
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-black">$89</span>
                  <div className="flex text-black text-xs sm:text-sm">★★★★★</div>
                </div>
              </div>

              {/* Featured Product 3 */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-gray-200 hover:border-black shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-xl sm:rounded-2xl mb-2 sm:mb-3 md:mb-4 flex items-center justify-center text-xl sm:text-2xl mx-auto">
                  ⛺
                </div>
                <h3 className="font-semibold text-black mb-1 sm:mb-2 text-xs sm:text-sm md:text-base text-center line-clamp-2">
                  Alpine Tent
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-black">$199</span>
                  <div className="flex text-black text-xs sm:text-sm">★★★★☆</div>
                </div>
              </div>

              {/* Featured Product 4 */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-gray-200 hover:border-black shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-xl sm:rounded-2xl mb-2 sm:mb-3 md:mb-4 flex items-center justify-center text-xl sm:text-2xl mx-auto">
                  🔦
                </div>
                <h3 className="font-semibold text-black mb-1 sm:mb-2 text-xs sm:text-sm md:text-base text-center line-clamp-2">
                  Night Explorer
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-black">$45</span>
                  <div className="flex text-black text-xs sm:text-sm">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
