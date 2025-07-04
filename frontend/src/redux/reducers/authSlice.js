import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/auth/me");
      return res.data;
    } catch (err) {
      return rejectWithValue("İstifadəçi yüklənmədi");
    }
  }
);

let userFromStorage = null;
const rawUser = localStorage.getItem("user");
try {
  if (rawUser && rawUser !== "undefined") {
    userFromStorage = JSON.parse(rawUser);
  }
} catch {
  localStorage.removeItem("user");
}

const tokenFromStorage = localStorage.getItem("token") || null;

// ✅ İlkin state
const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage,
  loading: false,
  error: null,
};

// ✅ Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
