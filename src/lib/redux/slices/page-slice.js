"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_API_BASE_URL =
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

const getHeaders = (token) => ({
  ...(token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}),
  "x-site": getSelectedSite(),
});

// =====================================================
// GET ALL PAGES
// =====================================================
export const fetchPages = createAsyncThunk(
  "pages/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      token,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BACKEND_API_BASE_URL}/api/page`,
        {
          params: {
            page,
            limit,
            search,
          },
          headers: getHeaders(token),
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch pages"
      );
    }
  }
);

// =====================================================
// GET PAGE BY ID
// =====================================================
export const fetchPageById = createAsyncThunk(
  "pages/fetchById",
  async (
    { id, token },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BACKEND_API_BASE_URL}/api/page/${id}`,
        {
          headers: getHeaders(token),
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch page"
      );
    }
  }
);

// =====================================================
// CREATE / UPDATE PAGE
// =====================================================
export const upsertPage = createAsyncThunk(
  "pages/upsert",
  async (
    payload,
    { rejectWithValue }
  ) => {
    try {
      const hasId = Boolean(payload._id);

      const endpoint = hasId
        ? `${BACKEND_API_BASE_URL}/api/page/${payload._id}`
        : `${BACKEND_API_BASE_URL}/api/page`;

      const method = hasId
        ? "put"
        : "post";

      const token = payload.token;

      // token ko request body mein nahi bhejna
      const { token: _token, ...pageData } =
        payload;

      const res = await axios.request({
        url: endpoint,
        method,
        data: pageData,
        headers: getHeaders(token),
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to save page"
      );
    }
  }
);

// =====================================================
// PAGE SLICE
// =====================================================
const pageSlice = createSlice({
  name: "pages",

  initialState: {
    loading: false,
    dataLoading: true,
    pageList: [],
    singlePageDetails: {},
    documentCount: 0,
    error: null,
  },

  reducers: {
    clearSinglePage(state) {
      state.singlePageDetails = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // FETCH ALL PAGES
      // =================================================
      .addCase(
        fetchPages.pending,
        (state) => {
          state.dataLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchPages.fulfilled,
        (state, action) => {
          state.dataLoading = false;

          state.pageList =
            action.payload?.docs || [];

          state.documentCount =
            action.payload?.total || 0;
        }
      )

      .addCase(
        fetchPages.rejected,
        (state, action) => {
          state.dataLoading = false;

          state.error =
            action.payload ||
            "Failed to fetch pages";
        }
      )

      // =================================================
      // FETCH PAGE BY ID
      // =================================================
      .addCase(
        fetchPageById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchPageById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.singlePageDetails =
            action.payload;
        }
      )

      .addCase(
        fetchPageById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch page";
        }
      )

      // =================================================
      // CREATE / UPDATE PAGE
      // =================================================
      .addCase(
        upsertPage.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        upsertPage.fulfilled,
        (state, action) => {
          state.loading = false;

          state.singlePageDetails =
            action.payload;

          const updatedPage =
            action.payload;

          if (!updatedPage?._id) {
            return;
          }

          const existingIndex =
            state.pageList.findIndex(
              (page) =>
                page._id ===
                updatedPage._id
            );

          if (existingIndex === -1) {
            state.pageList.unshift(
              updatedPage
            );
          } else {
            state.pageList[
              existingIndex
            ] = updatedPage;
          }
        }
      )

      .addCase(
        upsertPage.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to save page";
        }
      );
  },
});

export const {
  clearSinglePage,
} = pageSlice.actions;

export default pageSlice.reducer;
