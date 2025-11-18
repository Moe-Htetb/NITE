// HeroSection.tsx
const HeroSection = () => {
  return (
    <div className="relative bg-linear-to-br from-emerald-50 to-cyan-100 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-cyan-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-teal-300 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-emerald-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-emerald-700">
                Summer Sale - Up to 50% Off
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Adventure Awaits with
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-cyan-600 block">
                Premium Gear
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Discover carefully curated outdoor equipment and travel essentials
              that transform your journeys into unforgettable experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
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
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-emerald-400 hover:text-emerald-700 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                Watch Story
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12 pt-8 border-t border-gray-200/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">10K+</div>
                <div className="text-sm text-gray-500">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">50+</div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">4.9★</div>
                <div className="text-sm text-gray-500">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:max-w-none">
              {/* Featured Product 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-16 h-16 bg-linear-to-br from-emerald-400 to-cyan-400 rounded-2xl mb-4 flex items-center justify-center text-2xl">
                  🎒
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Explorer Backpack
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">
                    $129
                  </span>
                  <div className="flex text-amber-400 text-sm">★★★★☆</div>
                </div>
              </div>

              {/* Featured Product 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                <div className="w-16 h-16 bg-linear-to-br from-cyan-400 to-blue-400 rounded-2xl mb-4 flex items-center justify-center text-2xl">
                  👟
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Trail Hikers
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-cyan-600">$89</span>
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                </div>
              </div>

              {/* Featured Product 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="w-16 h-16 bg-linear-to-br from-teal-400 to-emerald-400 rounded-2xl mb-4 flex items-center justify-center text-2xl">
                  ⛺
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Alpine Tent
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-teal-600">$199</span>
                  <div className="flex text-amber-400 text-sm">★★★★☆</div>
                </div>
              </div>

              {/* Featured Product 4 */}
              <div className="bg-white rounded-2xl p-6 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 mt-8">
                <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-purple-400 rounded-2xl mb-4 flex items-center justify-center text-2xl">
                  🔦
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Night Explorer
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">$45</span>
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full opacity-50 animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-cyan-200 rounded-full opacity-50 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
