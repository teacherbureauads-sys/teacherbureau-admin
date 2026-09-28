"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

// GET ALL (paginated + optional search)
export const fetchPages = createAsyncThunk(
  "pages/fetchAll",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_API_BASE_URL}/api/page`, {
        params: { page, limit, search },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch pages"
      );
    }
  }
);

// GET BY ID (MongoDB ObjectId)
export const fetchPageById = createAsyncThunk(
  "pages/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_API_BASE_URL}/api/page/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch page"
      );
    }
  }
);

// CREATE or UPDATE (dynamic method based on presence of _id)
export const upsertPage = createAsyncThunk(
  "pages/upsert",
  async (payload, { rejectWithValue }) => {
    try {
      const hasId = Boolean(payload._id);
      const endpoint = hasId
        ? `${BACKEND_API_BASE_URL}/api/page/${payload._id}`
        : "/api/page";
      const method = hasId ? "put" : "post";

      const res = await axios.request({
        url: endpoint,
        method,
        data: payload,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to save page"
      );
    }
  }
);

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
      // fetchPages
      .addCase(fetchPages.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.pageList = action.payload.docs;
        state.documentCount = action.payload.total;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload || "Failed to fetch pages";
      })

      // fetchPageById
      .addCase(fetchPageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePageDetails = action.payload;
      })
      .addCase(fetchPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch page";
      })

      // upsertPage
      .addCase(upsertPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertPage.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePageDetails = action.payload;
      })
      .addCase(upsertPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save page";
      });
  },
});

export const { clearSinglePage } = pageSlice.actions;
export default pageSlice.reducer;
