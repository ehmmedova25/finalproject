// 📁 redux/reducers/recipeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchAll",
  async ({ search = "", category = "All" }, thunkAPI) => {
    try {
      const query = `?search=${encodeURIComponent(search)}&category=${category}`;
      const res = await axiosInstance.get(`/recipes${query}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMyRecipes = createAsyncThunk("recipes/fetchMine", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/recipes/my");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createRecipe = createAsyncThunk("recipes/create", async (formData, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/recipes", formData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateRecipe = createAsyncThunk("recipes/update", async ({ id, updatedData }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/recipes/${id}`, updatedData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteRecipe = createAsyncThunk("recipes/delete", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/recipes/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getRecipeById = createAsyncThunk("recipes/getById", async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/recipes/${id}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const rateRecipe = createAsyncThunk("recipes/rate", async ({ id, rating, comment }, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/recipes/${id}/rate`, { rating, comment });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const likeRating = createAsyncThunk("recipes/likeRating", async ({ recipeId, ratingId }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/recipes/${recipeId}/rating/${ratingId}/like`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const replyToRating = createAsyncThunk("recipes/replyToRating", async ({ recipeId, ratingId, comment }, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/recipes/${recipeId}/rating/${ratingId}/reply`, { comment });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const dislikeRating = createAsyncThunk("recipes/dislikeRating", async ({ recipeId, ratingId }, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/recipes/${recipeId}/rating/${ratingId}/dislike`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    items: [],
    selectedRecipe: null,
    loading: false,
    error: null,
  },
  reducers: {
    addRating: (state, action) => {
      if (state.selectedRecipe) {
        state.selectedRecipe.ratings.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMyRecipes.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(getRecipeById.pending, (state) => {
        state.loading = true;
        state.selectedRecipe = null;
      })
      .addCase(getRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecipe = action.payload;
      })
      .addCase(getRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(rateRecipe.fulfilled, (state, action) => {
        state.selectedRecipe = action.payload;
      })
      .addCase(likeRating.fulfilled, (state, action) => {
        state.selectedRecipe = action.payload;
      })
      .addCase(dislikeRating.fulfilled, (state, action) => {
        state.selectedRecipe = action.payload;
      })
      .addCase(replyToRating.fulfilled, (state, action) => {
        state.selectedRecipe = action.payload;
      });
  },
});

export const { addRating } = recipeSlice.actions;
export default recipeSlice.reducer;
