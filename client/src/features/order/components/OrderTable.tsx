import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, AlertCircle, Package } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/types/useRedux";
import {
  selectCartItems,
  updateQuantity,
  removeFromCart,
} from "@/store/cartSlice";
import { toast } from "sonner";

interface OrderTableProps {
  showValidationBanner?: boolean;
  compact?: boolean;
}

const OrderTable = ({
  showValidationBanner = true,
  compact = false,
}: OrderTableProps) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleQuantityChange = (
    productId: string,
    selectedSize: string | undefined,
    selectedColor: string | undefined,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(productId));
      toast.success("Item removed from cart");
      return;
    }

    setUpdatingId(productId);
    dispatch(
      updateQuantity({
        productId,
        quantity: newQuantity,
        selectedSize,
        selectedColor,
      }),
    );

    // Small delay to show loading state
    setTimeout(() => setUpdatingId(null), 300);
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  const handleRemoveAllIssues = () => {
    cartItems.forEach((item) => {
      if (
        item.product.instock_count === 0 ||
        item.quantity > item.product.instock_count
      ) {
        handleRemoveItem(item.product._id);
      }
    });
  };

  const hasStockIssues = cartItems.some(
    (item) =>
      item.product.instock_count === 0 ||
      item.quantity > item.product.instock_count,
  );

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Your order is empty
        </h3>
        <p className="text-gray-600 max-w-sm">
          Add some products to your cart to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>
        {hasStockIssues && (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-600 font-medium">
              Stock issues detected
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-900">
                Product
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Price
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Quantity
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                Total
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                {!compact && "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item) => {
              const isOutOfStock = item.product.instock_count === 0;
              const isLowStock =
                !isOutOfStock && item.quantity > item.product.instock_count;
              const isUpdating = updatingId === item.product._id;

              return (
                <TableRow
                  key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                  className={`group ${
                    isOutOfStock || isLowStock
                      ? "bg-red-50 hover:bg-red-100"
                      : "hover:bg-gray-50"
                  } ${isUpdating ? "opacity-70" : ""}`}
                >
                  {/* Product Info */}
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div
                        className={`${
                          compact ? "w-12 h-12" : "w-16 h-16"
                        } rounded-lg overflow-hidden bg-gray-100 shrink-0 relative`}
                      >
                        {item.product.images?.[0]?.url ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-lg">📦</span>
                          </div>
                        )}
                        {item.quantity > 1 && (
                          <div
                            className={`absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center ${
                              isOutOfStock || isLowStock
                                ? "bg-red-600 text-white"
                                : "bg-black text-white"
                            }`}
                          >
                            {item.quantity}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`font-medium truncate ${
                            isOutOfStock
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {item.product.name}
                        </p>
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex gap-2 mt-1.5">
                            {item.selectedSize && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  isOutOfStock || isLowStock
                                    ? "border-red-200 text-red-700"
                                    : ""
                                }`}
                              >
                                Size: {item.selectedSize}
                              </Badge>
                            )}
                            {item.selectedColor && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  isOutOfStock || isLowStock
                                    ? "border-red-200 text-red-700"
                                    : ""
                                }`}
                              >
                                Color: {item.selectedColor}
                              </Badge>
                            )}
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>Out of stock</span>
                          </div>
                        )}
                        {isLowStock && !isOutOfStock && (
                          <div className="flex items-center gap-1 mt-1.5 text-amber-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>
                              Only {item.product.instock_count} in stock
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <span
                      className={`font-medium ${
                        isOutOfStock ? "text-gray-500" : "text-gray-900"
                      }`}
                    >
                      ${item.product.price.toFixed(2)}
                    </span>
                  </TableCell>

                  {/* Quantity Controls */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center border rounded-lg ${
                          isOutOfStock || isLowStock
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 rounded-l-lg ${
                            isOutOfStock || isLowStock
                              ? "hover:bg-red-100 text-red-600"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1,
                            )
                          }
                          disabled={isOutOfStock || isUpdating}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            handleQuantityChange(
                              item.product._id,
                              item.selectedSize,
                              item.selectedColor,
                              newQuantity,
                            );
                          }}
                          className={`h-7 w-12 text-center border-x rounded-none text-sm ${
                            isOutOfStock || isLowStock
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          disabled={isOutOfStock || isUpdating}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 rounded-r-lg ${
                            isOutOfStock || isLowStock
                              ? "hover:bg-red-100 text-red-600"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1,
                            )
                          }
                          disabled={
                            isOutOfStock ||
                            isUpdating ||
                            item.quantity >= item.product.instock_count
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {!isOutOfStock && !compact && (
                        <span className="text-xs text-gray-500">
                          Max: {item.product.instock_count}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Total */}
                  <TableCell className="text-right">
                    <span
                      className={`font-semibold ${
                        isOutOfStock ? "text-gray-500" : "text-gray-900"
                      }`}
                    >
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  {!compact && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveItem(item.product._id)}
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Stock Validation Banner */}
        {showValidationBanner && hasStockIssues && (
          <div className="p-4 bg-red-50 border-t border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Stock issues detected
                </p>
                <p className="text-sm text-red-600">
                  Some items are out of stock or exceed available quantities.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-700 hover:text-red-900 hover:bg-red-100 whitespace-nowrap"
                onClick={handleRemoveAllIssues}
              >
                Remove All Issues
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
