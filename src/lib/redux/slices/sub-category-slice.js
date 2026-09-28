import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

// Async thunk to create or update a subcategory
export const createSubCategory = createAsyncThunk(
  "subCategory/createSubCategory",
  async (subCategoryInput, { rejectWithValue }) => {
    const { token, subCategoryData, subCategoryId } = subCategoryInput;

    const endPoint = subCategoryId
      ? `${BACKEND_API_BASE_URL}/api/sub-category/${subCategoryId}`
      : `${BACKEND_API_BASE_URL}/api/sub-category`;

    try {
      const response = await axios({
        method: subCategoryId ? "PUT" : "POST",
        url: endPoint,
        data: subCategoryData,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create or update subcategory."
      );
    }
  }
);

// Async thunk to fetch all subcategories
export const fetchSubCategories = createAsyncThunk(
  "subCategory/fetchSubCategories",
  async (option, { rejectWithValue }) => {
    const { token } = option;
    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/sub-category`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subcategories."
      );
    }
  }
);

// Async thunk to delete a subcategory
export const deleteSubCategory = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/sub-category/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subcategory."
      );
    }
  }
);

// Initial state
const initialState = {
  subCategoryList: [],
  documentCount: 0,
  loading: false, // Loading for individual actions
  dataLoading: true, // Initial loading for subcategory list
  error: null, // Error message
};

// SubCategory slice
const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create or Update SubCategory
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.subCategoryList.findIndex(
          (subCategory) => subCategory._id === action.payload?._id
        );

        if (existingIndex === -1) {
          // Add new subcategory to the top
          state.subCategoryList.unshift(action.payload);
        } else {
          // Update existing subcategory
          state.subCategoryList[existingIndex] = action.payload;
        }
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch SubCategories
      .addCase(fetchSubCategories.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.subCategoryList = data; // Populate the subcategory list
        state.documentCount = count;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // Delete SubCategory
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg?.id;
        state.subCategoryList = state.subCategoryList.filter(
          (subCategory) => subCategory._id !== deletedId
        );
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = subCategorySlice.actions;
export default subCategorySlice.reducer;
