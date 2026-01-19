// product-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import BreadCrumb from "@/components/BreadCrumb";

// Zod schema with explicit default values
const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
  instock_count: z.string().default("0"),
  rating_count: z.string().default("0"),
  is_feature: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  images: z.instanceof(FileList).optional(),
});

// Type inference for the form
type ProductFormValues = {
  name: string;
  description: string;
  category: string;
  price: string;
  instock_count: string;
  rating_count: string;
  is_feature: boolean;
  is_new_arrival: boolean;
  sizes: string[];
  colors: string[];
  images?: FileList;
};

// Mock data
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
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
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
  const isFeature = watch("is_feature");
  const isNewArrival = watch("is_new_arrival");

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

    // Clean up old URLs to prevent memory leaks
    setTimeout(() => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    }, 1000);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    try {
      console.log("Form Data:", data);
      console.log("Selected Files:", selectedFiles);

      // Prepare FormData for API submission
      const formData = new FormData();

      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "images") return;

        if (Array.isArray(value)) {
          // For arrays (sizes, colors), stringify them
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "boolean") {
          // For booleans, convert to string
          formData.append(key, value.toString());
        } else if (value !== undefined) {
          // For strings
          formData.append(key, "");
        }
      });

      // Add image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Here you would call your API
      // await createProduct(formData);

      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      alert("Product submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting product");
    }
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
                      {...register("name")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter product name"
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
                      {...register("description")}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter product description"
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
                        {...register("category")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
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
                          {...register("price")}
                          type="text"
                          className={`w-full pl-8 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                            errors.price ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="0.00"
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
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:border-black transition-all"
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
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                            <p className="mt-2 text-xs text-gray-600 truncate">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
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
                      {...register("instock_count")}
                      type="number"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="0"
                    />
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
                      {...register("rating_count")}
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="0.0"
                    />
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
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedSizes.includes(size)
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-black"
                        }`}
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
                        className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                          selectedColors.includes(color)
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
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("is_feature")}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-black font-medium">
                      Feature Product
                    </span>
                  </label>

                  {/* New Arrival */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("is_new_arrival")}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
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
              className="px-6 py-3 border border-gray-300 rounded-lg text-black hover:border-black transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddProductForm;
