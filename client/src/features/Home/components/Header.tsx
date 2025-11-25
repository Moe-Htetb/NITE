// Header.tsx
import { useState } from "react";
import { Link } from "react-router";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const categories = [
    {
      name: "Outdoor Gear",
      items: [
        "Backpacks",
        "Tents & Shelters",
        "Sleeping Bags",
        "Camping Furniture",
      ],
    },
    {
      name: "Hiking & Trekking",
      items: ["Hiking Boots", "Trekking Poles", "Navigation", "Hydration"],
    },
    {
      name: "Clothing",
      items: ["Jackets & Vests", "Base Layers", "Hiking Pants", "Footwear"],
    },
    {
      name: "Accessories",
      items: ["Headlamps", "Water Bottles", "Multi-tools", "First Aid"],
    },
  ];

  const userMenu = [
    { name: "My Profile", icon: "👤" },
    { name: "Orders", icon: "📦" },
    { name: "Wishlist", icon: "❤️" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <Link
              to={"/"}
              className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
            >
              WanderShop
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-emerald-600 font-medium transition duration-300"
            >
              Home
            </a>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition duration-300"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <span>Categories</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isCategoryOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  <div className="grid grid-cols-2 gap-6">
                    {categories.map((category, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                          {category.name}
                        </h3>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <a
                                href="#"
                                className="text-gray-600 hover:text-emerald-600 text-sm transition duration-300"
                              >
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href="#"
                      className="text-emerald-600 font-medium text-sm hover:text-emerald-700 transition duration-300"
                    >
                      View All Categories →
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#"
              className="text-gray-700 hover:text-emerald-600 font-medium transition duration-300"
            >
              Deals
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-emerald-600 font-medium transition duration-300"
            >
              New Arrivals
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-emerald-600 font-medium transition duration-300"
            >
              Stories
            </a>
          </nav>

          {/* Desktop Search and Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search gear & destinations..."
                className="pl-10 pr-4 py-2.5 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Wishlist */}
            <button className="relative p-2 text-gray-600 hover:text-emerald-600 transition duration-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Cart */}
            <button className="relative p-2 text-gray-600 hover:text-emerald-600 transition duration-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-linear-to-r from-emerald-500 to-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                3
              </span>
            </button>

            {/* User Account */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition duration-300"
                onClick={() => setIsUserOpen(!isUserOpen)}
              >
                <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JS</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                    isUserOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isUserOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800">John Smith</p>
                    <p className="text-sm text-gray-500">john@example.com</p>
                  </div>
                  <div className="py-2">
                    {userMenu.map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition duration-300"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <a
                      href="#"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-300"
                    >
                      <span className="text-lg">🚪</span>
                      <span>Sign Out</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <a
                href="#"
                className="block py-2 px-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition duration-300"
              >
                Home
              </a>

              {/* Mobile Categories Accordion */}
              <div className="border-b border-gray-100">
                <button
                  className="flex items-center justify-between w-full py-2 px-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition duration-300"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span>Categories</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div className="pl-6 pr-4 pb-2 space-y-1">
                    {categories
                      .flatMap((category) => category.items)
                      .map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition duration-300"
                        >
                          {item}
                        </a>
                      ))}
                  </div>
                )}
              </div>

              <a
                href="#"
                className="block py-2 px-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition duration-300"
              >
                Deals
              </a>
              <a
                href="#"
                className="block py-2 px-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition duration-300"
              >
                New Arrivals
              </a>
              <a
                href="#"
                className="block py-2 px-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition duration-300"
              >
                Stories
              </a>
            </nav>

            {/* Mobile User Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center space-x-4 px-4 py-2">
                <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JS</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">John Smith</p>
                  <p className="text-sm text-gray-500">View Profile</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition duration-300">
                  <span className="text-lg">👤</span>
                  <span className="text-xs mt-1">Profile</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition duration-300">
                  <span className="text-lg">📦</span>
                  <span className="text-xs mt-1">Orders</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition duration-300">
                  <span className="text-lg">❤️</span>
                  <span className="text-xs mt-1">Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
