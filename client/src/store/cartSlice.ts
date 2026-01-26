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
      
      // Check if item already exists with same size and color
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
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
      state.items = state.items.filter((item) => item.product._id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product._id === action.payload.productId
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.product._id !== action.payload.productId
          );
        } else {
          item.quantity = action.payload.quantity;
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
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isOpen;

export default cartSlice.reducer;
