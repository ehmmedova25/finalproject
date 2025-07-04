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
      console.log("🔍 Rating data being sent:", { id, rating, comment });
      
      const res = await axios.post(
        `/products/${id}/rate`,
        { 
          rating: Number(rating), 
          comment: comment.trim() 
        }
      );
      
      console.log("✅ Rating response:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Rating error:", err.response?.data || err.message);
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

export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilar",
  async ({ categoryId, productId, limit = 4 }, thunkAPI) => {
    try {
      const res = await axios.get(`/products/similar/${productId}`, {
        params: { categoryId, limit }
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async ({ categoryName }, thunkAPI) => {
    try {
      const res = await axios.get(`/products/category/${categoryName}`);
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
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await axios.put(`/products/${id}`, updatedData);
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

// Ən çox satılanları gətirmək
export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/products/best-sellers");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchBestSellersHome = createAsyncThunk(
  "products/fetchBestSellersHome",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/products/best-sellers-home");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const likeProductRating = createAsyncThunk(
  "products/likeRating",
  async ({ productId, ratingId }, thunkAPI) => {
    try {
      if (!productId || !ratingId) {
        return thunkAPI.rejectWithValue("Product ID və ya Rating ID boşdur");
      }
      
      const res = await axios.put(`/products/${productId}/rating/${ratingId}/like`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const dislikeProductRating = createAsyncThunk(
  "products/dislikeRating",
  async ({ productId, ratingId }, thunkAPI) => {
    try {
      if (!productId || !ratingId) {
        return thunkAPI.rejectWithValue("Product ID və ya Rating ID boşdur");
      }
      
      const res = await axios.put(`/products/${productId}/rating/${ratingId}/dislike`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const replyToProductRating = createAsyncThunk(
  "products/replyToRating",
  async ({ productId, ratingId, comment }, thunkAPI) => {
    try {
      if (!productId || !ratingId || !comment?.trim()) {
        return thunkAPI.rejectWithValue("Lazımi parametrlər boşdur");
      }
      
      const res = await axios.post(`/products/${productId}/rating/${ratingId}/reply`, { comment });
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
    similarProducts: [],
    bestSellers: [],
    bestSellersHome: [],
    categoryProducts: [],
    locations: [],
    loading: false,
    similarLoading: false,
    bestSellersLoading: false,
    categoryLoading: false,
    error: null,
  },
  reducers: {
    clearSimilarProducts: (state) => {
      state.similarProducts = [];
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.myProducts.push(action.payload);
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
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSimilarProducts.pending, (state) => {
        state.similarLoading = true;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.similarLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductsByCategory.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categoryProducts = action.payload.products || [];
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts = action.payload;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts = state.myProducts.filter((p) => p._id !== action.payload);
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

ğ      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        
        state.myProducts = state.myProducts.map((product) =>
          product._id === updated._id ? updated : product
        );
        
        state.items = state.items.map((product) =>
          product._id === updated._id ? updated : product
        );
        
        if (state.selectedProduct && state.selectedProduct._id === updated._id) {
          state.selectedProduct = updated;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    .addCase(rateProduct.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(rateProduct.fulfilled, (state, action) => {
  state.loading = false;
  if (action.payload.product) {
    state.selectedProduct = action.payload.product;
  }
  else if (state.selectedProduct && action.payload.newRating) {
    state.selectedProduct.ratings.push(action.payload.newRating);
  }
})
.addCase(rateProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBestSellers.pending, (state) => {
        state.bestSellersLoading = true;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.bestSellersLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchBestSellersHome.pending, (state) => {
        state.bestSellersLoading = true;
      })
      .addCase(fetchBestSellersHome.fulfilled, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellersHome = action.payload;
      })
      .addCase(fetchBestSellersHome.rejected, (state, action) => {
        state.bestSellersLoading = false;
        state.error = action.payload;
      })

      .addCase(likeProductRating.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(likeProductRating.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(dislikeProductRating.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(dislikeProductRating.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(replyToProductRating.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(replyToProductRating.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  clearSimilarProducts, 
  clearSelectedProduct, 
  clearError, 
  clearCategoryProducts 
} = productSlice.actions;

export default productSlice.reducer;
