import { useState } from "react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";

const ProductSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data - replace with actual API data later
  const products = [
    {
      id: "1",
      name: "Product Name 1",
      category: "Category 1",
      price: 99.99,
      stock: 10,
      status: "active",
      isFeatured: true,
      isNewArrival: false,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Product Name 2",
      category: "Category 2",
      price: 149.99,
      stock: 5,
      status: "active",
      isFeatured: false,
      isNewArrival: true,
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Product Name 3",
      category: "Category 1",
      price: 79.99,
      stock: 0,
      status: "out_of_stock",
      isFeatured: false,
      isNewArrival: false,
      createdAt: "2024-01-10",
    },
  ];

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-white p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-black">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-black">Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory
          </p>
        </div>
      
      </div>

      {/* Search Bar */}
     
        <div className="flex justify-between items-center">
        <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products by name, category..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 border-gray-300 focus:border-black focus:ring-black"
            />
          </div>
          <Link to="/admin/products/add">
          <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
        </div>
     

      {/* Products Table */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black">
            All Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <Package className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-600">
                          {searchQuery
                            ? "No products found matching your search"
                            : "No products found"}
                        </p>
                        {!searchQuery && (
                          <Link to="/admin/products/add">
                            <Button
                              variant="outline"
                              className="border-gray-300 text-black hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Your First Product
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-black">
                              {product.name}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {product.isFeatured && (
                                <Badge className="bg-black text-white text-xs">
                                  Featured
                                </Badge>
                              )}
                              {product.isNewArrival && (
                                <Badge
                                  variant="outline"
                                  className="border-gray-300 text-gray-700 text-xs"
                                >
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-black">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {product.stock}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={
                            product.status === "active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {product.status === "active"
                            ? "In Stock"
                            : "Out of Stock"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
            {/* Left: Row per page selection */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            {/* Right: Pagination controls */}
            {totalPages > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsisBefore && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={
                              currentPage === page
                                ? "bg-black text-white hover:bg-gray-800"
                                : "border-gray-300 text-black hover:bg-gray-100"
                            }
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSection;
