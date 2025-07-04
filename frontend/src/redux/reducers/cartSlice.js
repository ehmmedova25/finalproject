import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/cart/add", { productId, quantity });
      return res.data.cart.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Səbətə əlavə edilə bilmədi");
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/cart");
      return res.data.cart.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Səbət alınmadı");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/cart/update/${productId}`, { quantity });
      return res.data.cart.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Yenilənmə alınmadı");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/cart/${productId}`);
      return res.data.cart.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Silinmə alınmadı");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
  },
  extraReducers: (builder) => {
    const calculateTotalQuantity = (items) => {
      return items.reduce((total, item) => total + item.quantity, 0);
    };

    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.totalQuantity = calculateTotalQuantity(state.items);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.totalQuantity = calculateTotalQuantity(state.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.totalQuantity = calculateTotalQuantity(state.items);
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.totalQuantity = calculateTotalQuantity(state.items);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
