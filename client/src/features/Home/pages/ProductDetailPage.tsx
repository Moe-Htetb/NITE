import { useParams, useNavigate } from "react-router";
import { useGetProductByIdQuery } from "@/store/rtk/productApi";
import { useAppDispatch } from "@/types/useRedux";
import { addToCart } from "@/store/cartSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data, isLoading, error } = useGetProductByIdQuery(id || "");

  const handleAddToCart = () => {
    if (!data?.product) return;

    if (data.product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (data.product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    dispatch(
      addToCart({
        product: data.product,
        quantity,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined,
      })
    );
    toast.success(`${data.product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-700">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">Product not found</p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-black text-white hover:bg-gray-900"
            >
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const product = data.product;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-black hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]?.url || product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  📦
                </div>
              )}
            </div>
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-50 rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                      selectedImageIndex === index
                        ? "border-black ring-2 ring-black ring-offset-2"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className={`w-full h-full object-cover ${
                        selectedImageIndex === index ? "opacity-100" : "opacity-70 hover:opacity-100"
                      } transition-opacity`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.is_feature && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
                  FEATURED
                </span>
              )}
              {product.is_new_arrival && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
                  NEW ARRIVAL
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-black">{product.name}</h1>

            {/* Rating */}
            {product.rating_count > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(product.rating_count)
                          ? "text-black"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">({product.rating_count.toFixed(1)})</span>
              </div>
            )}

            {/* Price */}
            <div className="text-4xl font-bold text-black">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all flex items-center gap-2 ${
                        selectedColor === color
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:border-black"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: color.toLowerCase(),
                        }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-2 text-black font-medium text-lg min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-gray-600">
                  {product.instock_count > 0
                    ? `${product.instock_count} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.instock_count === 0}
                className="flex-1 bg-black text-white hover:bg-gray-900 h-14 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t-2 border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-3">Product Details</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Category:</span> {product.category}
                </p>
                <p>
                  <span className="font-medium">Stock:</span> {product.instock_count} units
                </p>
                {product.sizes && product.sizes.length > 0 && (
                  <p>
                    <span className="font-medium">Available Sizes:</span>{" "}
                    {product.sizes.join(", ")}
                  </p>
                )}
                {product.colors && product.colors.length > 0 && (
                  <p>
                    <span className="font-medium">Available Colors:</span>{" "}
                    {product.colors.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
