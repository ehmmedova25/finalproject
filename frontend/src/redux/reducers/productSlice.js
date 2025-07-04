import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const createProduct = createAsyncThunk(
  "products/create",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (filters = {}, thunkAPI) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`/products?${query}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rateProduct = createAsyncThunk(
  "products/rate",
  async ({ id, rating, comment }, thunkAPI) => {
    try {
      const res = await axios.post(
        `/products/${id}/rate`,
        { rating, comment }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  "products/fetchMyProducts",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/products/my");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await axios.put(
        `/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchLocations = createAsyncThunk(
  "products/fetchLocations",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/products/locations");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    myProducts: [],
    selectedProduct: null,
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.selectedProduct = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.myProducts = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.myProducts = state.myProducts.filter((p) => p._id !== action.payload);
      })

      .addCase(rateProduct.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        state.myProducts = state.myProducts.map((product) =>
          product._id === updated._id ? updated : product
        );
        if (state.selectedProduct && state.selectedProduct._id === updated._id) {
          state.selectedProduct = updated;
        }
      })

      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
