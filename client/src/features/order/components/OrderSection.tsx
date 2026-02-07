import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft, CreditCard, ShoppingBag, Trash2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/types/useRedux";
import { selectCartItems, selectCartTotal, clearCart } from "@/store/cartSlice";
import { toast } from "sonner";
import OrderTable from "./OrderTable";

const OrderSection = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);

  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + tax;

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Check for out of stock items
    const outOfStockItems = cartItems.filter(
      (item) => item.product.instock_count === 0,
    );

    if (outOfStockItems.length > 0) {
      toast.error(
        "Some items in your cart are out of stock. Please remove them to continue.",
      );
      return;
    }

    // Check if quantities exceed stock
    const itemsExceedingStock = cartItems.filter(
      (item) => item.quantity > item.product.instock_count,
    );

    if (itemsExceedingStock.length > 0) {
      toast.error(
        "Some items exceed available stock. Please adjust quantities.",
      );
      return;
    }

    // Here you would integrate with Stripe
    toast.success("Proceeding to payment...");
    // navigate("/payment"); // Uncomment when payment page is ready
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl">Your cart is empty</CardTitle>
            <CardDescription>
              Add some products to your cart before proceeding to checkout
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Products Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Review and modify your order items below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable showValidationBanner={true} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Order Total</span>
                  <span className="text-2xl font-bold">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 py-6 text-base font-medium"
                onClick={handleProceedToPayment}
                size="lg"
                disabled={cartItems.some(
                  (item) =>
                    item.product.instock_count === 0 ||
                    item.quantity > item.product.instock_count,
                )}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Payment
              </Button>
            </CardFooter>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-gray-600 space-y-2">
                <p>• All prices include applicable taxes</p>
                <p>• Shipping costs are calculated based on your location</p>
                <p>
                  • You can modify quantities or remove items before payment
                </p>
                <p>• Payment will be processed securely via Stripe</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderSection;
