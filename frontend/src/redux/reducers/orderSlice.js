import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/orders/all");
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Bütün sifarişlər alınmadı");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/orders/${id}/status`, { status });
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Status yenilənmədi");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/orders/my");
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Sifarişlər tapılmadı");
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  "orders/fetchSellerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/orders/seller");
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Satıcı sifarişləri tapılmadı");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],        
    myOrders: [],      
    sellerOrders: [],   
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  



      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerOrders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export default orderSlice.reducer;
