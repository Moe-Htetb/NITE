import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { Loader2, X, ArrowLeft, Check, Palette, Ruler } from "lucide-react";
import { toast } from "sonner";

import BreadCrumb from "@/components/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/rtk/productApi";
import type { Product } from "@/types/product";

type ProductUpdateValues = {
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
};

const categories = [
  "Clothing",
  "Electronics",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
];

// Enhanced color palette with more options
const colorPalette = [
  { name: "Black", value: "Black", hex: "#000000" },
  { name: "White", value: "White", hex: "#FFFFFF", border: true },
  { name: "Gray", value: "Gray", hex: "#6B7280" },
  { name: "Silver", value: "Silver", hex: "#9CA3AF" },
  { name: "Charcoal", value: "Charcoal", hex: "#374151" },
  { name: "Navy", value: "Navy", hex: "#1E3A8A" },
  { name: "Blue", value: "Blue", hex: "#3B82F6" },
  { name: "Red", value: "Red", hex: "#EF4444" },
  { name: "Green", value: "Green", hex: "#10B981" },
  { name: "Yellow", value: "Yellow", hex: "#FBBF24" },
  { name: "Purple", value: "Purple", hex: "#8B5CF6" },
  { name: "Pink", value: "Pink", hex: "#EC4899" },
  { name: "Brown", value: "Brown", hex: "#92400E" },
  { name: "Beige", value: "Beige", hex: "#D6D3D1" },
  { name: "Orange", value: "Orange", hex: "#F97316" },
  { name: "Teal", value: "Teal", hex: "#14B8A6" },
];

const sizeOptions = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
  { value: "3XL", label: "3XL" },
  { value: "4XL", label: "4XL" },
  { value: "ONE SIZE", label: "ONE SIZE" },
  { value: "28", label: "28" },
  { value: "30", label: "30" },
  { value: "32", label: "32" },
  { value: "34", label: "34" },
  { value: "36", label: "36" },
  { value: "38", label: "38" },
  { value: "40", label: "40" },
  { value: "42", label: "42" },
];

