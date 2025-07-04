import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/admin/users");
      return res.data;
    } catch (err) {
      return rejectWithValue("İstifadəçilər alınmadı");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/user/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue("İstifadəçi silinmədi");
    }
  }
);

export const toggleUserBlock = createAsyncThunk(
  "admin/toggleUserBlock",
  async ({ userId, isBlocked, reason }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/admin/user/${userId}/block`, {
        isBlocked,
        reason
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Bloklama xətası");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleUserBlock.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
