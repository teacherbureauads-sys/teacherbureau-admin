import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;
// Async thunk to sign in a user
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_API_BASE_URL}/api/auth/login`,
        formData
      );
      const token = data?.token;
      Cookies.set("access_token", token, { expires: 7 });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Login failed!");
    }
  }
);

// Async thunk to fetch user details using token
export const fetchUserByToken = createAsyncThunk(
  "auth/fetchUserByToken",
  async (token, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");

    try {
      const { data } = await axios.get(
        `${BACKEND_API_BASE_URL}/api/auth/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  user: {
    fullName: null,
  },
  token: Cookies.get("token") || null,
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("access_token"); // Clear cookies
      state.user = {};
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
