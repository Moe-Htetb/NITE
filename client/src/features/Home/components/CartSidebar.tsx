import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
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

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    dispatch(closeCart());
    navigate("/checkout");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && dispatch(closeCart())}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-black">
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">Your cart is empty</p>
                <p className="text-gray-500 text-sm">
                  Add some products to get started
                </p>
                <Button
                  onClick={() => {
                    dispatch(closeCart());
                    navigate("/products");
                  }}
                  className="mt-6 bg-black text-white hover:bg-gray-900"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-black mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        ${item.product.price.toFixed(2)}
                      </p>
                      {(item.selectedSize || item.selectedColor) && (
                        <div className="flex gap-2 mb-2">
                          {item.selectedSize && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-black">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-black">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-1 text-black font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemove(item.product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-black">Total:</span>
                <span className="text-2xl font-bold text-black">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-black text-black hover:bg-gray-100"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-900"
                  onClick={handleCheckout}
                >
                  Checkout
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
