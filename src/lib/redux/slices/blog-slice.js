import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

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
  Authorization: `Bearer ${token}`,
  "x-site": getSelectedSite(),
});

// =====================================================
// CREATE / UPDATE BLOG
// =====================================================
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogInput, { rejectWithValue }) => {
    const { token, blogData, blogId } = blogInput;

    const endPoint = blogId
      ? `${BACKEND_API_BASE_URL}/api/blog/${blogId}`
      : `${BACKEND_API_BASE_URL}/api/blog`;

    try {
      const response = await axios({
        method: blogId ? "PUT" : "POST",
        url: endPoint,
        data: blogData,
        headers: getHeaders(token),
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create blog."
      );
    }
  }
);

// =====================================================
// FETCH ALL BLOGS
// =====================================================
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (option, { rejectWithValue }) => {
    const { token, filters } = option;

    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/blog`,
        headers: getHeaders(token),
        params: {
          ...filters,
        },
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch blogs."
      );
    }
  }
);

// =====================================================
// FETCH SINGLE BLOG
// =====================================================
export const fetchSingleBlog = createAsyncThunk(
  "blog/fetchSingleBlog",
  async (option, { rejectWithValue }) => {
    const { token, blogId } = option;

    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/blog/${blogId}`,
        headers: getHeaders(token),
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch blog."
      );
    }
  }
);

// =====================================================
// DELETE BLOG
// =====================================================
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (option, { rejectWithValue }) => {
    const { token, blogId } = option;

    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/admin/blog/${blogId}`,
        headers: getHeaders(token),
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete blog."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  blogList: [],
  singleBlog: {},
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// =====================================================
// BLOG SLICE
// =====================================================
const blogSlice = createSlice({
  name: "blog",

  initialState,

  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // CREATE BLOG
      // =================================================
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createBlog.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =================================================
      // FETCH BLOGS
      // =================================================
      .addCase(fetchBlogs.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(fetchBlogs.fulfilled, (state, action) => {
        const { data, count } = action.payload || {};

        state.dataLoading = false;
        state.blogList = data || [];
        state.documentCount = count || 0;
      })

      .addCase(fetchBlogs.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // =================================================
      // FETCH SINGLE BLOG
      // =================================================
      .addCase(fetchSingleBlog.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(fetchSingleBlog.fulfilled, (state, action) => {
        const { data } = action.payload || {};

        state.dataLoading = false;
        state.singleBlog = data || {};
      })

      .addCase(fetchSingleBlog.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // =================================================
      // DELETE BLOG
      // =================================================
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;

        const deletedBlogId =
          action.meta.arg.blogId;

        state.blogList = state.blogList.filter(
          (blog) =>
            blog._id !== deletedBlogId
        );

        state.documentCount = Math.max(
          0,
          state.documentCount - 1
        );
      })

      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blogSlice.actions;

export default blogSlice.reducer;
