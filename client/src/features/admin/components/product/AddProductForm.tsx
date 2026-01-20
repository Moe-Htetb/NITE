import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { X, Loader2 } from "lucide-react";
import BreadCrumb from "@/components/BreadCrumb";
import type { ProductFormValues } from "@/types/product"; // Update import
import { useCreateProductMutation } from "@/store/rtk/productApi";
import { toast } from "sonner";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { productFormSchema } from "@/schema/product";

const categories = [
  "Clothing",
  "Electronics",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
];

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const availableColors = ["Black", "White", "Gray", "Silver", "Charcoal"];

const AddProductForm = () => {
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    // watch,
    reset,
  } = useForm<ProductFormValues>({
    // resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      instock_count: "0",
      rating_count: "0",
      is_feature: false,
      is_new_arrival: false,
      sizes: [],
      colors: [],
    },
  });
  // Watch the boolean values for checkboxes
  // const isFeature = watch("is_feature");
  // const isNewArrival = watch("is_new_arrival");

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSizes);
    setValue("sizes", newSizes, { shouldValidate: true });
  };

  const handleColorToggle = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(newColors);
    setValue("colors", newColors, { shouldValidate: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newUrls]);

    setTimeout(() => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    }, 1000);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (selectedFiles.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("instock_count", data.instock_count);
      formData.append("rating_count", data.rating_count);
      formData.append("is_feature", data.is_feature.toString());
      formData.append("is_new_arrival", data.is_new_arrival.toString());

      // Stringify arrays
      formData.append("sizes", JSON.stringify(data.sizes));
      formData.append("colors", JSON.stringify(data.colors));

      // Add image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Call the API mutation with FormData
      const result = await createProduct(formData).unwrap();

      toast.success(result.message || "Product created successfully!");

      // Reset form and clear all selections
      reset();
      setSelectedSizes([]);
      setSelectedColors([]);
      setSelectedFiles([]);
      setPreviewUrls([]);
      console.log(result.product);

      navigate(`/dashboard/products/${result.product._id}`);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.data.message);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/products");
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <BreadCrumb
        currentPageTitle="add-product"
        links={[{ title: "Products", path: "/dashboard/products" }]}
      />
      <div className="max-w-7xl mx-auto mt-4">
        <h1 className="text-3xl font-bold mb-2 text-black">
          Create New Product
        </h1>
        <p className="text-gray-600 mb-8">
          Fill in the details below to add a new product
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6 text-black">
                  Basic Information
                </h2>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2 text-black"
                    >
                      Product Name *
                    </label>
                    <input
                      id="name"
                      {...register("name", {
                        required: "Product name is required",
                        minLength: {
                          value: 3,
                          message: "Product name must be at least 3 characters",
                        },
                      })}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter product name"
                      disabled={isCreating}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-2 text-black"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters",
                        },
                      })}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter product description"
                      disabled={isCreating}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Category and Price Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Field */}
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium mb-2 text-black"
                      >
                        Category *
                      </label>
                      <select
                        id="category"
                        {...register("category", {
                          required: "Category is required",
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={isCreating}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    {/* Price Field */}
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium mb-2 text-black"
                      >
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">
                          $
                        </span>
                        <input
                          id="price"
                          {...register("price", {
                            required: "Price is required",
                            pattern: {
                              value: /^\d+(\.\d{1,2})?$/,
                              message: "Enter a valid price (e.g., 19.99)",
                            },
                            min: {
                              value: 0.01,
                              message: "Price must be greater than 0",
                            },
                          })}
                          type="text"
                          className={`w-full pl-8 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                            errors.price ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="0.00"
                          disabled={isCreating}
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6 text-black">
                  Product Images
                </h2>

                <div>
                  <label className="block text-sm font-medium mb-4 text-black">
                    Upload Images *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isCreating}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg transition-all ${
                        isCreating
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-black"
                      }`}
                    >
                      <span className="text-black">Choose Files</span>
                    </label>
                    <p className="mt-4 text-gray-600">
                      PNG, JPG up to 5MB each
                    </p>
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-4 text-black">
                        Selected Images ({selectedFiles.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-300">
                              <img
                                src={
                                  previewUrls[index] ||
                                  URL.createObjectURL(file)
                                }
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {!isCreating && (
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                            )}
                            <p className="mt-2 text-xs text-gray-600 truncate">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedFiles.length === 0 && !isCreating && (
                    <p className="mt-4 text-sm text-red-600">
                      Please upload at least one image
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Sections */}
            <div className="lg:col-span-1 space-y-8">
              {/* Pricing & Inventory Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6 text-black">
                  Pricing & Inventory
                </h2>

                <div className="space-y-6">
                  {/* Stock Count Field */}
                  <div>
                    <label
                      htmlFor="instock_count"
                      className="block text-sm font-medium mb-2 text-black"
                    >
                      In Stock Count
                    </label>
                    <input
                      id="instock_count"
                      {...register("instock_count", {
                        min: {
                          value: 0,
                          message: "Stock count cannot be negative",
                        },
                      })}
                      type="number"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="0"
                      disabled={isCreating}
                    />
                    {errors.instock_count && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.instock_count.message}
                      </p>
                    )}
                  </div>

                  {/* Rating Count Field */}
                  <div>
                    <label
                      htmlFor="rating_count"
                      className="block text-sm font-medium mb-2 text-black"
                    >
                      Rating Count
                    </label>
                    <input
                      id="rating_count"
                      {...register("rating_count", {
                        min: {
                          value: 0,
                          message: "Rating count cannot be negative",
                        },
                      })}
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="0.0"
                      disabled={isCreating}
                    />
                    {errors.rating_count && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.rating_count.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6 text-black">
                  Variants
                </h2>

                {/* Sizes */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-4 text-black">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        disabled={isCreating}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedSizes.includes(size)
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-black"
                        } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...register("sizes")} />
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium mb-4 text-black">
                    Available Colors
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        disabled={isCreating}
                        className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                          selectedColors.includes(color)
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-black"
                        } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  <input type="hidden" {...register("colors")} />
                </div>
              </div>

              {/* Features Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6 text-black">
                  Features
                </h2>

                <div className="space-y-4">
                  {/* Feature Product */}
                  <label
                    className={`flex items-center space-x-3 ${isCreating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      {...register("is_feature")}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                      disabled={isCreating}
                    />
                    <span className="text-black font-medium">
                      Feature Product
                    </span>
                  </label>

                  {/* New Arrival */}
                  <label
                    className={`flex items-center space-x-3 ${isCreating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      {...register("is_new_arrival")}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                      disabled={isCreating}
                    />
                    <span className="text-black font-medium">New Arrival</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCreating}
              className="px-6 py-3 border border-gray-300 rounded-lg text-black hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || selectedFiles.length === 0}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-35"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddProductForm;
