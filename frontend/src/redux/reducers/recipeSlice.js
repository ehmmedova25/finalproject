import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecipes = createAsyncThunk('recipes/fetchAll', async () => {
  const res = await axios.get('http://localhost:5000/api/recipes');
  return res.data;
});

export const fetchMyRecipes = createAsyncThunk('recipes/fetchMine', async (_, thunkAPI) => {
  const token = localStorage.getItem('token');
  const res = await axios.get('http://localhost:5000/api/recipes/mine', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
        state.error = action.error.message;
      });
  },
});

export default recipeSlice.reducer;
