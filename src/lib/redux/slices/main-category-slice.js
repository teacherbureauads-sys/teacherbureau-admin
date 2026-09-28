import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

// Async thunk to create a category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryInput, { rejectWithValue }) => {
    const { token, categoryData, categoryId } = categoryInput;

    const endPoint = categoryId
      ? `${BACKEND_API_BASE_URL}/api/category/${categoryId}`
      : `${BACKEND_API_BASE_URL}/api/category`;

    try {
      const response = await axios({
        method: categoryId ? "PUT" : "POST",
        url: endPoint,
        data: categoryData,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category."
      );
    }
  }
);

// Async thunk to fetch all categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (option, { rejectWithValue }) => {
    const { token, filters } = option;
    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/category`,
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
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async ({id,token}, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/category/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category."
      );
    }
  }
);
// Initial state
const initialState = {
  categoryList: [],
  documentCount: 0,
  loading: false, // Loading for individual actions
  dataLoading: true, // Initial loading for category list
  error: null, // Error message
};

// Category slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.categoryList.findIndex(
          (category) => category._id === action.payload?._id
        );

        if (existingIndex === -1) {
          // If the category does not exist, add it to the top (index 0)
          state.categoryList.unshift(action.payload);
        } else {
          // If the category exists, update the entire object
          state.categoryList[existingIndex] = action.payload;
        }
      })

      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.categoryList = data; // Populate the category list
        state.documentCount = count;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Prefer the id we sent in the request over whatever the backend
        // echoes back in the response body (some APIs return {}, some
        // return the deleted doc, some return nothing useful) — this way
        // the row always disappears from the list immediately.
        const deletedCategoryId =
          action.meta.arg?.id || action.payload?._id;
        state.categoryList = state.categoryList.filter(
          (category) => category._id !== deletedCategoryId
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = categorySlice.actions;
export default categorySlice.reducer;
