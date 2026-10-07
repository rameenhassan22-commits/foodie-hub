import { configureStore } from "@reduxjs/toolkit";
import mealsReducer from "../features/meals/mealsSlice";
import cartReducer from "../features/cart/cartSlice";
import ordersReducer from "../features/orders/ordersSlice";

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});