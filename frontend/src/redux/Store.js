import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import recipeReducer from "./reducers/recipeSlice";
import userReducer from "./reducers/userSlice"; // 🆕
import productsReducer from "./reducers/productSlice";
import cartReducer from "./reducers/cartSlice";
import checkoutReducer from "./reducers/checkoutSlice";
import orderReducer from "./reducers/orderSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
    user: userReducer,  
    products: productsReducer, 
    cart: cartReducer, 
  checkout: checkoutReducer,
   orders: orderReducer,
  },
});

export default store;

