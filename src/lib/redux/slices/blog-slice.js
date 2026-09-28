import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

// Async thunk to create a blog
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
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create blog."
      );
    }
  }
);

// Async thunk to fetch all categories
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (option, { rejectWithValue }) => {
    const { token, filters } = option;
    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/blog`,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...filters,
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories."
      );
    }
  }
);

export const fetchSingleBlog = createAsyncThunk(
  "blog/fetchSingleBlog",
  async (option, { rejectWithValue }) => {
    const { token, blogId } = option;
    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/blog/${blogId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories."
      );
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (option, { rejectWithValue }) => {
    const { token, blogId } = option;
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/admin/blog/${blogId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete blog."
      );
    }
  }
);

// Initial state
const initialState = {
  blogList: [],
  singleBlog: {},
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// blog slice
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
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        // const existingIndex = state.blogList.findIndex(
        //   (blog) => blog._id === action.payload?._id
        // );

        // if (existingIndex === -1) {
        //   // If the category does not exist, add it to the top (index 0)
        //   state.blogList.unshift(action.payload);
        // } else {
        //   // If the category exists, update the entire object
        //   state.blogList[existingIndex] = action.payload;
        // }
        // state.blogList.unshift(action.payload);
      })

      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchBlogs.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.blogList = data; // Populate the blog list
        state.documentCount = count;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleBlog.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchSingleBlog.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.dataLoading = false;
        state.singleBlog = data;
      })
      .addCase(fetchSingleBlog.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })



.addCase(deleteBlog.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deleteBlog.fulfilled, (state, action) => {
  state.loading = false;

  state.blogList = state.blogList.filter(
    (blog) => blog._id !== action.meta.arg.blogId
  );

  state.documentCount = Math.max(0, state.documentCount - 1);
})
.addCase(deleteBlog.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});

  },
});

export const { resetError } = blogSlice.actions;
export default blogSlice.reducer;
