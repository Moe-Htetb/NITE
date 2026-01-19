import type { Product } from "@/types/product";
import { Edit, Eye, Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDeleteProductMutation } from "@/store/rtk/productApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ProductRowProps {
  product: Product;
}

const ProductRow = ({ product }: ProductRowProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleDeleteClick = () => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete._id).unwrap();
      toast.success("Product deleted successfully");
      // Success - dialog will close automatically
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      toast.error(
        err?.data?.message || "Failed to delete product. Please try again.",
      );
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Get the first image from the images array
  const productImage =
    product.images && product.images.length > 0 ? product.images[0].url : null;

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product{" "}
              <span className="font-semibold">{productToDelete?.name}</span> and
              remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <tr
        key={product._id}
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <td className="py-4 px-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 bg-gray-100">
              {productImage && !imgError ? (
                <img
                  src={productImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-black">{product.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                {product.is_feature && (
                  <Badge className="bg-black text-white text-xs">
                    Featured
                  </Badge>
                )}
                {product.is_new_arrival && (
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
        <td className="py-4 px-4 text-sm text-gray-600">{product.category}</td>
        <td className="py-4 px-4 text-sm font-semibold text-black">
          ${product.price.toFixed(2)}
        </td>
        <td className="py-4 px-4 text-sm text-gray-600">
          {product.instock_count}
        </td>
        <td className="py-4 px-4">
          <Badge
            className={
              product.instock_count > 0
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
            }
          >
            {product.instock_count > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center space-x-2">
            <Link to={`/dashboard/products/${product._id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="View"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Button>
            </Link>
            <Link to={`/dashboard/products/edit/${product._id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="Edit"
              >
                <Edit className="h-4 w-4 text-gray-600" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50"
              onClick={handleDeleteClick}
              title="Delete"
              disabled={isDeleting}
            >
              {isDeleting && productToDelete?._id === product._id ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              ) : (
                <Trash2 className="h-4 w-4 text-red-600" />
              )}
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ProductRow;