const ProductEditSection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Product["images"]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("");
  const [customSize, setCustomSize] = useState("");

  const {
    data,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductByIdQuery(id || "", { skip: !id });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<ProductUpdateValues>({
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

  // Initialize form with product data
  useEffect(() => {
    if (data?.product) {
      reset({
        name: data.product.name || "",
        description: data.product.description || "",
        category: data.product.category || "",
        price: data.product.price?.toString() || "",
        instock_count: data.product.instock_count?.toString() || "0",
        rating_count: data.product.rating_count?.toString() || "0",
        is_feature: data.product.is_feature || false,
        is_new_arrival: data.product.is_new_arrival || false,
        sizes: data.product.sizes || [],
        colors: data.product.colors || [],
      });
      setSelectedSizes(data.product.sizes || []);
      setSelectedColors(data.product.colors || []);
      setExistingImages(data.product.images || []);
    }
  }, [data, reset]);

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

  const handleAddCustomColor = () => {
    if (customColor.trim() && !selectedColors.includes(customColor.trim())) {
      const newColors = [...selectedColors, customColor.trim()];
      setSelectedColors(newColors);
      setValue("colors", newColors, { shouldValidate: true });
      setCustomColor("");
    }
  };

  const handleAddCustomSize = () => {
    if (
      customSize.trim() &&
      !selectedSizes.includes(customSize.trim().toUpperCase())
    ) {
      const newSizes = [...selectedSizes, customSize.trim().toUpperCase()];
      setSelectedSizes(newSizes);
      setValue("sizes", newSizes, { shouldValidate: true });
      setCustomSize("");
    }
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

  const removeNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (publicAlt: string) => {
    setImagesToDelete((prev) => [...prev, publicAlt]);
    setExistingImages((prev) =>
      prev.filter((img) => img.public_alt !== publicAlt),
    );
  };

  const restoreExistingImage = (publicAlt: string) => {
    const imageToRestore = data?.product.images.find(
      (img) => img.public_alt === publicAlt,
    );
    if (imageToRestore) {
      setImagesToDelete((prev) => prev.filter((alt) => alt !== publicAlt));
      setExistingImages((prev) => [...prev, imageToRestore]);
    }
  };

  const onSubmit = async (formDataValues: ProductUpdateValues) => {
    try {
      if (!id) {
        toast.error("Product ID is required");
        return;
      }

      if (existingImages.length === 0 && selectedFiles.length === 0) {
        toast.error("At least one image is required");
        return;
      }

      const formData = new FormData();

      // Append updated fields
      formData.append("name", formDataValues.name);
      formData.append("description", formDataValues.description);
      formData.append("category", formDataValues.category);
      formData.append("price", formDataValues.price);
      formData.append("instock_count", formDataValues.instock_count || "0");
      formData.append("rating_count", formDataValues.rating_count || "0");
      formData.append("is_feature", formDataValues.is_feature.toString());
      formData.append(
        "is_new_arrival",
        formDataValues.is_new_arrival.toString(),
      );

      // Stringify arrays
      formData.append("sizes", JSON.stringify(formDataValues.sizes));
      formData.append("colors", JSON.stringify(formDataValues.colors));

      // Append existing images that should be kept
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Add new image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Call the API mutation
      const result = await updateProduct({
        id,
        data: formData,
      }).unwrap();
      console.log(result);

      toast.success(result.message || "Product updated successfully!");

      // Navigate to product detail page
      navigate(`/dashboard/products/${id}`);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.data?.message || "Failed to update product");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/products");
  };

  const isFeature = watch("is_feature");
  const isNewArrival = watch("is_new_arrival");

  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (productError || !data?.product) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-black mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => navigate("/dashboard/products")}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/products")}
            className="mb-4 text-black hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <BreadCrumb
            currentPageTitle={`edit-product}`}
            links={[{ title: "Products", path: "/dashboard/products" }]}
          />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Edit Product</h1>
          <p className="text-gray-600">Update the product details below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-black">
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      {...register("name", {
                        required: "Product name is required",
                        minLength: {
                          value: 3,
                          message: "Product name must be at least 3 characters",
                        },
                      })}
                      placeholder="Enter product name"
                      className={errors.name ? "border-red-500" : ""}
                      disabled={isUpdating}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-black">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters",
                        },
                      })}
                      placeholder="Enter product description"
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                      disabled={isUpdating}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Field */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-black">
                        Category *
                      </Label>
                      <Select
                        onValueChange={(value) => setValue("category", value)}
                        defaultValue={data.product.category}
                        disabled={isUpdating}
                      >
                        <SelectTrigger
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-600">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    {/* Price Field */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-black">
                        Price *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">
                          $
                        </span>
                        <Input
                          id="price"
                          {...register("price", {
                            required: "Price is required",
                            pattern: {
                              value: /^\d+(\.\d{1,2})?$/,
                              message: "Enter a valid price (e.g., 19.99)",
                            },
                          })}
                          placeholder="0.00"
                          className={`pl-8 ${errors.price ? "border-red-500" : ""}`}
                          disabled={isUpdating}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-sm text-red-600">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div>
                        <Label className="text-black mb-4 block">
                          Current Images
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {existingImages.map((img) => {
                            const isMarkedForDelete = imagesToDelete.includes(
                              img.public_alt!,
                            );
                            return (
                              <div
                                key={img.public_alt}
                                className="relative group"
                              >
                                <div
                                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                                    isMarkedForDelete
                                      ? "border-red-500 opacity-50"
                                      : "border-gray-300"
                                  }`}
                                >
                                  <img
                                    src={img.url}
                                    alt="Product"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {!isUpdating && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant={
                                      isMarkedForDelete
                                        ? "default"
                                        : "destructive"
                                    }
                                    className={`absolute -top-2 -right-2 h-6 w-6 ${
                                      isMarkedForDelete
                                        ? "bg-green-600 hover:bg-green-700"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      isMarkedForDelete
                                        ? restoreExistingImage(img.public_alt!)
                                        : removeExistingImage(img.public_alt!)
                                    }
                                  >
                                    {isMarkedForDelete ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      <X className="h-3 w-3" />
                                    )}
                                  </Button>
                                )}
                                {isMarkedForDelete && (
                                  <div className="mt-2 text-xs text-green-600 text-center">
                                    Click to restore
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* New Images Upload */}
                    <div>
                      <Label className="text-black mb-4 block">
                        Add New Images
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isUpdating}
                        />
                        <Label
                          htmlFor="image-upload"
                          className={`cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg transition-all ${
                            isUpdating
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:border-black"
                          }`}
                        >
                          <span className="text-black">Choose Files</span>
                        </Label>
                        <p className="mt-4 text-gray-600">
                          PNG, JPG up to 5MB each
                        </p>
                      </div>
                    </div>

                    {/* New Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div>
                        <Label className="text-black mb-4 block">
                          New Images to Upload ({selectedFiles.length})
                        </Label>
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
                              {!isUpdating && (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={() => removeNewFile(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                              <p className="mt-2 text-xs text-gray-600 truncate">
                                {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {existingImages.length === 0 &&
                      selectedFiles.length === 0 && (
                        <p className="text-sm text-red-600">
                          At least one image is required
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar Sections */}
            <div className="lg:col-span-1 space-y-8">
              {/* Pricing & Inventory Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">
                    Pricing & Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stock Count Field */}
                  <div className="space-y-2">
                    <Label htmlFor="instock_count" className="text-black">
                      In Stock Count
                    </Label>
                    <Input
                      id="instock_count"
                      {...register("instock_count")}
                      type="number"
                      min="0"
                      placeholder="0"
                      disabled={isUpdating}
                    />
                  </div>

                  {/* Rating Count Field */}
                  <div className="space-y-2">
                    <Label htmlFor="rating_count" className="text-black">
                      Rating Count
                    </Label>
                    <Input
                      id="rating_count"
                      {...register("rating_count")}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0.0"
                      disabled={isUpdating}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Variants Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Variants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Colors Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-black font-medium">
                        <Palette className="inline mr-2 h-4 w-4" />
                        Colors
                      </Label>
                      <Badge variant="outline">
                        {selectedColors.length} selected
                      </Badge>
                    </div>

                    {/* Color Palette */}
                    <div className="grid grid-cols-5 gap-3 mb-6">
                      {colorPalette.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            !isUpdating && handleColorToggle(color.value)
                          }
                          disabled={isUpdating}
                          className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedColors.includes(color.value)
                              ? "border-black scale-110"
                              : color.border
                                ? "border-gray-300"
                                : "border-transparent"
                          } ${isUpdating ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {selectedColors.includes(color.value) && (
                            <Check className="h-5 w-5 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Color Input */}
                    <div className="space-y-3">
                      <Label className="text-sm text-gray-600">
                        Add custom color
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          placeholder="e.g., Midnight Blue"
                          disabled={isUpdating}
                          className="flex-1"
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAddCustomColor())
                          }
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddCustomColor}
                          disabled={!customColor.trim() || isUpdating}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Selected Colors */}
                    {selectedColors.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm text-gray-600 mb-2 block">
                          Selected Colors
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedColors.map((color) => {
                            const colorInfo = colorPalette.find(
                              (c) => c.value === color,
                            );
                            return (
                              <Badge
                                key={color}
                                variant="secondary"
                                className="flex items-center gap-2 pl-2 pr-3 py-1.5"
                              >
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      colorInfo?.hex || color.toLowerCase(),
                                    borderColor:
                                      colorInfo?.hex === "#FFFFFF"
                                        ? "#D1D5DB"
                                        : "transparent",
                                  }}
                                />
                                {color}
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-4 ml-1 hover:bg-transparent"
                                  onClick={() =>
                                    !isUpdating && handleColorToggle(color)
                                  }
                                  disabled={isUpdating}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    {/* Sizes Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-black font-medium">
                          <Ruler className="inline mr-2 h-4 w-4" />
                          Sizes
                        </Label>
                        <Badge variant="outline">
                          {selectedSizes.length} selected
                        </Badge>
                      </div>

                      {/* Size Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        {sizeOptions.map((size) => (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() =>
                              !isUpdating && handleSizeToggle(size.value)
                            }
                            disabled={isUpdating}
                            className={`py-3 rounded-lg border transition-all text-center ${
                              selectedSizes.includes(size.value)
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-gray-300 hover:border-black"
                            } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>

                      {/* Custom Size Input */}
                      <div className="space-y-3">
                        <Label className="text-sm text-gray-600">
                          Add custom size
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={customSize}
                            onChange={(e) => setCustomSize(e.target.value)}
                            placeholder="e.g., 42 or Custom"
                            disabled={isUpdating}
                            className="flex-1"
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), handleAddCustomSize())
                            }
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddCustomSize}
                            disabled={!customSize.trim() || isUpdating}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Selected Sizes */}
                      {selectedSizes.length > 0 && (
                        <div className="mt-4">
                          <Label className="text-sm text-gray-600 mb-2 block">
                            Selected Sizes
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedSizes.map((size) => (
                              <Badge
                                key={size}
                                variant="secondary"
                                className="pl-3 pr-3 py-1.5 flex items-center gap-2"
                              >
                                {size}
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-4 ml-1 hover:bg-transparent"
                                  onClick={() =>
                                    !isUpdating && handleSizeToggle(size)
                                  }
                                  disabled={isUpdating}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="is_feature"
                      checked={isFeature}
                      onCheckedChange={(checked) =>
                        setValue("is_feature", checked as boolean)
                      }
                      disabled={isUpdating}
                    />
                    <Label
                      htmlFor="is_feature"
                      className="text-black font-medium"
                    >
                      Feature Product
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="is_new_arrival"
                      checked={isNewArrival}
                      onCheckedChange={(checked) =>
                        setValue("is_new_arrival", checked as boolean)
                      }
                      disabled={isUpdating}
                    />
                    <Label
                      htmlFor="is_new_arrival"
                      className="text-black font-medium"
                    >
                      New Arrival
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
              className="text-black border-gray-300 hover:border-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isUpdating ||
                (existingImages.length === 0 && selectedFiles.length === 0)
              }
              className="bg-black text-white hover:bg-gray-900"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditSection;
