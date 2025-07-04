import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const fetchFavorites = createAsyncThunk(
  "user/fetchFavorites",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get("/auth/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return rejectWithValue("Favoritlər alınmadı");
    }
  }
);

export const fetchToCookList = createAsyncThunk(
  "user/fetchToCookList",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get("/auth/to-cook", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return rejectWithValue("To-Cook list alınmadı");
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "user/toggleFavorite",
  async (recipeId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      await axios.post(`/auth/favorites/${recipeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return recipeId; 
    } catch {
      return rejectWithValue("Favori toggle alınmadı");
    }
  }
);

export const toggleToCook = createAsyncThunk(
  "user/toggleToCook",
  async (recipeId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      await axios.post(`/auth/to-cook/${recipeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return recipeId;
    } catch {
      return rejectWithValue("To-Cook toggle alınmadı");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    favorites: [],
    toCookList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.map((r) =>
          typeof r === "object" ? r._id : r
        );
        state.error = null;
      })
      .addCase(fetchToCookList.fulfilled, (state, action) => {
        state.toCookList = action.payload.map((r) =>
          typeof r === "object" ? r._id : r
        );
        state.error = null;
      })

      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const id = action.payload;
        if (state.favorites.includes(id)) {
          state.favorites = state.favorites.filter((x) => x !== id);
        } else {
          state.favorites.push(id);
        }
      })

      .addCase(toggleToCook.fulfilled, (state, action) => {
        const id = action.payload;
        if (state.toCookList.includes(id)) {
          state.toCookList = state.toCookList.filter((x) => x !== id);
        } else {
          state.toCookList.push(id);
        }
      });
  },
});

export default userSlice.reducer;
