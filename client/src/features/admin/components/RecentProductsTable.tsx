import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, Edit, Trash2, Plus } from "lucide-react";

const RecentProductsTable = () => {
  // Mock data - replace with actual data later
  const products = [
    {
      id: "1",
      name: "Product Name 1",
      category: "Category 1",
      price: "$99.99",
      stock: 10,
      status: "active",
      isFeatured: true,
      isNewArrival: false,
    },
    {
      id: "2",
      name: "Product Name 2",
      category: "Category 2",
      price: "$149.99",
      stock: 5,
      status: "active",
      isFeatured: false,
      isNewArrival: true,
    },
    {
      id: "3",
      name: "Product Name 3",
      category: "Category 1",
      price: "$79.99",
      stock: 0,
      status: "out_of_stock",
      isFeatured: false,
      isNewArrival: false,
    },
  ];

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-black">
              Recent Products
            </CardTitle>
            <CardDescription className="text-gray-600">
              Latest products added to your store
            </CardDescription>
          </div>
          <Button className="bg-black text-white hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Package className="h-12 w-12 text-gray-400" />
                      <p className="text-gray-600">No products found</p>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-black hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
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
                      {product.price}
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
      </CardContent>
    </Card>
  );
};

export default RecentProductsTable;
