import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/types/useRedux";
import {
  selectCartItems,
  selectCartTotal,
  selectIsCartOpen,
  closeCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/cartSlice";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"; // Removed X import
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CartSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const isOpen = useAppSelector(selectIsCartOpen);

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (
    productId: string,
    newQuantity: number,
    currentItem: (typeof items)[0],
  ) => {
    // Check stock before allowing quantity increase
    if (newQuantity > currentItem.quantity) {
      // User is trying to increase quantity
      const availableStock = currentItem.product.instock_count;

      // Calculate how many items are already in cart for this product variant
      const itemsInCartForVariant = items
        .filter(
          (item) =>
            item.product._id === productId &&
            item.selectedSize === currentItem.selectedSize &&
            item.selectedColor === currentItem.selectedColor,
        )
        .reduce((total, item) => total + item.quantity, 0);

      // Items already in cart minus current item quantity (since we're updating)
      const otherItemsInCart = itemsInCartForVariant - currentItem.quantity;

      // Maximum user can have = total stock - other items already in cart
      const maxAllowed = availableStock - otherItemsInCart;

      if (newQuantity > maxAllowed) {
        toast.error(`Only ${maxAllowed} items available in stock`);
        return;
      }
    }

    if (newQuantity <= 0) {
      handleRemove(productId);
    } else {
      dispatch(
        updateQuantity({
          productId,
          quantity: newQuantity,
          selectedSize: currentItem.selectedSize,
          selectedColor: currentItem.selectedColor,
        }),
      );
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate all items are still in stock before checkout
    const outOfStockItems = items.filter(
      (item) => item.product.instock_count === 0,
    );

    if (outOfStockItems.length > 0) {
      toast.error(
        "Some items in your cart are out of stock. Please remove them to continue.",
      );
      return;
    }

    // Validate quantities don't exceed stock
    const itemsExceedingStock = items.filter((item) => {
      // Calculate total items of this variant in cart
      const itemsInCartForVariant = items
        .filter(
          (cartItem) =>
            cartItem.product._id === item.product._id &&
            cartItem.selectedSize === item.selectedSize &&
            cartItem.selectedColor === item.selectedColor,
        )
        .reduce((total, cartItem) => total + cartItem.quantity, 0);

      return itemsInCartForVariant > item.product.instock_count;
    });

    if (itemsExceedingStock.length > 0) {
      toast.error(
        "Some items exceed available stock. Please adjust quantities.",
      );
      return;
    }

    dispatch(closeCart());
    navigate("/orders");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  // Helper function to get max allowed quantity for an item
  const getMaxQuantityForItem = (item: (typeof items)[0]) => {
    const availableStock = item.product.instock_count;

    // Calculate how many items are already in cart for this product variant
    const itemsInCartForVariant = items
      .filter(
        (cartItem) =>
          cartItem.product._id === item.product._id &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.selectedColor === item.selectedColor,
      )
      .reduce((total, cartItem) => total + cartItem.quantity, 0);

    // Items already in cart minus current item quantity
    const otherItemsInCart = itemsInCartForVariant - item.quantity;

    // Maximum user can have = total stock - other items already in cart
    return availableStock - otherItemsInCart;
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => !open && dispatch(closeCart())}
    >
      {/* Remove showCloseButton prop if it exists, or add showCloseButton={false} */}
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0"
        // Add showCloseButton={false} if your SheetContent component supports it
        // showCloseButton={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold text-gray-900">
                  Shopping Cart
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                </SheetTitle>
              </div>
              {/* Removed the duplicate X button */}
            </div>
          </SheetHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center py-16">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">😔</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6 max-w-xs">
                  Looks like you haven't added any products to your cart yet
                </p>
                <Button
                  onClick={() => {
                    dispatch(closeCart());
                    navigate("/products");
                  }}
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-medium"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => {
                  const maxQuantity = getMaxQuantityForItem(item);
                  const isOutOfStock = item.product.instock_count === 0;
                  const isExceedingStock = item.quantity > maxQuantity;

                  return (
                    <div
                      key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                      className={`p-6 transition-colors ${
                        isOutOfStock || isExceedingStock
                          ? "bg-red-50 hover:bg-red-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Stock Warning Banner */}
                      {(isOutOfStock || isExceedingStock) && (
                        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded-md">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 text-sm font-medium">
                              {isOutOfStock
                                ? "Out of stock"
                                : `Only ${maxQuantity} available`}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-red-700 hover:text-red-900 hover:bg-red-200 text-xs ml-auto"
                              onClick={() => handleRemove(item.product._id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 shrink-0">
                          <div
                            className={`w-full h-full rounded-xl overflow-hidden ${
                              isOutOfStock ? "opacity-50" : ""
                            }`}
                          >
                            {item.product.images &&
                            item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <span className="text-2xl">📦</span>
                              </div>
                            )}
                          </div>
                          {item.quantity > 1 && (
                            <div
                              className={`absolute -top-2 -left-2 w-6 h-6 text-xs rounded-full flex items-center justify-center ${
                                isOutOfStock || isExceedingStock
                                  ? "bg-red-600 text-white"
                                  : "bg-black text-white"
                              }`}
                            >
                              {item.quantity}
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3
                                className={`font-medium line-clamp-1 ${
                                  isOutOfStock
                                    ? "text-gray-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {item.product.name}
                              </h3>
                              <p
                                className={`text-lg font-semibold mt-1 ${
                                  isOutOfStock
                                    ? "text-gray-500"
                                    : "text-gray-900"
                                }`}
                              >
                                ${item.product.price.toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-lg hover:bg-red-50 ${
                                isOutOfStock || isExceedingStock
                                  ? "text-red-500 hover:text-red-700"
                                  : "text-gray-400 hover:text-red-600"
                              }`}
                              onClick={() => handleRemove(item.product._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Variants */}
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="flex gap-2 mb-3">
                              {item.selectedSize && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Color: {item.selectedColor}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Stock Info */}
                          <div className="mb-3">
                            <span
                              className={`text-sm ${
                                isOutOfStock ? "text-red-600" : "text-gray-600"
                              }`}
                            >
                              {isOutOfStock
                                ? "Out of stock"
                                : `${item.product.instock_count} in stock`}
                            </span>
                            {!isOutOfStock && item.quantity > maxQuantity && (
                              <span className="text-sm text-red-600 ml-2">
                                (Max: {maxQuantity})
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600 mr-2">
                                Qty:
                              </span>
                              <div
                                className={`flex items-center border rounded-lg ${
                                  isOutOfStock || isExceedingStock
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 rounded-l-lg ${
                                    isOutOfStock || isExceedingStock
                                      ? "hover:bg-red-100 text-red-600"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product._id,
                                      item.quantity - 1,
                                      item,
                                    )
                                  }
                                  disabled={isOutOfStock}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span
                                  className={`px-3 py-1 font-medium min-w-8 text-center border-x ${
                                    isOutOfStock || isExceedingStock
                                      ? "border-red-300 text-red-600"
                                      : "border-gray-300 text-gray-900"
                                  }`}
                                >
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 rounded-r-lg ${
                                    isOutOfStock || isExceedingStock
                                      ? "hover:bg-red-100 text-red-600"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product._id,
                                      item.quantity + 1,
                                      item,
                                    )
                                  }
                                  disabled={
                                    isOutOfStock || item.quantity >= maxQuantity
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <span
                              className={`font-medium ${
                                isOutOfStock ? "text-gray-500" : "text-gray-900"
                              }`}
                            >
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 bg-white p-6 space-y-6">
              {/* Stock Validation Summary */}
              {items.some(
                (item) =>
                  item.product.instock_count === 0 ||
                  item.quantity > getMaxQuantityForItem(item),
              ) && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 text-sm font-medium">
                      ⚠️ Some items need attention
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-red-700 hover:text-red-900 hover:bg-red-200 text-xs ml-auto"
                      onClick={() => {
                        // Remove out of stock items
                        items.forEach((item) => {
                          if (
                            item.product.instock_count === 0 ||
                            item.quantity > getMaxQuantityForItem(item)
                          ) {
                            handleRemove(item.product._id);
                          }
                        });
                      }}
                    >
                      Remove all
                    </Button>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    Calculated at checkout
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including tax and shipping
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-black text-white hover:bg-gray-900 py-3 rounded-lg font-medium text-base"
                  onClick={handleCheckout}
                  disabled={items.some(
                    (item) =>
                      item.product.instock_count === 0 ||
                      item.quantity > getMaxQuantityForItem(item),
                  )}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium"
                  onClick={handleClearCart}
                >
                  Clear All Items
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-3 rounded-lg font-medium"
                  onClick={() => {
                    dispatch(closeCart());
                    navigate("/products");
                  }}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
