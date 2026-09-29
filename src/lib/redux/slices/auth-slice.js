import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ||
  process.env.BACKEND_API_BASE_URL;

const DEFAULT_SITE = "hometuitionacademy";

const getSelectedSite = () => {
  if (typeof window === "undefined") {
    return DEFAULT_SITE;
  }

  return (
    localStorage.getItem("selectedSite") ||
    DEFAULT_SITE
  );
};

// ================================
// LOGIN
// ================================
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (formData, { rejectWithValue }) => {
    try {
      const site = getSelectedSite();

      const { data } = await axios.post(
        `${BACKEND_API_BASE_URL}/api/auth/login`,
        formData,
        {
          headers: {
            "x-site": site,
          },
        }
      );

      const token = data?.token;

      if (token) {
        Cookies.set("access_token", token, {
          expires: 7,
        });
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Login failed!"
      );
    }
  }
);

// ================================
// FETCH USER
// ================================
export const fetchUserByToken = createAsyncThunk(
  "auth/fetchUserByToken",
  async (token, { rejectWithValue }) => {
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const site = getSelectedSite();

      const { data } = await axios.get(
        `${BACKEND_API_BASE_URL}/api/auth/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-site": site,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Unable to fetch user"
      );
    }
  }
);

// ================================
// INITIAL STATE
// ================================
const initialState = {
  user: {
    fullName: null,
  },

  token:
    typeof window !== "undefined"
      ? Cookies.get("access_token") || null
      : null,

  loading: false,
  error: null,
};

// ================================
// AUTH SLICE
// ================================
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      Cookies.remove("access_token");

      state.user = {};
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ============================
      // LOGIN
      // ============================
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;

        state.token =
          action.payload?.token || null;

        state.user =
          action.payload || {};
      })

      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // FETCH USER
      // ============================
      .addCase(fetchUserByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user =
          action.payload || {};
      })

      .addCase(fetchUserByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
