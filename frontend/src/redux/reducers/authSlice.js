import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ Token yoxdur, istifadəçi yüklənmədi");
      return rejectWithValue("Token yoxdur, giriş icazəsi verilmir");
    }

    try {
      console.log("🔍 loadUser çağırılır...");
      const res = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ loadUser response:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ loadUser error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || "İstifadəçi yüklənmədi");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log("🔍 loginUser çağırılır:", { email });
      const res = await axiosInstance.post("/auth/login", { email, password });
      console.log("✅ loginUser response:", res.data);

      if (!res.data.token || !res.data.user) {
        console.error("❌ Token və ya user məlumatları yoxdur");
        return rejectWithValue("Server cavabında xəta var");
      }

      return res.data;
    } catch (err) {
      console.error("❌ loginUser error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || "Login xətası");
    }
  }
);

let userFromStorage = null;
const rawUser = localStorage.getItem("user");
try {
  if (rawUser && rawUser !== "undefined") {
    userFromStorage = JSON.parse(rawUser);
    console.log("📱 LocalStorage-dən user yükləndi:", userFromStorage);
  }
} catch (err) {
  console.error("❌ LocalStorage user parse error:", err);
  localStorage.removeItem("user");
}

const tokenFromStorage = localStorage.getItem("token") || null;
console.log("📱 LocalStorage-dən token:", tokenFromStorage ? "var" : "yox");

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage,
  loading: false,
  error: null,
};

console.log("🚀 Auth initial state:", initialState);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("✅ setUser reducer çağırılır:", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      console.log("🚪 logout reducer çağırılır");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        console.log("⏳ loadUser pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        console.log("✅ loadUser fulfilled:", action.payload);
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loadUser.rejected, (state, action) => {
        console.log("❌ loadUser rejected:", action.payload);
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(loginUser.pending, (state) => {
        console.log("⏳ loginUser pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("✅ loginUser fulfilled:", action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("❌ loginUser rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
