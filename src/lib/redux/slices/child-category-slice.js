import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

// Async thunk to create or update a child category
export const createChildCategory = createAsyncThunk(
  "childCategory/createChildCategory",
  async (childCategoryInput, { rejectWithValue }) => {
    const { token, childCategoryData, childCategoryId } = childCategoryInput;

    const endPoint = childCategoryId
      ? `${BACKEND_API_BASE_URL}/api/child-category/${childCategoryId}`
      : `${BACKEND_API_BASE_URL}/api/child-category`;

    try {
      const response = await axios({
        method: childCategoryId ? "PUT" : "POST",
        url: endPoint,
        data: childCategoryData,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create or update child category."
      );
    }
  }
);

// Async thunk to fetch all child categories
export const fetchChildCategories = createAsyncThunk(
  "childCategory/fetchChildCategories",
  async (option, { rejectWithValue }) => {
    const { token } = option;
    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/child-category`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch child categories."
      );
    }
  }
);

// Async thunk to delete a child category
export const deleteChildCategory = createAsyncThunk(
  "childCategory/deleteChildCategory",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/child-category/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete child category."
      );
    }
  }
);

// Initial state
const initialState = {
  childCategoryList: [],
  documentCount: 0,
  loading: false, // Loading for individual actions
  dataLoading: true, // Initial loading for child category list
  error: null, // Error message
};

// Child Category slice
const childCategorySlice = createSlice({
  name: "childCategory",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create or Update Child Category
      .addCase(createChildCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChildCategory.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.childCategoryList.findIndex(
          (childCategory) => childCategory._id === action.payload?._id
        );

        if (existingIndex === -1) {
          // Add new child category to the top
          state.childCategoryList.unshift(action.payload);
        } else {
          // Update existing child category
          state.childCategoryList[existingIndex] = action.payload;
        }
      })
      .addCase(createChildCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Child Categories
      .addCase(fetchChildCategories.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchChildCategories.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.childCategoryList = data; // Populate the child category list
        state.documentCount = count;
      })
      .addCase(fetchChildCategories.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // Delete Child Category
      .addCase(deleteChildCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChildCategory.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg?.id;
        state.childCategoryList = state.childCategoryList.filter(
          (childCategory) => childCategory._id !== deletedId
        );
      })
      .addCase(deleteChildCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = childCategorySlice.actions;
export default childCategorySlice.reducer;
