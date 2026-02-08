import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const getCartFromStorage = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      return JSON.parse(cartData);
    }
  } catch (error) {
    console.error("Error loading cart from storage:", error);
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};

const initialState: CartState = {
  items: getCartFromStorage(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { product, quantity, selectedSize, selectedColor } = action.payload;

      // Check if product is in stock
      if (product.instock_count === 0) {
        return; // Don't add out-of-stock products
      }

      // Check if quantity exceeds available stock
      if (quantity > product.instock_count) {
        return; // Don't add if quantity exceeds stock
      }

      // Check if item already exists with same size and color
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor,
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        const newTotalQuantity = existingItem.quantity + quantity;

        // Check if total exceeds available stock
        if (newTotalQuantity <= product.instock_count) {
          // Update quantity if item exists and within stock limits
          state.items[existingItemIndex].quantity = newTotalQuantity;
        }
        // If exceeds stock, don't add more (could show toast here)
      } else {
        // Add new item
        state.items.push({
          product,
          quantity,
          selectedSize,
          selectedColor,
        });
      }

      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload,
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
        selectedSize?: string;
        selectedColor?: string;
      }>,
    ) => {
      const { productId, quantity, selectedSize, selectedColor } =
        action.payload;
      const item = state.items.find(
        (item) =>
          item.product._id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor,
      );

      if (item) {
        // Validate quantity against stock
        if (quantity <= 0) {
          state.items = state.items.filter(
            (cartItem) =>
              !(
                cartItem.product._id === productId &&
                cartItem.selectedSize === selectedSize &&
                cartItem.selectedColor === selectedColor
              ),
          );
        } else if (quantity <= item.product.instock_count) {
          // Only update if quantity doesn't exceed stock
          item.quantity = quantity;
        }
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => {
  return state.cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};
export const selectCartCount = (state: { cart: CartState }) => {
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};
export const selectIsCartOpen = (state: { cart: CartState }) =>
  state.cart.isOpen;

// Selector to get cart quantity for specific product variant
export const selectCartQuantityForVariant = (
  state: { cart: CartState },
  productId: string,
  selectedSize?: string,
  selectedColor?: string,
) => {
  const item = state.cart.items.find(
    (item) =>
      item.product._id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor,
  );
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;
