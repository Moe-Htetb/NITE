import { useGetProductByIdQuery } from "@/store/rtk/productApi";
import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
import BreadCrumb from "@/components/BreadCrumb";

const ProductDetailSection = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(id!);
  console.log(data?.product);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !data?.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-gray-300 bg-white">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-800">
              Product not found or error loading product details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadCrumb
        currentPageTitle="product-detail"
        links={[{ title: "Products", path: "/dashboard/products" }]}
      />
      <Card className="border border-gray-300 mt-5 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {data?.product.name}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {data?.product.category}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {data?.product.is_feature && (
                <Badge
                  variant="secondary"
                  className="bg-black text-white px-3 py-1"
                >
                  Featured
                </Badge>
              )}
              {data?.product.is_new_arrival && (
                <Badge
                  variant="outline"
                  className="border-gray-800 text-gray-800 px-3 py-1"
                >
                  New Arrival
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-gray-300" />

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* data?.product.Images */}
            <div>
              {data?.product.images && data?.product.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-lg border border-gray-300">
                    <img
                      src={data?.product.images[0].url}
                      alt={
                        data?.product.images[0].public_alt || data?.product.name
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {data?.product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {data?.product.images.slice(1).map((image) => (
                        <div
                          key={image._id}
                          className="aspect-square overflow-hidden rounded border border-gray-300"
                        >
                          <img
                            src={image.url}
                            alt={image.public_alt || data?.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>

            {/* data?.product.Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {data?.product.description}
                </p>
              </div>

              <Separator className="bg-gray-300" />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Price</h4>
                  <p className="text-2xl font-bold text-gray-900">
                    ${data?.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Stock</h4>
                  <p
                    className={`text-xl font-semibold ${data?.product.instock_count > 0 ? "text-gray-900" : "text-gray-500"}`}
                  >
                    {data?.product.instock_count} units available
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-300" />

              {/* Colors */}
              {data?.product.colors && data?.product.colors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Available Colors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data?.product.colors.map((color, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-gray-800 text-gray-800 px-3 py-1"
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {data?.product.sizes && data?.product.sizes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {data?.product.sizes.map((size, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-gray-800 text-gray-800 px-3 py-1"
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* data?.product.Info */}
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>data?.product.ID:</span>
                  <span className="font-mono text-gray-800">
                    {data?.product._id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rating Count:</span>
                  <span className="text-gray-800">
                    {data?.product.rating_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-gray-800">
                    {new Date(data?.product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="text-gray-800">
                    {new Date(data?.product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Skeleton Loading Component

export default ProductDetailSection;
